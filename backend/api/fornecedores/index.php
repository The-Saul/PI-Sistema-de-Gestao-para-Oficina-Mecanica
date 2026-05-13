<?php

// ============================================================
// CodeMec — /api/fornecedores/index.php
// Métodos: GET (listar) | POST (criar)
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET /api/fornecedores/
// Lista todos os fornecedores com busca por nome/CNPJ
// Query params opcionais:
//   ?busca=norte      → filtra por nome ou CNPJ
//   ?pagina=1&limite=20
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $busca  = trim($_GET['busca']  ?? '');
    $pagina = max(1, (int)($_GET['pagina'] ?? 1));
    $limite = max(1, min(100, (int)($_GET['limite'] ?? 20)));
    $offset = ($pagina - 1) * $limite;

    $where  = '';
    $params = [];

    if ($busca !== '') {
        $where            = "WHERE nome ILIKE :busca OR cnpj LIKE :cnpj";
        $params[':busca'] = "%{$busca}%";
        $params[':cnpj']  = "%{$busca}%";
    }

    // Total para paginação
    $stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM fornecedores {$where}");
    $stmtTotal->execute($params);
    $total = (int) $stmtTotal->fetchColumn();

    $sql = "
        SELECT
            id, nome, cnpj, telefone, email,
            cep, rua, numero, bairro, cidade, estado, complemento,
            TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
        FROM fornecedores
        {$where}
        ORDER BY nome ASC
        LIMIT :limite OFFSET :offset
    ";

    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $fornecedores = $stmt->fetchAll();

    echo json_encode([
        'dados'         => $fornecedores,
        'total'         => $total,
        'pagina'        => $pagina,
        'limite'        => $limite,
        'total_paginas' => (int) ceil($total / $limite),
    ]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST /api/fornecedores/
// Cria um novo fornecedor
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

    // CNPJ: remove formatação e valida tamanho
    $cnpj = preg_replace('/\D/', '', $body['cnpj'] ?? '');
    if ($cnpj !== '' && strlen($cnpj) !== 14) {
        http_response_code(422);
        echo json_encode(['erro' => 'CNPJ inválido. Informe 14 dígitos numéricos.']);
        exit;
    }

    // Verifica CNPJ duplicado
    if ($cnpj !== '') {
        $stmtCnpj = $pdo->prepare("SELECT id FROM fornecedores WHERE cnpj = :cnpj");
        $stmtCnpj->execute([':cnpj' => $cnpj]);
        if ($stmtCnpj->fetch()) {
            http_response_code(409);
            echo json_encode(['erro' => 'Já existe um fornecedor cadastrado com este CNPJ.']);
            exit;
        }
    }

    $cep = preg_replace('/\D/', '', $body['cep'] ?? '');

    $sql = "
        INSERT INTO fornecedores
            (nome, cnpj, telefone, email,
             cep, rua, numero, bairro, cidade, estado, complemento)
        VALUES
            (:nome, :cnpj, :telefone, :email,
             :cep, :rua, :numero, :bairro, :cidade, :estado, :complemento)
        RETURNING id, TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome'        => $nome,
        ':cnpj'        => $cnpj                              ?: null,
        ':telefone'    => trim($body['telefone']    ?? '')   ?: null,
        ':email'       => trim($body['email']       ?? '')   ?: null,
        ':cep'         => $cep                               ?: null,
        ':rua'         => trim($body['rua']         ?? '')   ?: null,
        ':numero'      => trim($body['numero']      ?? '')   ?: null,
        ':bairro'      => trim($body['bairro']      ?? '')   ?: null,
        ':cidade'      => trim($body['cidade']      ?? '')   ?: null,
        ':estado'      => trim($body['estado']      ?? '')   ?: null,
        ':complemento' => trim($body['complemento'] ?? '')   ?: null,
    ]);

    $resultado = $stmt->fetch();

    http_response_code(201);
    echo json_encode([
        'mensagem'  => 'Fornecedor cadastrado com sucesso.',
        'id'        => (int) $resultado['id'],
        'criado_em' => $resultado['criado_em'],
    ]);
    exit;
}

// Método não suportado
http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);