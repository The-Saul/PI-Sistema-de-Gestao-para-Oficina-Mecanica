<?php

// ============================================================
// CodeMec — /api/clientes/cliente.php
// Métodos: GET (buscar um) | PUT (atualizar) | DELETE (deletar)
// Query param obrigatório: ?id=1
// ============================================================

require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Valida o parâmetro ?id=
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id || $id <= 0) {
    http_response_code(400);
    echo json_encode(['erro' => 'Parâmetro "id" inválido ou ausente.']);
    exit;
}

// Helper: verifica se o cliente existe e retorna o registro
function buscarCliente(PDO $pdo, int $id): ?array {
    $stmt = $pdo->prepare("SELECT * FROM clientes WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $cliente = $stmt->fetch();
    return $cliente ?: null;
}

// ─────────────────────────────────────────────────────────────
// GET /api/clientes/cliente.php?id=1
// Retorna os dados de um cliente específico
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $cliente = buscarCliente($pdo, $id);

    if (!$cliente) {
        http_response_code(404);
        echo json_encode(['erro' => 'Cliente não encontrado.']);
        exit;
    }

    echo json_encode($cliente);
    exit;
}

// ─────────────────────────────────────────────────────────────
// PUT /api/clientes/cliente.php?id=1
// Atualiza os dados de um cliente existente
// Body: JSON com os campos a atualizar
// ─────────────────────────────────────────────────────────────
if ($method === 'PUT') {

    $cliente = buscarCliente($pdo, $id);
    if (!$cliente) {
        http_response_code(404);
        echo json_encode(['erro' => 'Cliente não encontrado.']);
        exit;
    }

    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) {
        http_response_code(400);
        echo json_encode(['erro' => 'Body inválido ou vazio.']);
        exit;
    }

    // Nome obrigatório
    $nome = trim($body['nome'] ?? '');
    if ($nome === '') {
        http_response_code(422);
        echo json_encode(['erro' => 'O campo nome é obrigatório.']);
        exit;
    }

    // CPF
    $cpf = preg_replace('/\D/', '', $body['cpf'] ?? '');
    if ($cpf !== '' && strlen($cpf) !== 11) {
        http_response_code(422);
        echo json_encode(['erro' => 'CPF inválido. Informe 11 dígitos numéricos.']);
        exit;
    }

    // Verifica CPF duplicado em outro cliente
    if ($cpf !== '') {
        $stmtCpf = $pdo->prepare("SELECT id FROM clientes WHERE cpf = :cpf AND id <> :id");
        $stmtCpf->execute([':cpf' => $cpf, ':id' => $id]);
        if ($stmtCpf->fetch()) {
            http_response_code(409);
            echo json_encode(['erro' => 'Outro cliente já está cadastrado com este CPF.']);
            exit;
        }
    }

    $cep = preg_replace('/\D/', '', $body['cep'] ?? '');

    $sql = "
        UPDATE clientes SET
            nome           = :nome,
            cpf            = :cpf,
            telefone       = :telefone,
            email          = :email,
            cep            = :cep,
            rua            = :rua,
            numero         = :numero,
            bairro         = :bairro,
            cidade         = :cidade,
            estado         = :estado,
            complemento    = :complemento,
            veiculo_placa  = :veiculo_placa,
            veiculo_marca  = :veiculo_marca,
            veiculo_modelo = :veiculo_modelo
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'             => $id,
        ':nome'           => $nome,
        ':cpf'            => $cpf          ?: null,
        ':telefone'       => trim($body['telefone']       ?? '') ?: null,
        ':email'          => trim($body['email']          ?? '') ?: null,
        ':cep'            => $cep          ?: null,
        ':rua'            => trim($body['rua']            ?? '') ?: null,
        ':numero'         => trim($body['numero']         ?? '') ?: null,
        ':bairro'         => trim($body['bairro']         ?? '') ?: null,
        ':cidade'         => trim($body['cidade']         ?? '') ?: null,
        ':estado'         => trim($body['estado']         ?? '') ?: null,
        ':complemento'    => trim($body['complemento']    ?? '') ?: null,
        ':veiculo_placa'  => trim($body['veiculo_placa']  ?? '') ?: null,
        ':veiculo_marca'  => trim($body['veiculo_marca']  ?? '') ?: null,
        ':veiculo_modelo' => trim($body['veiculo_modelo'] ?? '') ?: null,
    ]);

    echo json_encode(['mensagem' => 'Cliente atualizado com sucesso.']);
    exit;
}

// ─────────────────────────────────────────────────────────────
// DELETE /api/clientes/cliente.php?id=1
// Remove um cliente (somente se não houver vínculos críticos)
// ─────────────────────────────────────────────────────────────
if ($method === 'DELETE') {

    $cliente = buscarCliente($pdo, $id);
    if (!$cliente) {
        http_response_code(404);
        echo json_encode(['erro' => 'Cliente não encontrado.']);
        exit;
    }

    // Verifica se o cliente possui vendas vinculadas
    $stmtVendas = $pdo->prepare("SELECT COUNT(*) FROM vendas WHERE cliente_id = :id");
    $stmtVendas->execute([':id' => $id]);
    if ((int)$stmtVendas->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode([
            'erro' => 'Não é possível excluir este cliente pois ele possui vendas vinculadas.'
        ]);
        exit;
    }

    // Verifica ordens de serviço vinculadas
    $stmtOS = $pdo->prepare("SELECT COUNT(*) FROM ordens_servico WHERE cliente_id = :id");
    $stmtOS->execute([':id' => $id]);
    if ((int)$stmtOS->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode([
            'erro' => 'Não é possível excluir este cliente pois ele possui ordens de serviço vinculadas.'
        ]);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM clientes WHERE id = :id");
    $stmt->execute([':id' => $id]);

    echo json_encode(['mensagem' => 'Cliente excluído com sucesso.']);
    exit;
}

// Método não suportado
http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);