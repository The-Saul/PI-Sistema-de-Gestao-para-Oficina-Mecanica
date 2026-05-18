<?php

// ============================================================
// CodeMec — /api/produtos/produto.php
// Métodos: GET (buscar um) | PUT (atualizar) | DELETE (deletar)
// Query param obrigatório: ?id=1
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id || $id <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetro "id" inválido ou ausente.']);
    exit;
}

function buscarProduto(PDO $pdo, int $id): ?array {
    $stmt = $pdo->prepare("SELECT * FROM produtos WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $produto = $stmt->fetch();
    return $produto ?: null;
}

// ─────────────────────────────────────────────────────────────
// GET — Retorna um produto pelo ID
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $produto = buscarProduto($pdo, $id);

    if (!$produto) {
        http_response_code(404);
        echo json_encode(['erro' => 'Produto não encontrado.']);
        exit;
    }

    echo json_encode($produto);
    exit;
}

// ─────────────────────────────────────────────────────────────
// PUT — Atualiza um produto existente
// ─────────────────────────────────────────────────────────────
if ($method === 'PUT') {

    $produto = buscarProduto($pdo, $id);
    if (!$produto) {
        http_response_code(404);
        echo json_encode(['erro' => 'Produto não encontrado.']);
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

    // Verifica código duplicado em outro produto
    $codigo = trim($body['codigo'] ?? '');
    if ($codigo !== '') {
        $stmtCod = $pdo->prepare("SELECT id FROM produtos WHERE codigo = :codigo AND id <> :id");
        $stmtCod->execute([':codigo' => $codigo, ':id' => $id]);
        if ($stmtCod->fetch()) {
            http_response_code(409);
            echo json_encode(['erro' => 'Outro produto já está cadastrado com este código.']);
            exit;
        }
    }

    $unidades_validas = ['un', 'kg', 'L', 'm', 'cx', 'par'];
    $unidade = trim($body['unidade'] ?? 'un');
    if (!in_array($unidade, $unidades_validas)) {
        $unidade = 'un';
    }

    $sql = "
        UPDATE produtos SET
            codigo            = :codigo,
            nome              = :nome,
            descricao         = :descricao,
            unidade           = :unidade,
            preco_compra      = :preco_compra,
            preco_venda       = :preco_venda,
            quantidade_atual  = :quantidade_atual,
            quantidade_minima = :quantidade_minima,
            observacao        = :observacao
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'               => $id,
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

    echo json_encode(['mensagem' => 'Produto atualizado com sucesso.']);
    exit;
}

// ─────────────────────────────────────────────────────────────
// DELETE — Remove um produto
// ─────────────────────────────────────────────────────────────
if ($method === 'DELETE') {

    $produto = buscarProduto($pdo, $id);
    if (!$produto) {
        http_response_code(404);
        echo json_encode(['erro' => 'Produto não encontrado.']);
        exit;
    }

    // Verifica se o produto está em itens de venda
    $stmtVenda = $pdo->prepare("SELECT COUNT(*) FROM itens_venda WHERE produto_id = :id");
    $stmtVenda->execute([':id' => $id]);
    if ((int)$stmtVenda->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['erro' => 'Não é possível excluir este produto pois ele está vinculado a vendas.']);
        exit;
    }

    // Verifica se está em itens de OS
    $stmtOS = $pdo->prepare("SELECT COUNT(*) FROM itens_os WHERE produto_id = :id");
    $stmtOS->execute([':id' => $id]);
    if ((int)$stmtOS->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['erro' => 'Não é possível excluir este produto pois ele está vinculado a ordens de serviço.']);
        exit;
    }

    // Remove movimentações de estoque antes de deletar
    $pdo->prepare("DELETE FROM movimentacoes_estoque WHERE produto_id = :id")->execute([':id' => $id]);

    $stmt = $pdo->prepare("DELETE FROM produtos WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['mensagem' => 'Produto excluído com sucesso.']);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);