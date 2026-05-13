// ============================================================
// CodeMec — services/clientesService.js
// Comunicação com a API PHP de Clientes
// ============================================================

const BASE_URL = 'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/clientes';
//                                   ^^^^^^^^
//                  Ajuste "codemec" para o nome da pasta
//                  do seu projeto dentro do htdocs do XAMPP

// ─────────────────────────────────────────────────────────────
// Listar clientes (com busca e paginação opcionais)
// Params: { busca, pagina, limite }
// ─────────────────────────────────────────────────────────────
export async function listarClientes({ busca = '', pagina = 1, limite = 20 } = {}) {
  const params = new URLSearchParams();
  if (busca)  params.append('busca',  busca);
  if (pagina) params.append('pagina', pagina);
  if (limite) params.append('limite', limite);

  const res = await fetch(`${BASE_URL}/index.php?${params.toString()}`);

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || 'Erro ao listar clientes.');
  }

  return res.json();
  // Retorna: { dados: [], total, pagina, limite, total_paginas }
}

// ─────────────────────────────────────────────────────────────
// Buscar um cliente por ID
// ─────────────────────────────────────────────────────────────
export async function buscarCliente(id) {
  const res = await fetch(`${BASE_URL}/cliente.php?id=${id}`);

  if (!res.ok) {
    const erro = await res.json().catch(() => ({}));
    throw new Error(erro.erro || 'Cliente não encontrado.');
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// Criar novo cliente
// Params: objeto com os campos do cliente
// ─────────────────────────────────────────────────────────────
export async function criarCliente(dados) {
  const res = await fetch(`${BASE_URL}/index.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao cadastrar cliente.');
  }

  return json;
  // Retorna: { mensagem, id, criado_em }
}

// ─────────────────────────────────────────────────────────────
// Atualizar cliente existente
// Params: id (number), dados (object)
// ─────────────────────────────────────────────────────────────
export async function atualizarCliente(id, dados) {
  const res = await fetch(`${BASE_URL}/cliente.php?id=${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(dados),
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao atualizar cliente.');
  }

  return json;
  // Retorna: { mensagem }
}

// ─────────────────────────────────────────────────────────────
// Excluir cliente
// ─────────────────────────────────────────────────────────────
export async function deletarCliente(id) {
  const res = await fetch(`${BASE_URL}/cliente.php?id=${id}`, {
    method: 'DELETE',
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(json.erro || 'Erro ao excluir cliente.');
  }

  return json;
  // Retorna: { mensagem }
}