// ============================================================
// CodeMec — /api/financeiro/index.php
// Métodos: GET (listar) | POST (criar)
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET — Lista movimentações financeiras
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $tipo = trim($_GET['tipo'] ?? '');

    $where  = '';
    $params = [];

    if ($tipo !== '') {
        $where = "WHERE tipo = :tipo";
        $params[':tipo'] = $tipo;
    }

    $sql = "
        SELECT
            id,
            tipo,
            cliente,
            servico,
            valor,
            data_movimentacao,
            TO_CHAR(criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
        FROM financeiro
        {$where}
        ORDER BY data_movimentacao DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $dados = $stmt->fetchAll();

    echo json_encode($dados);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST — Cria nova movimentação
// ─────────────────────────────────────────────────────────────
if ($method === 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body) {
        http_response_code(400);
        echo json_encode([
            'erro' => 'Body inválido ou vazio.'
        ]);
        exit;
    }

    $tipo = trim($body['tipo'] ?? '');

    if (!in_array($tipo, ['venda', 'entrada'])) {
        http_response_code(422);

        echo json_encode([
            'erro' => 'Tipo inválido.'
        ]);

        exit;
    }

    $cliente = trim($body['cliente'] ?? '');
    $servico = trim($body['servico'] ?? '');

    $valor = (float) ($body['valor'] ?? 0);

    $data = trim($body['data_movimentacao'] ?? '');

    if ($cliente === '' || $servico === '' || $valor <= 0 || $data === '') {

        http_response_code(422);

        echo json_encode([
            'erro' => 'Preencha todos os campos obrigatórios.'
        ]);

        exit;
    }

    $sql = "
        INSERT INTO financeiro
        (
            tipo,
            cliente,
            servico,
            valor,
            data_movimentacao
        )
        VALUES
        (
            :tipo,
            :cliente,
            :servico,
            :valor,
            :data_movimentacao
        )
        RETURNING id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':tipo' => $tipo,
        ':cliente' => $cliente,
        ':servico' => $servico,
        ':valor' => $valor,
        ':data_movimentacao' => $data,
    ]);

    $resultado = $stmt->fetch();

    http_response_code(201);

    echo json_encode([
        'mensagem' => 'Movimentação criada com sucesso.',
        'id' => (int) $resultado['id']
    ]);

    exit;
}

http_response_code(405);

echo json_encode([
    'erro' => 'Método não permitido.'
]);