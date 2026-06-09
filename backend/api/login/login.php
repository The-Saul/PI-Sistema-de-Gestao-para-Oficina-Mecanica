<?php
require_once '../../config/cors.php';
require_once "../../config/headers.php";
require_once "../../config/database.php";

$conn = getConnection();

$dados = json_decode(
    file_get_contents("php://input"),
    true
);

$usuario = trim($dados["usuario"] ?? "");
$senha   = trim($dados["senha"] ?? "");

if (empty($usuario) || empty($senha)) {

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
        senha_hash,
        cargo,
        ativo
    FROM usuarios
    WHERE usuario = :usuario
    LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bindParam(":usuario", $usuario);
$stmt->execute();

$user = $stmt->fetch();

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