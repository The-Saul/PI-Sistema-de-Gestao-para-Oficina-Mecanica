<?php

require_once "../config/headers.php";
require_once "../config/database.php";

try {

    $sql = "
    SELECT
        m.id,
        p.nome,
        m.quantidade,
        m.tipo,
        m.motivo,
        m.observacao,
        m.data_mov,
        m.criado_em
    FROM movimentacoes_estoque m
    INNER JOIN produtos p
        ON p.id = m.produto_id
    ORDER BY m.id DESC
    ";

    $stmt = $pdo->query($sql);

    $historico = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($historico);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}