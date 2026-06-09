<?php

define("DB_HOST", "localhost");
define("DB_PORT", "5432");
define("DB_NAME", "pi-oficina");
define("DB_USER", "postgres");
define("DB_PASS", "1234");

function getConnection(): PDO
{
    static $pdo = null;

    if ($pdo === null) {

        $dsn = sprintf(
            "pgsql:host=%s;port=%s;dbname=%s",
            DB_HOST,
            DB_PORT,
            DB_NAME
        );

        try {

            $pdo = new PDO(
                $dsn,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );

        } catch (PDOException $e) {

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "message" => "Erro na conexão com o banco",
                "erro" => $e->getMessage()
            ]);

            exit();
        }
    }

    return $pdo;
}