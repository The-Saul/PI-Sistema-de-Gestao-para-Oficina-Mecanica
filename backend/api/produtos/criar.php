<?php

// ======================================================
// estoque/cadastrar.php
// ======================================================

require_once "../config/headers.php";
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

try {

    $pdo->beginTransaction();

    $sql = "
    INSERT INTO produtos (
        codigo,
        nome,
        fornecedor_id,
        preco_compra,
        preco_venda,
        quantidade_atual,
        quantidade_minima,
        observacao
    )
    VALUES (
        :codigo,
        :nome,
        :fornecedor_id,
        :preco_compra,
        :preco_venda,
        :quantidade_atual,
        :quantidade_minima,
        :observacao
    )
    RETURNING id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":codigo" => $data["codigo"],
        ":nome" => $data["nome"],
        ":fornecedor_id" => !empty($data["fornecedor_id"])
            ? $data["fornecedor_id"]
            : null,
        ":preco_compra" => $data["preco_compra"] ?? 0,
        ":preco_venda" => $data["preco_venda"],
        ":quantidade_atual" => $data["quantidade"],
        ":quantidade_minima" => $data["quantidade_minima"] ?? 5,
        ":observacao" => $data["observacao"] ?? ""
    ]);

    $produto = $stmt->fetch();

    if ($data["quantidade"] > 0) {

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
            'entrada',
            :quantidade,
            'Cadastro inicial',
            :observacao
        )
        ";

        $stmtMov = $pdo->prepare($sqlMov);

        $stmtMov->execute([
            ":produto_id" => $produto["id"],
            ":quantidade" => $data["quantidade"],
            ":observacao" => $data["observacao"] ?? ""
        ]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Produto cadastrado com sucesso"
    ]);

} catch (Exception $e) {

    $pdo->rollBack();

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}