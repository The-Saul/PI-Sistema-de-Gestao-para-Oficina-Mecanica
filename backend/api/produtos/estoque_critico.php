<?php

require_once "../config/headers.php";
require_once "../config/database.php";

try {

    $sql = "
    SELECT *
    FROM vw_estoque_critico
    ";

    $stmt = $pdo->query($sql);

    $dados = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($dados);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}