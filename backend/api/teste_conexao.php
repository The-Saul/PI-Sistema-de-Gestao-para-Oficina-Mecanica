<?php

header("Content-Type: application/json; charset=UTF-8");

try {

    $pdo = new PDO(
        "pgsql:host=localhost;port=5432;dbname=pi-oficina",
        "postgres",
        "1234"
    );

    echo json_encode([
        "success" => true,
        "message" => "Conectado com sucesso ao PostgreSQL"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "erro" => $e->getMessage()
    ]);

}