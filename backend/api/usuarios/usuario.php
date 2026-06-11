<?php
require_once '../../config/cors.php';
require_once "../../config/headers.php";
require_once "../../config/database.php";

$conn = getConnection();

$id = $_GET["id"] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID do usuário não informado"]);
    exit;
}

// ============================================================
// PUT — Atualiza usuário (ativo, nome, email, cargo, senha)
// ============================================================
if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    $dados = json_decode(file_get_contents("php://input"), true);

    // Se veio apenas o campo "ativo" — fluxo de ativar/desativar
    if (isset($dados["ativo"]) && count($dados) === 1) {
        $ativo = $dados["ativo"];
        if (!is_bool($ativo)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Campo 'ativo' deve ser true ou false"]);
            exit;
        }
        $stmt = $conn->prepare("UPDATE usuarios SET ativo = :ativo WHERE id = :id");
        $stmt->bindParam(":ativo", $ativo, PDO::PARAM_BOOL);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        echo json_encode(["success" => true, "message" => "Status atualizado com sucesso"]);
        exit;
    }

    // Edição completa
    $nome    = trim($dados["nome"]    ?? "");
    $usuario = trim($dados["usuario"] ?? "");
    $cargo   = trim($dados["cargo"]   ?? "");
    $senha   = trim($dados["senha"]   ?? "");

    if (!$nome || !$usuario || !$cargo) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Nome, e-mail e cargo são obrigatórios"]);
        exit;
    }

    $cargosValidos = ["admin", "funcionario_admin", "funcionario"];
    if (!in_array($cargo, $cargosValidos)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Cargo inválido"]);
        exit;
    }

    try {
        if ($senha) {
            // Atualiza com nova senha
            $hash = password_hash($senha, PASSWORD_BCRYPT);
            $stmt = $conn->prepare("
                UPDATE usuarios
                SET nome = :nome, usuario = :usuario, cargo = :cargo, senha_hash = :senha
                WHERE id = :id
            ");
            $stmt->execute([
                ":nome"    => $nome,
                ":usuario" => $usuario,
                ":cargo"   => $cargo,
                ":senha"   => $hash,
                ":id"      => $id,
            ]);
        } else {
            // Atualiza sem alterar senha
            $stmt = $conn->prepare("
                UPDATE usuarios
                SET nome = :nome, usuario = :usuario, cargo = :cargo
                WHERE id = :id
            ");
            $stmt->execute([
                ":nome"    => $nome,
                ":usuario" => $usuario,
                ":cargo"   => $cargo,
                ":id"      => $id,
            ]);
        }

        echo json_encode(["success" => true, "message" => "Usuário atualizado com sucesso"]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erro ao atualizar usuário", "error" => $e->getMessage()]);
    }

    exit;
}

// ============================================================
// DELETE — Exclui usuário
// ============================================================
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    try {
        $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = :id");
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Usuário não encontrado"]);
            exit;
        }

        echo json_encode(["success" => true, "message" => "Usuário excluído com sucesso"]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Erro ao excluir usuário", "error" => $e->getMessage()]);
    }

    exit;
}

// ============================================================
// Outros métodos não permitidos
// ============================================================
http_response_code(405);
echo json_encode(["success" => false, "message" => "Método não permitido"]);