<?php

require_once "../../config/headers.php";
require_once "../../config/database.php";

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido'
    ]);

    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$usuario = trim($dados['usuario'] ?? '');
$senha = trim($dados['senha'] ?? '');

if (empty($usuario) || empty($senha)) {

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Usuário e senha são obrigatórios'
    ]);

    exit;
}

try {

    $pdo = getConnection();

    $stmt = $pdo->prepare("
        SELECT *
        FROM usuarios
        WHERE usuario = :usuario
        AND ativo = true
        LIMIT 1
    ");

    $stmt->bindValue(':usuario', $usuario);
    $stmt->execute();

    $user = $stmt->fetch();

    if (!$user) {

        http_response_code(401);

        echo json_encode([
            'success' => false,
            'message' => 'Usuário não encontrado'
        ]);

        exit;
    }

    if (!password_verify($senha, $user['senha_hash'])) {

        http_response_code(401);

        echo json_encode([
            'success' => false,
            'message' => 'Senha inválida'
        ]);

        exit;
    }

    $_SESSION['usuario_id'] = $user['id'];
    $_SESSION['usuario_nome'] = $user['nome'];
    $_SESSION['usuario_login'] = $user['usuario'];

    echo json_encode([
        'success' => true,
        'usuario' => [
            'id' => $user['id'],
            'nome' => $user['nome'],
            'usuario' => $user['usuario']
        ]
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}