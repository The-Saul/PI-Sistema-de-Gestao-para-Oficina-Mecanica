import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";

import HeaderEstoque from "../components/EStoque/HeaderEstoque";
import CardEstoque from "../components/EStoque/CardEstoque";
import ListEstoque from "../components/EStoque/ListaEstoque";

import { NovoProduto } from "../components/EStoque/NovoProduto";
import { Retirada } from "../components/EStoque/Retirada";
import { ListProduto } from "../components/EStoque/ListProduto";

// CORRIGIDO
import api from "../services/api";

function Estoque() {

  const [modal, setModal] = useState(null);

  const [produtos, setProdutos] = useState([]);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {

    carregarProdutos();
    carregarHistorico();

  }, []);

  // ======================================================
  // CARREGAR PRODUTOS
  // ======================================================

  async function carregarProdutos() {

    try {

      const response = await api.get(
        "/estoque/listar.php"
      );

      setProdutos(response.data);

    } catch (error) {

      console.log(error);
    }
  }

  // ======================================================
  // CARREGAR HISTÓRICO
  // ======================================================

  async function carregarHistorico() {

    try {

      const response = await api.get(
        "/estoque/historico.php"
      );

      setHistorico(response.data);

    } catch (error) {

      console.log(error);
    }
  }

  // ======================================================
  // ADICIONAR PRODUTO
  // ======================================================

  async function adicionarProduto(produto) {

    try {

      await api.post(
        "/estoque/cadastrar.php",
        {
          codigo: produto.codigo,
          nome: produto.nome,
          quantidade: produto.quantidade_atual,
          preco_venda: produto.preco_venda,
          preco_compra: produto.preco_compra,
          observacao: produto.observacao,
          fornecedor_id: produto.fornecedor_id,
          quantidade_minima:
            produto.quantidade_minima
        }
      );

      carregarProdutos();

      setModal(null);

    } catch (error) {

      console.log(error);
    }
  }

  // ======================================================
  // REMOVER PRODUTO
  // ======================================================

  async function removerProduto(id) {

    try {

      await api.delete(
        `/estoque/deletar.php?id=${id}`
      );

      carregarProdutos();

    } catch (error) {

      console.log(error);
    }
  }

  // ======================================================
  // ATUALIZAR QUANTIDADE
  // ======================================================

  async function atualizarQuantidade(
    id,
    novaQuantidade
  ) {

    try {

      await api.put(
        "/estoque/atualizarQuantidade.php",
        {
          id,
          quantidade_atual: novaQuantidade
        }
      );

      carregarProdutos();

    } catch (error) {

      console.log(error);
    }
  }

  // ======================================================
  // RETIRADA DE PRODUTO
  // ======================================================

  async function retirarProduto(dados) {

    try {

      await api.post(
        "/estoque/retirar.php",
        {
          codigo: dados.codigo,
          quantidade: dados.quantidade,
          observacao: dados.observacao
        }
      );

      carregarProdutos();

      carregarHistorico();

      setModal(null);

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Erro ao retirar produto"
      );
    }
  }

  return (
    <>
      <div className="estoque-page">

        <Sidebar />

        <div className="app-estoque">

          <HeaderEstoque
            onNovoProduto={() =>
              setModal("novo")
            }
            onRetirada={() =>
              setModal("retirada")
            }
            onListProduto={() =>
              setModal("list")
            }
          />

          <CardEstoque
            produtos={produtos}
            historico={historico}
          />

          <ListEstoque
            produtos={produtos}
            historico={historico}
          />

        </div>
      </div>

      <NovoProduto
        open={modal === "novo"}
        onClose={() => setModal(null)}
        onAdd={adicionarProduto}
      />

      <ListProduto
        open={modal === "list"}
        onClose={() => setModal(null)}
        produtos={produtos}
        onDelete={removerProduto}
        onUpdateQuantidade={
          atualizarQuantidade
        }
      />

      <Retirada
        open={modal === "retirada"}
        onClose={() => setModal(null)}
        onRetirar={retirarProduto}
        historico={historico}
      />
    </>
  );
}

export default Estoque;