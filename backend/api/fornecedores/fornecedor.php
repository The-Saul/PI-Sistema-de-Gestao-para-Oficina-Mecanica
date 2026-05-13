<?php

// ============================================================
// CodeMec — /api/fornecedores/fornecedor.php
// Métodos: GET (buscar um) | PUT (atualizar) | DELETE (deletar)
// Query param obrigatório: ?id=1
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Valida o parâmetro ?id=
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id || $id <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetro "id" inválido ou ausente.']);
    exit;
}

function buscarFornecedor(PDO $pdo, int $id): ?array {
    $stmt = $pdo->prepare("SELECT * FROM fornecedores WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $fornecedor = $stmt->fetch();
    return $fornecedor ?: null;
}

// ─────────────────────────────────────────────────────────────
// GET — Retorna um fornecedor pelo ID
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $fornecedor = buscarFornecedor($pdo, $id);

    if (!$fornecedor) {
        http_response_code(404);
        echo json_encode(['erro' => 'Fornecedor não encontrado.']);
        exit;
    }

    echo json_encode($fornecedor);
    exit;
}

// ─────────────────────────────────────────────────────────────
// PUT — Atualiza um fornecedor existente
// ─────────────────────────────────────────────────────────────
if ($method === 'PUT') {

    $fornecedor = buscarFornecedor($pdo, $id);
    if (!$fornecedor) {
        http_response_code(404);
        echo json_encode(['erro' => 'Fornecedor não encontrado.']);
        exit;
    }

    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) {
        http_response_code(400);
        echo json_encode(['erro' => 'Body inválido ou vazio.']);
        exit;
    }

    $nome = trim($body['nome'] ?? '');
    if ($nome === '') {
        http_response_code(422);
        echo json_encode(['erro' => 'O campo nome é obrigatório.']);
        exit;
    }

    $cnpj = preg_replace('/\D/', '', $body['cnpj'] ?? '');
    if ($cnpj !== '' && strlen($cnpj) !== 14) {
        http_response_code(422);
        echo json_encode(['erro' => 'CNPJ inválido. Informe 14 dígitos numéricos.']);
        exit;
    }

    // Verifica CNPJ duplicado em outro fornecedor
    if ($cnpj !== '') {
        $stmtCnpj = $pdo->prepare("SELECT id FROM fornecedores WHERE cnpj = :cnpj AND id <> :id");
        $stmtCnpj->execute([':cnpj' => $cnpj, ':id' => $id]);
        if ($stmtCnpj->fetch()) {
            http_response_code(409);
            echo json_encode(['erro' => 'Outro fornecedor já está cadastrado com este CNPJ.']);
            exit;
        }
    }

    $cep = preg_replace('/\D/', '', $body['cep'] ?? '');

    $sql = "
        UPDATE fornecedores SET
            nome        = :nome,
            cnpj        = :cnpj,
            telefone    = :telefone,
            email       = :email,
            cep         = :cep,
            rua         = :rua,
            numero      = :numero,
            bairro      = :bairro,
            cidade      = :cidade,
            estado      = :estado,
            complemento = :complemento
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'          => $id,
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

    echo json_encode(['mensagem' => 'Fornecedor atualizado com sucesso.']);
    exit;
}

// ─────────────────────────────────────────────────────────────
// DELETE — Remove um fornecedor
// ─────────────────────────────────────────────────────────────
if ($method === 'DELETE') {

    $fornecedor = buscarFornecedor($pdo, $id);
    if (!$fornecedor) {
        http_response_code(404);
        echo json_encode(['erro' => 'Fornecedor não encontrado.']);
        exit;
    }

    // Verifica se há produtos vinculados a este fornecedor
    $stmtProdutos = $pdo->prepare("SELECT COUNT(*) FROM produtos WHERE fornecedor_id = :id");
    $stmtProdutos->execute([':id' => $id]);
    if ((int)$stmtProdutos->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode([
            'erro' => 'Não é possível excluir este fornecedor pois ele possui produtos vinculados.'
        ]);
        exit;
    }

    // Verifica compras vinculadas
    $stmtCompras = $pdo->prepare("SELECT COUNT(*) FROM compras WHERE fornecedor_id = :id");
    $stmtCompras->execute([':id' => $id]);
    if ((int)$stmtCompras->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode([
            'erro' => 'Não é possível excluir este fornecedor pois ele possui compras vinculadas.'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM fornecedores WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['mensagem' => 'Fornecedor excluído com sucesso.']);
    exit;
}

// Método não suportado
http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);