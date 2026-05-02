import { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderEstoque from "../components/EStoque/HeaderEstoque";
import CardEstoque from "../components/EStoque/CardEstoque";
import ListEstoque from "../components/EStoque/ListaEstoque";
import { NovoProduto } from "../components/EStoque/NovoProduto";
import { Retirada } from "../components/EStoque/Retirada";
import { ListProduto } from "../components/EStoque/ListProduto";

function Estoque() {
  const [modal, setModal] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [historico, setHistorico] = useState([]);

  function adicionarProduto(produto) {
    const novo = {
      ...produto,
      id: Date.now(),
    };
    setProdutos((prev) => [...prev, novo]);
  }

  function removerProduto(id) {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
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

          return {
            ...p,
            quantidade: novaQtd,
          };
        }
        return p;
      })
    );

    if (!encontrou) {
      alert("Produto não encontrado!");
      return;
    }

    // salva histórico
    setHistorico((prev) => [
      {
        ...dados,
        id: Date.now(),
      },
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

          <CardEstoque total={produtos.length} />
          <ListEstoque produtos={produtos} />
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