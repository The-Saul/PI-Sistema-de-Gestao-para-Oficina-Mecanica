<?php

// ============================================================
// CodeMec — Conexão com o banco de dados PostgreSQL via PDO
// ============================================================

define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'pi-oficina');      // Altere se o nome do seu banco for diferente
define('DB_USER', 'postgres');     // Altere para o seu usuário do PostgreSQL
define('DB_PASS', '1234');             // Altere para a sua senha do PostgreSQL

function getConnection(): PDO {
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'pgsql:host=%s;port=%s;dbname=%s',
            DB_HOST,
            DB_PORT,
            DB_NAME
        );

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'erro' => 'Falha na conexão com o banco de dados.',
                'detalhe' => $e->getMessage()   // Remova em produção!
            ]);
            exit;
        }
    }

    return $pdo;
}