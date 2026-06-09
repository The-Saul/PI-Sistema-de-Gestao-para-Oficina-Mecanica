<?php

// ============================================================
// CodeMec — /api/vendas/index.php
// POST → Cria uma venda completa:
//   1. Insere em vendas
//   2. Insere os itens em itens_venda
//   3. Baixa o estoque em produtos
//   4. Registra lançamento em financeiro
// GET  → Lista vendas recentes
// ============================================================
require_once '../../config/cors.php';
require_once '../../config/headers.php';
require_once '../../config/database.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ─────────────────────────────────────────────────────────────
// GET — Lista vendas recentes com seus itens
// ─────────────────────────────────────────────────────────────
if ($method === 'GET') {

    $limite = max(1, min(100, (int)($_GET['limite'] ?? 20)));

    $sql = "
        SELECT
            v.id,
            v.total,
            v.observacao,
            TO_CHAR(v.criado_em, 'DD/MM/YYYY HH24:MI') AS criado_em
        FROM vendas v
        ORDER BY v.criado_em DESC
        LIMIT :limite
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->execute();
    $vendas = $stmt->fetchAll();

    echo json_encode(['dados' => $vendas]);
    exit;
}

// ─────────────────────────────────────────────────────────────
// POST — Cria nova venda completa
// Body JSON:
// {
//   "cliente_nome": "João Silva",   (opcional, texto livre por enquanto)
//   "observacao":   "...",          (opcional)
//   "itens": [
//     { "produto_id": 1, "quantidade": 2, "preco_unitario": 45.00 },
//     { "produto_id": 3, "quantidade": 1, "preco_unitario": 35.00 }
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
        echo json_encode(['erro' => 'A venda deve ter pelo menos um item.']);
        exit;
    }

    // Valida e verifica estoque de cada item antes de qualquer inserção
    foreach ($itens as $i => $item) {
        $produtoId     = (int)($item['produto_id']    ?? 0);
        $quantidade    = (float)($item['quantidade']  ?? 0);
        $precoUnitario = (float)($item['preco_unitario'] ?? 0);

        if ($produtoId <= 0 || $quantidade <= 0 || $precoUnitario <= 0) {
            http_response_code(422);
            echo json_encode(['erro' => "Item #{$i}: produto_id, quantidade e preco_unitario são obrigatórios e devem ser maiores que zero."]);
            exit;
        }

        // Verifica estoque disponível
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
                'erro' => "Estoque insuficiente para \"{$produto['nome']}\". Disponível: {$produto['quantidade_atual']}, solicitado: {$quantidade}."
            ]);
            exit;
        }
    }

    // Tudo válido — inicia transação para garantir consistência
    $pdo->beginTransaction();

    try {

        // 1. Calcula o total da venda
        $total = array_reduce($itens, fn($acc, $i) =>
            $acc + ((float)$i['quantidade'] * (float)$i['preco_unitario']), 0
        );

        $clienteNome = trim($body['cliente_nome'] ?? '');
        $observacao  = trim($body['observacao']   ?? '');

        // 2. Insere o cabeçalho da venda (usuario_id = 1 por enquanto, sem auth)
        $stmtVenda = $pdo->prepare("
            INSERT INTO vendas (usuario_id, total, observacao)
            VALUES (1, :total, :observacao)
            RETURNING id
        ");
        $stmtVenda->execute([
            ':total'      => $total,
            ':observacao' => $observacao ?: null,
        ]);
        $vendaId = (int) $stmtVenda->fetchColumn();

        // 3. Insere os itens e baixa o estoque
        foreach ($itens as $item) {
            $produtoId     = (int)$item['produto_id'];
            $quantidade    = (float)$item['quantidade'];
            $precoUnitario = (float)$item['preco_unitario'];

            // Insere item da venda
            $stmtItem = $pdo->prepare("
                INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario)
                VALUES (:venda_id, :produto_id, :quantidade, :preco_unitario)
            ");
            $stmtItem->execute([
                ':venda_id'       => $vendaId,
                ':produto_id'     => $produtoId,
                ':quantidade'     => $quantidade,
                ':preco_unitario' => $precoUnitario,
            ]);

            // Baixa o estoque
            $stmtEstoque = $pdo->prepare("
                UPDATE produtos
                SET quantidade_atual = quantidade_atual - :quantidade
                WHERE id = :id
            ");
            $stmtEstoque->execute([
                ':quantidade' => $quantidade,
                ':id'         => $produtoId,
            ]);

            // Registra movimentação de estoque
            $stmtMov = $pdo->prepare("
                INSERT INTO movimentacoes_estoque
                    (produto_id, usuario_id, tipo, quantidade, motivo, referencia_tipo, referencia_id)
                VALUES
                    (:produto_id, 1, 'saida', :quantidade, :motivo, 'venda', :venda_id)
            ");
            $stmtMov->execute([
                ':produto_id' => $produtoId,
                ':quantidade' => $quantidade,
                ':motivo'     => "Venda #{$vendaId}" . ($clienteNome ? " — {$clienteNome}" : ''),
                ':venda_id'   => $vendaId,
            ]);
        }

        // 4. Lançamento financeiro de entrada
        // 4. Lançamento financeiro
        // Busca os nomes dos produtos vendidos
        $nomesProdutos = [];
        foreach ($itens as $item) {
            $stmtNome = $pdo->prepare("SELECT nome FROM produtos WHERE id = :id");
            $stmtNome->execute([':id' => $item['produto_id']]);
            $nomeProd = $stmtNome->fetchColumn();
            $nomesProdutos[] = "{$nomeProd} ({$item['quantidade']}x)";
        }

        $descFinanceiro = "Produtos: " . implode(', ', $nomesProdutos);
        if ($clienteNome) $descFinanceiro .= " | Cliente: {$clienteNome}";
        if ($observacao)  $descFinanceiro .= " | Obs: {$observacao}";

        $stmtFin = $pdo->prepare("
            INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id)
            VALUES ('entrada', :descricao, :valor, 'venda', :venda_id)
        ");
        $stmtFin->execute([
            ':descricao' => $descFinanceiro,
            ':valor'     => $total,
            ':venda_id'  => $vendaId,
        ]);

        $pdo->commit();

        http_response_code(201);
        echo json_encode([
            'mensagem' => 'Venda registrada com sucesso.',
            'venda_id' => $vendaId,
            'total'    => $total,
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'erro'    => 'Erro ao processar a venda.',
            'detalhe' => $e->getMessage(),
        ]);
    }

    exit;
}

http_response_code(405);
echo json_encode(['erro' => 'Método não permitido.']);