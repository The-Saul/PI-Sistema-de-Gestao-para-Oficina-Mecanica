<?php
require_once '../../config/headers.php';
require_once '../../config/database.php';
require_once '../../config/cors.php';
$pdo = getConnection();

$stmtVendas = $pdo->query("SELECT COUNT(*) FROM vendas");
$totalVendas = (int) $stmtVendas->fetchColumn();

$stmtOS = $pdo->query("SELECT COUNT(*) FROM ordens_servico");
$totalOS = (int) $stmtOS->fetchColumn();

echo json_encode([
    'total' => $totalVendas + $totalOS
]);