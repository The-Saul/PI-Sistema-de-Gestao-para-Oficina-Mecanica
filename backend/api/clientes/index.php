<?php

// ============================================================
// CodeMec — /api/clientes/index.php
// Métodos: GET (listar) | POST (criar)
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET /api/clientes/
// Lista todos os clientes com suporte a busca por nome/CPF
// e paginação simples.
// Query params opcionais:
//   ?busca=carlos       → filtra por nome ou CPF
//   ?pagina=1&limite=10 → paginação
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $busca  = trim($_GET['busca']  ?? '');
    $pagina = max(1, (int)($_GET['pagina'] ?? 1));
    $limite = max(1, min(100, (int)($_GET['limite'] ?? 20)));
    $offset = ($pagina - 1) * $limite;

    // Monta filtro dinâmico
    $where  = '';
    $params = [];

    if ($busca !== '') {
        $where    = "WHERE nome ILIKE :busca OR cpf LIKE :cpf";
        $params[':busca'] = "%{$busca}%";
        $params[':cpf']   = "%{$busca}%";
    }

    // Conta o total para o frontend saber quantas páginas existem
    $stmtTotal = $pdo->prepare("SELECT COUNT(*) FROM clientes {$where}");
    $stmtTotal->execute($params);
    $total = (int) $stmtTotal->fetchColumn();

    // Busca os registros da página atual
    $sql = "
        SELECT
            id, nome, cpf, telefone, email,
            cep, rua, numero, bairro, cidade, estado, complemento,
            veiculo_placa, veiculo_marca, veiculo_modelo,
            TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
        FROM clientes
        {$where}
        ORDER BY nome ASC
        LIMIT :limite OFFSET :offset
    ";

    $stmt = $pdo->prepare($sql);

    // Bind dos parâmetros de busca (se existirem)
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }

    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $clientes = $stmt->fetchAll();

    echo json_encode([
        'dados'       => $clientes,
        'total'       => $total,
        'pagina'      => $pagina,
        'limite'      => $limite,
        'total_paginas' => (int) ceil($total / $limite),
    ]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST /api/clientes/
// Cria um novo cliente
// Body: JSON com os campos do cliente
// ─────────────────────────────────────────────────────────────
if ($method === 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body) {
        http_response_code(400);
        echo json_encode(['erro' => 'Body inválido ou vazio.']);
        exit;
    }

    // Validações obrigatórias
    $nome = trim($body['nome'] ?? '');
    if ($nome === '') {
        http_response_code(422);
        echo json_encode(['erro' => 'O campo nome é obrigatório.']);
        exit;
    }

    // CPF: remove tudo que não for dígito e valida tamanho
    $cpf = preg_replace('/\D/', '', $body['cpf'] ?? '');
    if ($cpf !== '' && strlen($cpf) !== 11) {
        http_response_code(422);
        echo json_encode(['erro' => 'CPF inválido. Informe 11 dígitos numéricos.']);
        exit;
    }

    // Verifica CPF duplicado
    if ($cpf !== '') {
        $stmtCpf = $pdo->prepare("SELECT id FROM clientes WHERE cpf = :cpf");
        $stmtCpf->execute([':cpf' => $cpf]);
        if ($stmtCpf->fetch()) {
            http_response_code(409);
            echo json_encode(['erro' => 'Já existe um cliente cadastrado com este CPF.']);
            exit;
        }
    }

    // CEP: somente dígitos
    $cep = preg_replace('/\D/', '', $body['cep'] ?? '');

    $sql = "
        INSERT INTO clientes
            (nome, cpf, telefone, email,
             cep, rua, numero, bairro, cidade, estado, complemento,
             veiculo_placa, veiculo_marca, veiculo_modelo)
        VALUES
            (:nome, :cpf, :telefone, :email,
             :cep, :rua, :numero, :bairro, :cidade, :estado, :complemento,
             :veiculo_placa, :veiculo_marca, :veiculo_modelo)
        RETURNING id, TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nome'           => $nome,
        ':cpf'            => $cpf          ?: null,
        ':telefone'       => trim($body['telefone']       ?? '') ?: null,
        ':email'          => trim($body['email']          ?? '') ?: null,
        ':cep'            => $cep          ?: null,
        ':rua'            => trim($body['rua']            ?? '') ?: null,
        ':numero'         => trim($body['numero']         ?? '') ?: null,
        ':bairro'         => trim($body['bairro']         ?? '') ?: null,
        ':cidade'         => trim($body['cidade']         ?? '') ?: null,
        ':estado'         => trim($body['estado']         ?? '') ?: null,
        ':complemento'    => trim($body['complemento']    ?? '') ?: null,
        ':veiculo_placa'  => trim($body['veiculo_placa']  ?? '') ?: null,
        ':veiculo_marca'  => trim($body['veiculo_marca']  ?? '') ?: null,
        ':veiculo_modelo' => trim($body['veiculo_modelo'] ?? '') ?: null,
    ]);

    $resultado = $stmt->fetch();

    http_response_code(201);
    echo json_encode([
        'mensagem'  => 'Cliente cadastrado com sucesso.',
        'id'        => (int) $resultado['id'],
        'criado_em' => $resultado['criado_em'],
    ]);
    exit;
}

// Método não suportado
http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);