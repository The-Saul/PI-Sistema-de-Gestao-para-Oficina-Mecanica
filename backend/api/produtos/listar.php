<?php

// ======================================================
// estoque/listar.php
// ======================================================

require_once "../config/headers.php";
require_once "../config/database.php";

try {

    $sql = "
    SELECT
        p.id,
        p.codigo,
        p.nome,
        p.quantidade_atual,
        p.quantidade_minima,
        p.preco_venda,
        p.preco_compra,
        p.observacao,
        p.criado_em,
        f.nome AS fornecedor
    FROM produtos p
    LEFT JOIN fornecedores f
        ON f.id = p.fornecedor_id
    ORDER BY p.id DESC
    ";

    $stmt = $pdo->query($sql);

    $produtos = $stmt->fetchAll();

    echo json_encode($produtos);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}