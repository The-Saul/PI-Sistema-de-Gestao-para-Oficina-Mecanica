// ============================================================
// CodeMec — services/financeiroService.js
// ============================================================

const BASE_FINANCEIRO  = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/financeiro';
const BASE_VENDAS      = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/vendas';
const BASE_OS          = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/ordens-servico';
const BASE_PRODUTOS    = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/produtos';

// ─────────────────────────────────────────────────────────────
// Financeiro
// ─────────────────────────────────────────────────────────────
export async function listarMovimentacoes({ tipo = '', mes = '' } = {}) {
  const params = new URLSearchParams();
  if (tipo) params.append('tipo', tipo);
  if (mes)  params.append('mes',  mes);

  const res = await fetch(`${BASE_FINANCEIRO}/index.php?${params.toString()}`);
  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || 'Erro ao listar movimentações.');
  }
  return res.json();
}

export async function deletarMovimentacao(id) {
  const res = await fetch(`${BASE_FINANCEIRO}/movimentacao.php?id=${id}`, { method: 'DELETE' });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || 'Erro ao excluir movimentação.');
  return json;
}

// ─────────────────────────────────────────────────────────────
// Produtos (para buscar no modal de venda/OS)
// ─────────────────────────────────────────────────────────────
export async function buscarProdutos(busca = '') {
  const params = new URLSearchParams({ limite: 100 });
  if (busca) params.append('busca', busca);
  const res = await fetch(`${BASE_PRODUTOS}/index.php?${params.toString()}`);
  if (!res.ok) throw new Error('Erro ao buscar produtos.');
  const json = await res.json();
  return json.dados;
}

// ─────────────────────────────────────────────────────────────
// Vendas
// Body: { cliente_nome, observacao, itens: [{ produto_id, quantidade, preco_unitario }] }
// ─────────────────────────────────────────────────────────────
export async function criarVenda(dados) {
  const res = await fetch(`${BASE_VENDAS}/index.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || 'Erro ao registrar venda.');
  return json;
}

// ─────────────────────────────────────────────────────────────
// Ordens de Serviço
// Body: { cliente_nome, veiculo_placa, veiculo_marca, veiculo_modelo,
//         descricao_problema, servico, valor_servico,
//         pecas: [{ produto_id, quantidade, preco_unitario }] }
// ─────────────────────────────────────────────────────────────
export async function criarOS(dados) {
  const res = await fetch(`${BASE_OS}/index.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || 'Erro ao registrar ordem de serviço.');
  return json;
}