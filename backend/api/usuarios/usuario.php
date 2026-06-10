<?php
require_once '../../config/cors.php';
require_once "../../config/headers.php";
require_once "../../config/database.php";

$conn = getConnection();

/**
 * ============================================================
 * ATUALIZAR STATUS DO USUÁRIO (ATIVO / INATIVO)
 * Método: PUT
 * URL: usuario.php?id=1
 * Body: { "ativo": true }
 * ============================================================
 */

if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    // Pega ID da URL
    $id = $_GET["id"] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "ID do usuário não informado"
        ]);
        exit;
    }

    // Pega JSON do body
    $dados = json_decode(file_get_contents("php://input"), true);

    $ativo = $dados["ativo"] ?? null;

    if (!is_bool($ativo)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Campo 'ativo' deve ser true ou false"
        ]);
        exit;
    }

    try {

        $sql = "UPDATE usuarios SET ativo = :ativo WHERE id = :id";
        $stmt = $conn->prepare($sql);

        $stmt->bindParam(":ativo", $ativo, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);

        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Status do usuário atualizado com sucesso"
        ]);

    } catch (Exception $e) {

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "message" => "Erro ao atualizar usuário",
            "error" => $e->getMessage()
        ]);
    }

    exit;
}

/**
 * ============================================================
 * BLOQUEIA OUTROS MÉTODOS
 * ============================================================
 */
http_response_code(405);

echo json_encode([
    "success" => false,
    "message" => "Método não permitido"
]);