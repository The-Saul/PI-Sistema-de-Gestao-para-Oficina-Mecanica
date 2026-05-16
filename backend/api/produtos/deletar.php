<?php

// ======================================================
// estoque/deletar.php
// ======================================================

require_once "../config/headers.php";
require_once "../config/database.php";

$id = $_GET["id"] ?? null;

try {

    if (!$id) {
        throw new Exception("ID não informado");
    }

    $sql = "
    DELETE FROM produtos
    WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":id" => $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Produto deletado"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}