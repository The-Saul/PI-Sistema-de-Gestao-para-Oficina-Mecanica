<?php

// ============================================================
// CodeMec — /api/financeiro/movimentacao.php
// Métodos: GET | PUT | DELETE
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id || $id <= 0) {

    http_response_code(400);

    echo json_encode([
        'erro' => 'ID inválido.'
    ]);

    exit;
}

function buscarMovimentacao(PDO $pdo, int $id): ?array {

    $stmt = $pdo->prepare("
        SELECT *
        FROM financeiro
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id
    ]);

    $movimentacao = $stmt->fetch();

    return $movimentacao ?: null;
}

// ─────────────────────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $movimentacao = buscarMovimentacao($pdo, $id);

    if (!$movimentacao) {

        http_response_code(404);

        echo json_encode([
            'erro' => 'Movimentação não encontrada.'
        ]);

        exit;
    }

    echo json_encode($movimentacao);
    exit;
}

// ─────────────────────────────────────────────────────────────
// PUT
// ─────────────────────────────────────────────────────────────
if ($method === 'PUT') {

    $movimentacao = buscarMovimentacao($pdo, $id);

    if (!$movimentacao) {

        http_response_code(404);

        echo json_encode([
            'erro' => 'Movimentação não encontrada.'
        ]);

        exit;
    }

    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body) {

        http_response_code(400);

        echo json_encode([
            'erro' => 'Body inválido.'
        ]);

        exit;
    }

    $cliente = trim($body['cliente'] ?? '');
    $servico = trim($body['servico'] ?? '');

    $valor = (float) ($body['valor'] ?? 0);

    if ($cliente === '' || $servico === '' || $valor <= 0) {

        http_response_code(422);

        echo json_encode([
            'erro' => 'Campos inválidos.'
        ]);

        exit;
    }

    $sql = "
        UPDATE financeiro SET
            cliente = :cliente,
            servico = :servico,
            valor = :valor
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $id,
        ':cliente' => $cliente,
        ':servico' => $servico,
        ':valor' => $valor
    ]);

    echo json_encode([
        'mensagem' => 'Movimentação atualizada com sucesso.'
    ]);

    exit;
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────
if ($method === 'DELETE') {

    $movimentacao = buscarMovimentacao($pdo, $id);

    if (!$movimentacao) {

        http_response_code(404);

        echo json_encode([
            'erro' => 'Movimentação não encontrada.'
        ]);

        exit;
    }

    $stmt = $pdo->prepare("
        DELETE FROM financeiro
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $id
    ]);

    echo json_encode([
        'mensagem' => 'Movimentação removida com sucesso.'
    ]);

    exit;
}

http_response_code(405);

echo json_encode([
    'erro' => 'Método não permitido.'
]);