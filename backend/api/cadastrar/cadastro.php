<?php

require_once "../config/headers.php";
require_once "../config/database.php";

$conn = getConnection();

$dados = json_decode(
    file_get_contents("php://input"),
    true
);

$nome = trim($dados["nome"] ?? "");
$email = trim($dados["email"] ?? "");
$senha = trim($dados["senha"] ?? "");

if (
    empty($nome) ||
    empty($email) ||
    empty($senha)
) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos"
    ]);

    exit();
}

$stmt = $conn->prepare("
    SELECT id
    FROM usuarios
    WHERE usuario = :usuario
");

$stmt->execute([
    ":usuario" => $email
]);

if ($stmt->fetch()) {

    http_response_code(409);

    echo json_encode([
        "success" => false,
        "message" => "Usuário já cadastrado"
    ]);

    exit();
}

$hash = password_hash(
    $senha,
    PASSWORD_BCRYPT
);

$stmt = $conn->prepare("
    INSERT INTO usuarios
    (
        nome,
        usuario,
        senha_hash
    )
    VALUES
    (
        :nome,
        :usuario,
        :senha
    )
");

$stmt->execute([
    ":nome" => $nome,
    ":usuario" => $email,
    ":senha" => $hash
]);

echo json_encode([
    "success" => true,
    "message" => "Conta criada com sucesso"
]);