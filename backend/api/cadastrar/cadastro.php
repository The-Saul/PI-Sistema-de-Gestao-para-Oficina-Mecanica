<?php
require_once "../../config/cors.php";
require_once "../../config/database.php";

$conn = getConnection();

$data = json_decode(file_get_contents("php://input"), true);

$nome    = trim($data["nome"] ?? "");
$usuario = trim($data["usuario"] ?? ""); // email
$senha   = trim($data["senha"] ?? "");
$cargo   = trim($data["cargo"] ?? "funcionario");

$validos = ["admin", "funcionario_admin", "funcionario"];

if (!in_array($cargo, $validos)) {
    $cargo = "funcionario";
}

if (!$nome || !$usuario || !$senha) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Preencha nome, email e senha"
    ]);
    exit;
}

/* verifica se já existe */
$check = $conn->prepare("SELECT id FROM usuarios WHERE usuario = :usuario");
$check->execute([":usuario" => $usuario]);

if ($check->fetch()) {
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "Email já cadastrado"
    ]);
    exit;
}

$senhaHash = password_hash($senha, PASSWORD_BCRYPT);

$sql = "INSERT INTO usuarios (nome, usuario, senha_hash, cargo)
        VALUES (:nome, :usuario, :senha, :cargo)";

$stmt = $conn->prepare($sql);

$stmt->execute([
    ":nome" => $nome,
    ":usuario" => $usuario,
    ":senha" => $senhaHash,
    ":cargo" => $cargo
]);

echo json_encode([
    "success" => true,
    "message" => "Usuário cadastrado com sucesso"
]);