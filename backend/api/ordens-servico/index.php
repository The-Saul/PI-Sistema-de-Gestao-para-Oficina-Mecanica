<?php

// ============================================================
// CodeMec — /api/ordens-servico/index.php
// POST → Cria uma OS completa com múltiplos serviços e peças
// GET  → Lista OS recentes
// ============================================================
require_once '../../config/cors.php';
require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET — Lista ordens de serviço recentes
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $limite = max(1, min(100, (int)($_GET['limite'] ?? 20)));
    $status = trim($_GET['status'] ?? '');

    $where  = '';
    $params = [];

    if (in_array($status, ['aberta','em_andamento','concluida','cancelada'])) {
        $where             = "WHERE status = :status";
        $params[':status'] = $status;
    }

    $sql = "
        SELECT
            id,
            veiculo_placa,
            veiculo_marca,
            veiculo_modelo,
            descricao_problema,
            servicos_realizados,
            valor_servico,
            valor_pecas,
            valor_total,
            status,
            TO_CHAR(criado_em,    'DD/MM/YYYY HH24:MI') AS criado_em,
            TO_CHAR(concluida_em, 'DD/MM/YYYY HH24:MI') AS concluida_em
        FROM ordens_servico
        {$where}
        ORDER BY criado_em DESC
        LIMIT :limite
    ";

    $stmt = $pdo->prepare($sql);
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['dados' => $stmt->fetchAll()]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST — Cria nova OS com múltiplos serviços
// Body JSON:
// {
//   "cliente_nome":       "Maria Silva",
//   "veiculo_placa":      "ABC1D23",
//   "veiculo_marca":      "Volkswagen",
//   "veiculo_modelo":     "Gol 1.6",
//   "descricao_problema": "Barulho no freio",
//   "servicos": [
//     { "descricao": "Troca de pastilhas", "valor": 150.00 },
//     { "descricao": "Alinhamento",        "valor":  80.00 }
//   ],
//   "pecas": [
//     { "produto_id": 5, "quantidade": 1, "preco_unitario": 90.00 }
//   ]
// }
// ─────────────────────────────────────────────────────────────
if ($method === 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body) {
        http_response_code(400);
        echo json_encode(['erro' => 'Body inválido ou vazio.']);
        exit;
    }

    $clienteNome       = trim($body['cliente_nome']       ?? '');
    $veiculoPlaca      = strtoupper(trim($body['veiculo_placa']  ?? ''));
    $veiculoMarca      = trim($body['veiculo_marca']      ?? '');
    $veiculoModelo     = trim($body['veiculo_modelo']     ?? '');
    $descricaoProblema = trim($body['descricao_problema'] ?? '');
    $servicos          = $body['servicos'] ?? [];
    $pecas             = $body['pecas']    ?? [];

    // Validação — pelo menos um serviço obrigatório
    if (empty($servicos) || !is_array($servicos)) {
        http_response_code(422);
        echo json_encode(['erro' => 'A OS deve ter pelo menos um serviço.']);
        exit;
    }

    // Valida cada serviço
    foreach ($servicos as $i => $servico) {
        $desc  = trim($servico['descricao'] ?? '');
        $valor = (float)($servico['valor']  ?? 0);
        if ($desc === '' || $valor <= 0) {
            http_response_code(422);
            echo json_encode(['erro' => "Serviço #" . ($i+1) . ": descrição e valor são obrigatórios."]);
            exit;
        }
    }

    // Valida e verifica estoque das peças
    $valorPecas = 0;
    foreach ($pecas as $i => $peca) {
        $produtoId     = (int)($peca['produto_id']       ?? 0);
        $quantidade    = (float)($peca['quantidade']     ?? 0);
        $precoUnitario = (float)($peca['preco_unitario'] ?? 0);

        if ($produtoId <= 0 || $quantidade <= 0 || $precoUnitario <= 0) {
            http_response_code(422);
            echo json_encode(['erro' => "Peça #" . ($i+1) . ": produto_id, quantidade e preco_unitario são obrigatórios."]);
            exit;
        }

        $stmtProd = $pdo->prepare("SELECT nome, quantidade_atual FROM produtos WHERE id = :id");
        $stmtProd->execute([':id' => $produtoId]);
        $produto = $stmtProd->fetch();

        if (!$produto) {
            http_response_code(404);
            echo json_encode(['erro' => "Produto ID {$produtoId} não encontrado."]);
            exit;
        }

        if ((float)$produto['quantidade_atual'] < $quantidade) {
            http_response_code(409);
            echo json_encode([
                'erro' => "Estoque insuficiente para \"{$produto['nome']}\". Disponível: {$produto['quantidade_atual']}, necessário: {$quantidade}."
            ]);
            exit;
        }

        $valorPecas += $quantidade * $precoUnitario;
    }

    // Calcula valor total dos serviços
    $valorServico = 0;
    foreach ($servicos as $s) {
        $valorServico += (float)$s['valor'];
    }

    $valorTotal = $valorServico + $valorPecas;

    // Monta resumo para o campo servicos_realizados
    $listaServicos = [];
    foreach ($servicos as $s) {
        $listaServicos[] = trim($s['descricao']);
    }
    $resumoServicos = implode(', ', $listaServicos);

    // Transação
    $pdo->beginTransaction();

    try {

        // 1. Insere a OS
        $stmtOS = $pdo->prepare("
            INSERT INTO ordens_servico (
                usuario_id,
                veiculo_placa, veiculo_marca, veiculo_modelo,
                descricao_problema, servicos_realizados,
                valor_servico, valor_pecas,
                status
            ) VALUES (
                NULL,
                :placa, :marca, :modelo,
                :problema, :servicos_realizados,
                :valor_servico, :valor_pecas,
                'concluida'
            )
            RETURNING id
        ");
        $stmtOS->execute([
            ':placa'               => $veiculoPlaca    ?: null,
            ':marca'               => $veiculoMarca    ?: null,
            ':modelo'              => $veiculoModelo   ?: null,
            ':problema'            => $descricaoProblema ?: null,
            ':servicos_realizados' => $resumoServicos,
            ':valor_servico'       => $valorServico,
            ':valor_pecas'         => $valorPecas,
        ]);
        $osId = (int) $stmtOS->fetchColumn();

        // 2. Insere cada serviço em itens_servico_os
        foreach ($servicos as $servico) {
            $pdo->prepare("
                INSERT INTO itens_servico_os (os_id, descricao, valor)
                VALUES (:os_id, :descricao, :valor)
            ")->execute([
                ':os_id'     => $osId,
                ':descricao' => trim($servico['descricao']),
                ':valor'     => (float)$servico['valor'],
            ]);
        }

        // 3. Insere peças e baixa estoque
        foreach ($pecas as $peca) {
            $produtoId     = (int)$peca['produto_id'];
            $quantidade    = (float)$peca['quantidade'];
            $precoUnitario = (float)$peca['preco_unitario'];

            $pdo->prepare("
                INSERT INTO itens_os (os_id, produto_id, quantidade, preco_unitario)
                VALUES (:os_id, :produto_id, :quantidade, :preco_unitario)
            ")->execute([
                ':os_id'          => $osId,
                ':produto_id'     => $produtoId,
                ':quantidade'     => $quantidade,
                ':preco_unitario' => $precoUnitario,
            ]);

            $pdo->prepare("
                UPDATE produtos
                SET quantidade_atual = quantidade_atual - :quantidade
                WHERE id = :id
            ")->execute([':quantidade' => $quantidade, ':id' => $produtoId]);

            $pdo->prepare("
                INSERT INTO movimentacoes_estoque
                    (produto_id, usuario_id, tipo, quantidade, motivo, referencia_tipo, referencia_id)
                VALUES (:produto_id, NULL, 'saida', :quantidade, :motivo, 'os', :os_id)
            ")->execute([
                ':produto_id' => $produtoId,
                ':quantidade' => $quantidade,
                ':motivo'     => "OS #{$osId}" . ($clienteNome ? " — {$clienteNome}" : ''),
                ':os_id'      => $osId,
            ]);
        }

        // 4. Marca como concluída
        $pdo->prepare("UPDATE ordens_servico SET concluida_em = NOW() WHERE id = :id")
            ->execute([':id' => $osId]);

        // 5. Lançamento financeiro
        // Monta descrição limpa: só serviços e peças, sem código nem tipo
        $descServicos = implode(', ', array_map(fn($s) => $s['descricao'], $servicos));

        $descPecas = '';
        if (!empty($pecas)) {
            $nomesPecas = [];
            foreach ($pecas as $peca) {
                $stmtNome = $pdo->prepare("SELECT nome FROM produtos WHERE id = :id");
                $stmtNome->execute([':id' => $peca['produto_id']]);
                $nomePeca = $stmtNome->fetchColumn();
                $nomesPecas[] = "{$nomePeca} ({$peca['quantidade']}x)";
            }
            $descPecas = ' | Peças: ' . implode(', ', $nomesPecas);
        }

        $descFinanceiro = "Serviços: {$descServicos}{$descPecas}";
        if ($clienteNome) $descFinanceiro .= " | Cliente: {$clienteNome}";
        if ($veiculoPlaca) $descFinanceiro .= " | Veículo: {$veiculoPlaca}";

        $pdo->prepare("
            INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id)
            VALUES ('entrada', :descricao, :valor, 'os', :os_id)
        ")->execute([
            ':descricao' => $descFinanceiro,
            ':valor'     => $valorTotal,
            ':os_id'     => $osId,
        ]);

        $pdo->commit();

        http_response_code(201);
        echo json_encode([
            'mensagem'    => 'Ordem de serviço registrada com sucesso.',
            'os_id'       => $osId,
            'valor_total' => $valorTotal,
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'erro'    => 'Erro ao processar a ordem de serviço.',
            'detalhe' => $e->getMessage(),
        ]);
    }

    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);