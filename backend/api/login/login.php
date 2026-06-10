<?php
require_once '../../config/cors.php';
require_once "../../config/headers.php";
require_once "../../config/database.php";

$conn = getConnection();

$dados = json_decode(file_get_contents("php://input"), true);

$email = trim($dados["email"] ?? "");
$senha = trim($dados["senha"] ?? "");

if (empty($email) || empty($senha)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos"
    ]);
    exit();
}

$sql = "
    SELECT
        id,
        nome,
        usuario,
        cargo,
        ativo,
        senha_hash
    FROM usuarios
    WHERE usuario = :email
    LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bindParam(":email", $email);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Usuário não encontrado"
    ]);
    exit();
}

if (!$user["ativo"]) {
    http_response_code(403);
    echo json_encode([
        "success" => false,
        "message" => "Usuário inativo"
    ]);
    exit();
}

if (!password_verify($senha, $user["senha_hash"])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Senha inválida"
    ]);
    exit();
}

unset($user["senha_hash"]);

echo json_encode([
    "success" => true,
    "usuario" => $user
]);