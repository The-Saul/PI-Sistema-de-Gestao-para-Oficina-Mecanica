const BASE_FINANCEIRO  = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/financeiro';
const BASE_VENDAS      = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/vendas';
const BASE_OS          = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/ordens-servico';
const BASE_PRODUTOS    = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/produtos';

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

export async function buscarProdutos(busca = '') {
  const params = new URLSearchParams({ limite: 100 });
  if (busca) params.append('busca', busca);
  const res = await fetch(`${BASE_PRODUTOS}/index.php?${params.toString()}`);
  if (!res.ok) throw new Error('Erro ao buscar produtos.');
  const json = await res.json();
  return json.dados;
}

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

const BASE_COMPRAS = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/compras';
const BASE_FORN    = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/fornecedores';

export async function listarFornecedoresFinanceiro() {
  const res = await fetch(`${BASE_FORN}/index.php?limite=100`);
  if (!res.ok) throw new Error('Erro ao buscar fornecedores.');
  const json = await res.json();
  return json.dados;
}

export async function criarCompra(dados) {
  const res = await fetch(`${BASE_COMPRAS}/index.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || 'Erro ao registrar compra.');
  return json;
}

const BASE_CLIENTES = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/clientes';

export async function listarClientesFinanceiro() {
  const res = await fetch(`${BASE_CLIENTES}/index.php?limite=100`);
  if (!res.ok) throw new Error('Erro ao buscar clientes.');
  const json = await res.json();
  return json.dados;
}

export async function totalVendas() {
  const res = await fetch(`${BASE_VENDAS}/total.php`);
  if (!res.ok) throw new Error('Erro ao buscar total de vendas.');
  const json = await res.json();
  return json.total;
}