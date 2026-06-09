<?php

// ============================================================
// CodeMec — /api/produtos/proximo-codigo.php
// GET → retorna o próximo código disponível para um produto
// Ex: se o último for "PRO-007", retorna "PRO-008"
// ============================================================
require_once '../../config/cors.php';
require_once '../../config/headers.php';
require_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.']);
    exit;
}

$pdo = getConnection();

// Busca o último código no padrão XXX-000
$stmt = $pdo->query("
    SELECT codigo FROM produtos
    WHERE codigo ~ '^[A-Z]{3}-[0-9]+$'
    ORDER BY
        CAST(SUBSTRING(codigo FROM 5) AS INTEGER) DESC
    LIMIT 1
");

$ultimo = $stmt->fetchColumn();

if ($ultimo) {
    // Extrai o prefixo e o número e incrementa
    $partes  = explode('-', $ultimo);
    $prefixo = $partes[0];                  // ex: "FLO"
    $numero  = (int)$partes[1] + 1;        // ex: 8
    $proximo = $prefixo . '-' . str_pad($numero, 3, '0', STR_PAD_LEFT);
} else {
    // Nenhum produto cadastrado ainda
    $proximo = 'PRO-001';
}

// Garante que o código gerado não existe (loop de segurança)
$tentativas = 0;
while ($tentativas < 100) {
    $stmtCheck = $pdo->prepare("SELECT id FROM produtos WHERE codigo = :codigo");
    $stmtCheck->execute([':codigo' => $proximo]);
    if (!$stmtCheck->fetch()) break; // código disponível

    // Incrementa e tenta novamente
    $partes  = explode('-', $proximo);
    $numero  = (int)$partes[1] + 1;
    $proximo = $partes[0] . '-' . str_pad($numero, 3, '0', STR_PAD_LEFT);
    $tentativas++;
}

echo json_encode(['codigo' => $proximo]);