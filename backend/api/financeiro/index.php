<?php

// ============================================================
// CodeMec — /api/financeiro/index.php
// Métodos: GET (listar) | POST (criar)
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET — Lista movimentações financeiras com totais
// Query params opcionais:
//   ?tipo=entrada|saida
//   ?mes=2026-05
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $tipo = trim($_GET['tipo'] ?? '');
    $mes  = trim($_GET['mes']  ?? '');

    $condicoes = [];
    $params    = [];

    if ($tipo !== '' && ($tipo === 'entrada' || $tipo === 'saida')) {
        $condicoes[]     = "tipo = :tipo";
        $params[':tipo'] = $tipo;
    }

    if ($mes !== '') {
        $condicoes[]    = "TO_CHAR(criado_em, 'YYYY-MM') = :mes";
        $params[':mes'] = $mes;
    }

    if (count($condicoes) > 0) {
        $where = 'WHERE ' . implode(' AND ', $condicoes);
    } else {
        $where = '';
    }

    // Lista movimentações
    $sql = "
        SELECT
            id,
            tipo,
            descricao,
            valor,
            referencia_tipo,
            referencia_id,
            TO_CHAR(criado_em, 'DD/MM/YYYY') AS data,
            TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
        FROM financeiro
        {$where}
        ORDER BY criado_em DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $dados = $stmt->fetchAll();

    // Total de entradas
    if ($mes !== '') {
        $sqlEnt = "SELECT COALESCE(SUM(valor), 0) FROM financeiro WHERE tipo = 'entrada' AND TO_CHAR(criado_em, 'YYYY-MM') = :mes";
        $stmtEnt = $pdo->prepare($sqlEnt);
        $stmtEnt->execute([':mes' => $mes]);
    } else {
        $sqlEnt = "SELECT COALESCE(SUM(valor), 0) FROM financeiro WHERE tipo = 'entrada'";
        $stmtEnt = $pdo->prepare($sqlEnt);
        $stmtEnt->execute();
    }
    $totalEntradas = (float) $stmtEnt->fetchColumn();

    // Total de saídas
    if ($mes !== '') {
        $sqlSai = "SELECT COALESCE(SUM(valor), 0) FROM financeiro WHERE tipo = 'saida' AND TO_CHAR(criado_em, 'YYYY-MM') = :mes";
        $stmtSai = $pdo->prepare($sqlSai);
        $stmtSai->execute([':mes' => $mes]);
    } else {
        $sqlSai = "SELECT COALESCE(SUM(valor), 0) FROM financeiro WHERE tipo = 'saida'";
        $stmtSai = $pdo->prepare($sqlSai);
        $stmtSai->execute();
    }
    $totalSaidas = (float) $stmtSai->fetchColumn();

    echo json_encode([
        'dados'          => $dados,
        'total_entradas' => $totalEntradas,
        'total_saidas'   => $totalSaidas,
        'saldo'          => $totalEntradas - $totalSaidas,
    ]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST — Cria nova movimentação financeira manual
// ─────────────────────────────────────────────────────────────
if ($method === 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body) {
        http_response_code(400);
        echo json_encode(['erro' => 'Body inválido ou vazio.']);
        exit;
    }

    $tipo      = trim($body['tipo']      ?? '');
    $descricao = trim($body['descricao'] ?? '');
    $valor     = (float)($body['valor']  ?? 0);

    if ($tipo !== 'entrada' && $tipo !== 'saida') {
        http_response_code(422);
        echo json_encode(['erro' => 'Tipo inválido. Use "entrada" ou "saida".']);
        exit;
    }

    if ($descricao === '') {
        http_response_code(422);
        echo json_encode(['erro' => 'A descrição é obrigatória.']);
        exit;
    }

    if ($valor <= 0) {
        http_response_code(422);
        echo json_encode(['erro' => 'O valor deve ser maior que zero.']);
        exit;
    }

    $referenciaTipo = trim($body['referencia_tipo'] ?? '');
    $referenciaId   = isset($body['referencia_id']) ? (int)$body['referencia_id'] : null;

    $validos = ['venda', 'os', 'compra', 'ajuste'];
    if (!in_array($referenciaTipo, $validos)) {
        $referenciaTipo = 'ajuste';
    }

    $sql = "
        INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id)
        VALUES (:tipo, :descricao, :valor, :referencia_tipo, :referencia_id)
        RETURNING id, TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':tipo'            => $tipo,
        ':descricao'       => $descricao,
        ':valor'           => $valor,
        ':referencia_tipo' => $referenciaTipo,
        ':referencia_id'   => $referenciaId,
    ]);

    $resultado = $stmt->fetch();

    http_response_code(201);
    echo json_encode([
        'mensagem'  => 'Movimentação registrada com sucesso.',
        'id'        => (int) $resultado['id'],
        'criado_em' => $resultado['criado_em'],
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);