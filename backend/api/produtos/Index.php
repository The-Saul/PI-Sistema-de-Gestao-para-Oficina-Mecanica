<?php

// ============================================================
// CodeMec — /api/produtos/index.php
// Métodos: GET (listar) | POST (criar)
// ============================================================
require_once '../../config/cors.php';
require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET /api/produtos/
// Lista todos os produtos com busca por nome/código
// Query params opcionais:
//   ?busca=filtro    → filtra por nome ou código
//   ?pagina=1&limite=100
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $busca  = trim($_GET['busca']  ?? '');
    $pagina = max(1, (int)($_GET['pagina'] ?? 1));
    $limite = max(1, min(100, (int)($_GET['limite'] ?? 50)));
    $offset = ($pagina - 1) * $limite;

    $where  = '';
    $params = [];

    if ($busca !== '') {
        $where            = "WHERE p.nome ILIKE :busca OR p.codigo ILIKE :codigo";
        $params[':busca']  = "%{$busca}%";
        $params[':codigo'] = "%{$busca}%";
    }

    $stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM produtos p {$where}");
    $stmtTotal->execute($params);
    $total = (int) $stmtTotal->fetchColumn();

    $sql = "
        SELECT
            p.id,
            p.codigo,
            p.nome,
            p.descricao,
            p.unidade,
            p.preco_compra,
            p.preco_venda,
            p.quantidade_atual,
            p.quantidade_minima,
            p.observacao,
            TO_CHAR(p.criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
        FROM produtos p
        {$where}
        ORDER BY p.nome ASC
        LIMIT :limite OFFSET :offset
    ";

    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $produtos = $stmt->fetchAll();

    echo json_encode([
        'dados'         => $produtos,
        'total'         => $total,
        'pagina'        => $pagina,
        'limite'        => $limite,
        'total_paginas' => (int) ceil($total / $limite),
    ]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST /api/produtos/
// Cria um novo produto
// ─────────────────────────────────────────────────────────────
if ($method === 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body) {
        http_response_code(400);
        echo json_encode(['erro' => 'Body inválido ou vazio.']);
        exit;
    }

    // Nome obrigatório
    $nome = trim($body['nome'] ?? '');
    if ($nome === '') {
        http_response_code(422);
        echo json_encode(['erro' => 'O campo nome é obrigatório.']);
        exit;
    }

    // Código: se informado, verifica duplicata
    $codigo = trim($body['codigo'] ?? '');
    if ($codigo !== '') {
        $stmtCod = $pdo->prepare("SELECT id FROM produtos WHERE codigo = :codigo");
        $stmtCod->execute([':codigo' => $codigo]);
        if ($stmtCod->fetch()) {
            http_response_code(409);
            echo json_encode(['erro' => 'Já existe um produto com este código.']);
            exit;
        }
    }

    // Unidade válida
    $unidades_validas = ['un', 'kg', 'L', 'm', 'cx', 'par'];
    $unidade = trim($body['unidade'] ?? 'un');
    if (!in_array($unidade, $unidades_validas)) {
        $unidade = 'un';
    }

    $sql = "
        INSERT INTO produtos
            (codigo, nome, descricao, unidade,
             preco_compra, preco_venda,
             quantidade_atual, quantidade_minima, observacao)
        VALUES
            (:codigo, :nome, :descricao, :unidade,
             :preco_compra, :preco_venda,
             :quantidade_atual, :quantidade_minima, :observacao)
        RETURNING id, TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':codigo'           => $codigo           ?: null,
        ':nome'             => $nome,
        ':descricao'        => trim($body['descricao']    ?? '') ?: null,
        ':unidade'          => $unidade,
        ':preco_compra'     => (float)($body['preco_compra']  ?? 0),
        ':preco_venda'      => (float)($body['preco_venda']   ?? 0),
        ':quantidade_atual' => (float)($body['quantidade_atual']  ?? 0),
        ':quantidade_minima'=> (float)($body['quantidade_minima'] ?? 0),
        ':observacao'       => trim($body['observacao'] ?? '') ?: null,
    ]);

    $resultado = $stmt->fetch();

    http_response_code(201);
    echo json_encode([
        'mensagem'  => 'Produto cadastrado com sucesso.',
        'id'        => (int) $resultado['id'],
        'criado_em' => $resultado['criado_em'],
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);