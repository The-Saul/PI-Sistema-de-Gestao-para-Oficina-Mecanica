import api from "./api";

// ==============================
// LISTAR PRODUTOS
// ==============================
export const listarProdutos = async () => {
  const response = await api.get("/estoque/listar.php");
  return response.data;
};

// ==============================
// CADASTRAR PRODUTO
// ==============================
export const cadastrarProduto = async (produto) => {
  const response = await api.post(
    "/estoque/cadastrar.php",
    produto
  );

  return response.data;
};

// ==============================
// DELETAR PRODUTO
// ==============================
export const deletarProduto = async (id) => {
  const response = await api.delete(
    `/estoque/deletar.php?id=${id}`
  );

  return response.data;
};

// ==============================
// RETIRAR PRODUTO
// ==============================
export const retirarProduto = async (dados) => {
  const response = await api.post(
    "/estoque/retirar.php",
    dados
  );

  return response.data;
};

// ==============================
// ATUALIZAR QUANTIDADE
// ==============================
export const atualizarQuantidade = async (dados) => {
  const response = await api.put(
    "/estoque/atualizarQuantidade.php",
    dados
  );

  return response.data;
};

// ==============================
// HISTÓRICO DE MOVIMENTAÇÕES
// ==============================
export const listarHistorico = async () => {
  const response = await api.get(
    "/estoque/historico.php"
  );

  return response.data;
};

// ==============================
// ESTOQUE CRÍTICO
// ==============================
export const listarEstoqueCritico = async () => {
  const response = await api.get(
    "/estoque/estoqueCritico.php"
  );

  return response.data;
};