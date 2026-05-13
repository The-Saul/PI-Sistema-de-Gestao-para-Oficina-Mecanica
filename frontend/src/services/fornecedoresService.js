// ============================================================
// CodeMec — services/fornecedoresService.js
// Comunicação com a API PHP de Fornecedores
// ============================================================

const BASE_URL = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/fornecedores';

// ─────────────────────────────────────────────────────────────
// Listar fornecedores (com busca e paginação opcionais)
// ─────────────────────────────────────────────────────────────
export async function listarFornecedores({ busca = '', pagina = 1, limite = 100 } = {}) {
  const params = new URLSearchParams();
  if (busca)  params.append('busca',  busca);
  if (pagina) params.append('pagina', pagina);
  if (limite) params.append('limite', limite);

  const res = await fetch(`${BASE_URL}/index.php?${params.toString()}`);

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || 'Erro ao listar fornecedores.');
  }

  return res.json();
  // Retorna: { dados: [], total, pagina, limite, total_paginas }
}

// ─────────────────────────────────────────────────────────────
// Buscar um fornecedor por ID
// ─────────────────────────────────────────────────────────────
export async function buscarFornecedor(id) {
  const res = await fetch(`${BASE_URL}/fornecedor.php?id=${id}`);

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || 'Fornecedor não encontrado.');
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// Criar novo fornecedor
// ─────────────────────────────────────────────────────────────
export async function criarFornecedor(dados) {
  const res = await fetch(`${BASE_URL}/index.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao cadastrar fornecedor.');
  }

  return json;
  // Retorna: { mensagem, id, criado_em }
}

// ─────────────────────────────────────────────────────────────
// Atualizar fornecedor existente
// ─────────────────────────────────────────────────────────────
export async function atualizarFornecedor(id, dados) {
  const res = await fetch(`${BASE_URL}/fornecedor.php?id=${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao atualizar fornecedor.');
  }

  return json;
}

// ─────────────────────────────────────────────────────────────
// Excluir fornecedor
// ─────────────────────────────────────────────────────────────
export async function deletarFornecedor(id) {
  const res = await fetch(`${BASE_URL}/fornecedor.php?id=${id}`, {
    method: 'DELETE',
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao excluir fornecedor.');
  }

  return json;
}