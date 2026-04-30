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

  function adicionarProduto(produto) {
    const novo = {
      ...produto,
      id: Date.now(), // ✅ ID único
    };

    setProdutos((prev) => [...prev, novo]);
  }

  function removerProduto(id) {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
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
      />
    </>
  );
}

export default Estoque;