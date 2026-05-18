import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeaderEstoque from "../components/EStoque/HeaderEstoque";
import CardEstoque from "../components/EStoque/CardEstoque";
import ListEstoque from "../components/EStoque/ListaEstoque";
import { NovoProduto } from "../components/EStoque/NovoProduto";
import { Retirada } from "../components/EStoque/Retirada";
import { ListProduto } from "../components/EStoque/ListProduto";

function Estoque() {
  const [modal, setModal] = useState(null);

  const [produtos, setProdutos] = useState(() => {
    const dados = localStorage.getItem("produtos");
    return dados ? JSON.parse(dados) : [];
  });

  const [historico, setHistorico] = useState(() => {
    const dados = localStorage.getItem("historico");
    return dados ? JSON.parse(dados) : [];
  });

  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [historico]);

  function adicionarProduto(produto) {
    const novo = { ...produto, id: Date.now() };
    setProdutos((prev) => [...prev, novo]);
  }

  function removerProduto(id) {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }

  function atualizarQuantidade(id, novaQuantidade) {
    if (novaQuantidade < 0) return;

    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantidade: novaQuantidade } : p
      )
    );
  }

  function retirarProduto(dados) {
    let encontrou = false;

    setProdutos((prev) =>
      prev.map((p) => {
        if (p.codigo === dados.codigo) {
          encontrou = true;

          const novaQtd =
            Number(p.quantidade) - Number(dados.quantidade);

          if (novaQtd < 0) {
            alert("Quantidade insuficiente!");
            return p;
          }

          return { ...p, quantidade: novaQtd };
        }
        return p;
      })
    );

    if (!encontrou) {
      alert("Produto não encontrado!");
      return;
    }

    setHistorico((prev) => [
      { ...dados, id: Date.now() },
      ...prev,
    ]);
  }

  return (
    <>
      <div className="estoque-page">
        <Sidebar />

        <div className="app-estoque">
          <HeaderEstoque
            onNovoProduto={() => setModal("novo")}
            onRetirada={() => setModal("retirada")}
            onListProduto={() => setModal("list")}
          />

          <CardEstoque produtos={produtos} historico={historico} />
          <ListEstoque produtos={produtos} historico={historico} />
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
        onUpdateQuantidade={atualizarQuantidade}
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