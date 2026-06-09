<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$email = $dados['email'] ?? '';

if (!$email) {
    http_response_code(400);
    echo json_encode([
        "message" => "Informe o e-mail"
    ]);
    exit;
}

$codigo = "123456";

echo json_encode([
    "success" => true,
    "codigo" => $codigo,
    "message" => "Código gerado"
]);