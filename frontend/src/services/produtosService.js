// ============================================================
// CodeMec — services/produtosService.js
// ============================================================

const BASE_URL = 'http://localhost/pi/backend/api/produtos';

export async function listarProdutos({ busca = '', pagina = 1, limite = 100 } = {}) {
  const params = new URLSearchParams();
  if (busca)  params.append('busca',  busca);
  if (pagina) params.append('pagina', pagina);
  if (limite) params.append('limite', limite);

  const res = await fetch(`${BASE_URL}/index.php?${params.toString()}`);
  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || 'Erro ao listar produtos.');
  }
  return res.json();
}

export async function buscarProduto(id) {
  const res = await fetch(`${BASE_URL}/produto.php?id=${id}`);
  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || 'Produto não encontrado.');
  }
  return res.json();
}

// Busca o próximo código disponível para pré-preencher o formulário
export async function proximoCodigo() {
  const res = await fetch(`${BASE_URL}/proximo-codigo.php`);
  if (!res.ok) return 'PRO-001'; // fallback seguro
  const json = await res.json();
  return json.codigo;
}

export async function criarProduto(dados) {
  const res = await fetch(`${BASE_URL}/index.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || 'Erro ao cadastrar produto.');
  return json;
}

export async function atualizarProduto(id, dados) {
  const res = await fetch(`${BASE_URL}/produto.php?id=${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || 'Erro ao atualizar produto.');
  return json;
}

export async function deletarProduto(id) {
  const res = await fetch(`${BASE_URL}/produto.php?id=${id}`, {
    method: 'DELETE',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.erro || 'Erro ao excluir produto.');
  return json;
}