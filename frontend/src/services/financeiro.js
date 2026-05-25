// ============================================================
// CodeMec — services/financeiroService.js
// Comunicação com a API PHP de Financeiro
// ============================================================

const BASE_URL =
  'http://localhost/projeto-pi/PI-Sistema-de-Gestao-para-Oficina-Mecanica/backend/api/financeiro';

// ============================================================
// TIPOS VÁLIDOS
// ============================================================

const TIPOS_VALIDOS = ['entrada', 'saida'];

// ============================================================
// FORMATAR MOEDA
// ============================================================

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// ============================================================
// VALIDAR DADOS DA MOVIMENTAÇÃO
// ============================================================

function validarMovimentacao(dados) {

  if (!dados.tipo || !TIPOS_VALIDOS.includes(dados.tipo)) {
    throw new Error('Tipo de movimentação inválido.');
  }

  if (!dados.descricao || dados.descricao.trim() === '') {
    throw new Error('Descrição obrigatória.');
  }

  if (
    dados.valor === undefined ||
    dados.valor === null ||
    Number(dados.valor) <= 0
  ) {
    throw new Error('Valor inválido.');
  }
}

// ─────────────────────────────────────────────────────────────
// Listar movimentações financeiras
// Params:
// {
//   tipo,
//   pagina,
//   limite
// }
// ─────────────────────────────────────────────────────────────

export async function listarMovimentacoes({
  tipo = '',
  pagina = 1,
  limite = 20,
} = {}) {

  const params = new URLSearchParams();

  if (tipo) {
    params.append('tipo', tipo);
  }

  if (pagina) {
    params.append('pagina', pagina);
  }

  if (limite) {
    params.append('limite', limite);
  }

  const res = await fetch(
    `${BASE_URL}/index.php?${params.toString()}`
  );

  if (!res.ok) {

    const erro = await res.json().catch(() => ({}));

    throw new Error(
      erro.erro || 'Erro ao listar movimentações.'
    );
  }

  return res.json();

  // Retorna:
  // {
  //   dados: [],
  //   total,
  //   pagina,
  //   limite,
  //   total_paginas
  // }
}

// ─────────────────────────────────────────────────────────────
// Buscar movimentação por ID
// ─────────────────────────────────────────────────────────────

export async function buscarMovimentacao(id) {

  const res = await fetch(
    `${BASE_URL}/movimentacao.php?id=${id}`
  );

  if (!res.ok) {

    const erro = await res.json().catch(() => ({}));

    throw new Error(
      erro.erro || 'Movimentação não encontrada.'
    );
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// Criar nova movimentação financeira
// Params: objeto com os campos da movimentação
// ─────────────────────────────────────────────────────────────

export async function criarMovimentacao(dados) {

  validarMovimentacao(dados);

  const res = await fetch(
    `${BASE_URL}/index.php`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(dados),
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {

    throw new Error(
      json.erro || 'Erro ao cadastrar movimentação.'
    );
  }

  return json;

  // Retorna:
  // {
  //   mensagem,
  //   id
  // }
}

// ─────────────────────────────────────────────────────────────
// Atualizar movimentação existente
// Params:
// id (number)
// dados (object)
// ─────────────────────────────────────────────────────────────

export async function atualizarMovimentacao(id, dados) {

  validarMovimentacao(dados);

  const res = await fetch(
    `${BASE_URL}/movimentacao.php?id=${id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(dados),
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {

    throw new Error(
      json.erro || 'Erro ao atualizar movimentação.'
    );
  }

  return json;

  // Retorna:
  // {
  //   mensagem
  // }
}

// ─────────────────────────────────────────────────────────────
// Excluir movimentação
// ─────────────────────────────────────────────────────────────

export async function deletarMovimentacao(id) {

  const res = await fetch(
    `${BASE_URL}/movimentacao.php?id=${id}`,
    {
      method: 'DELETE',
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {

    throw new Error(
      json.erro || 'Erro ao excluir movimentação.'
    );
  }

  return json;

  // Retorna:
  // {
  //   mensagem
  // }
}
