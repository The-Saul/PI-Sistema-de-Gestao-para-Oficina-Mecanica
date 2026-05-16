<?php

require_once "../config/headers.php";
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

try {

    $pdo->beginTransaction();

    $sqlProduto = "
    SELECT
        id,
        quantidade_atual
    FROM produtos
    WHERE codigo = :codigo
    ";

    $stmtProduto = $pdo->prepare($sqlProduto);

    $stmtProduto->execute([
        ":codigo" => $data["codigo"]
    ]);

    $produto = $stmtProduto->fetch(PDO::FETCH_ASSOC);

    if (!$produto) {
        throw new Exception("Produto não encontrado");
    }

    $novaQuantidade =
        $produto["quantidade_atual"] -
        $data["quantidade"];

    if ($novaQuantidade < 0) {
        throw new Exception("Quantidade insuficiente");
    }

    $sqlUpdate = "
    UPDATE produtos
    SET quantidade_atual = :quantidade
    WHERE id = :id
    ";

    $stmtUpdate = $pdo->prepare($sqlUpdate);

    $stmtUpdate->execute([
        ":quantidade" => $novaQuantidade,
        ":id" => $produto["id"]
    ]);

    $sqlMov = "
    INSERT INTO movimentacoes_estoque (
        produto_id,
        tipo,
        quantidade,
        motivo,
        observacao
    )
    VALUES (
        :produto_id,
        'saida',
        :quantidade,
        'Retirada manual',
        :observacao
    )
    ";

    $stmtMov = $pdo->prepare($sqlMov);

    $stmtMov->execute([
        ":produto_id" => $produto["id"],
        ":quantidade" => $data["quantidade"],
        ":observacao" => $data["observacao"]
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Retirada realizada"
    ]);

} catch (Exception $e) {

    $pdo->rollBack();

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}