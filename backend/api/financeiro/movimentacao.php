<?php

// ============================================================
// CodeMec — /api/financeiro/movimentacao.php
// Métodos: GET | DELETE
// Query param obrigatório: ?id=1
// Nota: PUT foi removido pois movimentações financeiras
// não devem ser editadas — apenas excluídas e recriadas.
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';
require_once '../../config/cors.php';
$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id || $id <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetro "id" inválido ou ausente.']);
    exit;
}

function buscarMovimentacao(PDO $pdo, int $id): ?array {
    $stmt = $pdo->prepare("
        SELECT
            id, tipo, descricao, valor,
            referencia_tipo, referencia_id,
            TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
        FROM financeiro
        WHERE id = :id
    ");
    $stmt->execute([':id' => $id]);
    $mov = $stmt->fetch();
    return $mov ?: null;
}

// ─────────────────────────────────────────────────────────────
// GET — Retorna uma movimentação pelo ID
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $mov = buscarMovimentacao($pdo, $id);

    if (!$mov) {
        http_response_code(404);
        echo json_encode(['erro' => 'Movimentação não encontrada.']);
        exit;
    }

    echo json_encode($mov);
    exit;
}

// ─────────────────────────────────────────────────────────────
// DELETE — Remove uma movimentação
// ─────────────────────────────────────────────────────────────
if ($method === 'DELETE') {

    $mov = buscarMovimentacao($pdo, $id);

    if (!$mov) {
        http_response_code(404);
        echo json_encode(['erro' => 'Movimentação não encontrada.']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM financeiro WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['mensagem' => 'Movimentação excluída com sucesso.']);
    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);