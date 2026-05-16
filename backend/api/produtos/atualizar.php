<?php

// ======================================================
// estoque/atualizarQuantidade.php
// ======================================================

require_once "../config/headers.php";
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

try {

    $sql = "
    UPDATE produtos
    SET quantidade_atual = :quantidade
    WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":quantidade" => $data["quantidade_atual"],
        ":id" => $data["id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Quantidade atualizada"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}