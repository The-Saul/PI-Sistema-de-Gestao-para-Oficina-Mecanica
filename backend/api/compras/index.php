<?php

// ============================================================
// CodeMec — /api/compras/index.php
// POST → Cria uma compra completa:
//   1. Insere em compras
//   2. Insere os itens em itens_compra
//   3. Dá entrada no estoque em produtos
//   4. Registra movimentações de estoque
//   5. Lança saída em financeiro
// ============================================================
require_once '../../config/cors.php';
require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET — Lista compras recentes
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $limite = max(1, min(100, (int)($_GET['limite'] ?? 20)));

    $stmt = $pdo->prepare("
        SELECT
            c.id,
            f.nome AS fornecedor,
            c.total,
            c.observacao,
            TO_CHAR(c.data_compra, 'DD/MM/YYYY') AS data_compra,
            TO_CHAR(c.criado_em,   'DD/MM/YYYY HH24:MI') AS criado_em
        FROM compras c
        LEFT JOIN fornecedores f ON f.id = c.fornecedor_id
        ORDER BY c.criado_em DESC
        LIMIT :limite
    ");
    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['dados' => $stmt->fetchAll()]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST — Cria nova compra
// Body JSON:
// {
//   "fornecedor_nome": "Auto Peças Brasil",  (texto livre)
//   "fornecedor_id":   1,                   (opcional, se quiser vincular)
//   "observacao":      "...",               (opcional)
//   "itens": [
//     { "produto_id": 1, "quantidade": 10, "preco_unitario": 18.50 },
//     { "produto_id": 2, "quantidade":  5, "preco_unitario": 32.00 }
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

    $itens = $body['itens'] ?? [];

    if (empty($itens) || !is_array($itens)) {
        http_response_code(422);
        echo json_encode(['erro' => 'A compra deve ter pelo menos um item.']);
        exit;
    }

    // Valida os itens
    foreach ($itens as $i => $item) {
        $produtoId     = (int)($item['produto_id']    ?? 0);
        $quantidade    = (float)($item['quantidade']  ?? 0);
        $precoUnitario = (float)($item['preco_unitario'] ?? 0);

        if ($produtoId <= 0 || $quantidade <= 0 || $precoUnitario <= 0) {
            http_response_code(422);
            echo json_encode(['erro' => "Item #{$i}: produto_id, quantidade e preco_unitario são obrigatórios e devem ser maiores que zero."]);
            exit;
        }

        // Verifica se o produto existe
        $stmtProd = $pdo->prepare("SELECT id, nome FROM produtos WHERE id = :id");
        $stmtProd->execute([':id' => $produtoId]);
        if (!$stmtProd->fetch()) {
            http_response_code(404);
            echo json_encode(['erro' => "Produto ID {$produtoId} não encontrado."]);
            exit;
        }
    }

    // Calcula total
    $total = array_reduce($itens, fn($acc, $i) =>
        $acc + ((float)$i['quantidade'] * (float)$i['preco_unitario']), 0
    );

    $fornecedorNome = trim($body['fornecedor_nome'] ?? '');
    $fornecedorId   = filter_var($body['fornecedor_id'] ?? null, FILTER_VALIDATE_INT) ?: null;
    $observacao     = trim($body['observacao'] ?? '');

    // Transação
    $pdo->beginTransaction();

    try {

        // 1. Insere cabeçalho da compra
        $stmtCompra = $pdo->prepare("
            INSERT INTO compras (fornecedor_id, usuario_id, total, observacao, data_compra)
            VALUES (:fornecedor_id, NULL, :total, :observacao, CURRENT_DATE)
            RETURNING id
        ");
        $stmtCompra->execute([
            ':fornecedor_id' => $fornecedorId,
            ':total'         => $total,
            ':observacao'    => $observacao ?: null,
        ]);
        $compraId = (int) $stmtCompra->fetchColumn();

        // 2. Insere itens e dá entrada no estoque
        foreach ($itens as $item) {
            $produtoId     = (int)$item['produto_id'];
            $quantidade    = (float)$item['quantidade'];
            $precoUnitario = (float)$item['preco_unitario'];

            // Insere item da compra
            $pdo->prepare("
                INSERT INTO itens_compra (compra_id, produto_id, quantidade, preco_unitario)
                VALUES (:compra_id, :produto_id, :quantidade, :preco_unitario)
            ")->execute([
                ':compra_id'      => $compraId,
                ':produto_id'     => $produtoId,
                ':quantidade'     => $quantidade,
                ':preco_unitario' => $precoUnitario,
            ]);

            // Dá entrada no estoque
            $pdo->prepare("
                UPDATE produtos
                SET quantidade_atual = quantidade_atual + :quantidade
                WHERE id = :id
            ")->execute([':quantidade' => $quantidade, ':id' => $produtoId]);

            // Registra movimentação de estoque
            $motivo = "Compra #{$compraId}"
                . ($fornecedorNome ? " — {$fornecedorNome}" : '');

            $pdo->prepare("
                INSERT INTO movimentacoes_estoque
                    (produto_id, usuario_id, tipo, quantidade, motivo, referencia_tipo, referencia_id)
                VALUES
                    (:produto_id, NULL, 'entrada', :quantidade, :motivo, 'compra', :compra_id)
            ")->execute([
                ':produto_id' => $produtoId,
                ':quantidade' => $quantidade,
                ':motivo'     => $motivo,
                ':compra_id'  => $compraId,
            ]);
        }

        // 3. Lançamento financeiro de SAÍDA
        // Busca os nomes dos produtos comprados
        $nomesProdutos = [];
        foreach ($itens as $item) {
            $stmtNome = $pdo->prepare("SELECT nome FROM produtos WHERE id = :id");
            $stmtNome->execute([':id' => $item['produto_id']]);
            $nomeProd = $stmtNome->fetchColumn();
            $nomesProdutos[] = "{$nomeProd} ({$item['quantidade']}x)";
        }

        $descFinanceiro = "Produtos: " . implode(', ', $nomesProdutos);
        if ($fornecedorNome) $descFinanceiro .= " | Fornecedor: {$fornecedorNome}";
        if ($observacao)     $descFinanceiro .= " | Obs: {$observacao}";

        $pdo->prepare("
            INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id, fornecedor_id)
            VALUES ('saida', :descricao, :valor, 'compra', :compra_id, :fornecedor_id)
        ")->execute([
            ':descricao'     => $descFinanceiro,
            ':valor'         => $total,
            ':compra_id'     => $compraId,
            ':fornecedor_id' => $fornecedorId,
        ]);

        $pdo->commit();

        http_response_code(201);
        echo json_encode([
            'mensagem'  => 'Compra registrada com sucesso.',
            'compra_id' => $compraId,
            'total'     => $total,
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'erro'    => 'Erro ao processar a compra.',
            'detalhe' => $e->getMessage(),
        ]);
    }

    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);