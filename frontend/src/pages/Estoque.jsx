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

  return (
    <>
      <div className="estoque-page">
        <Sidebar />

        <div className="app-estoque">
          <HeaderEstoque
            onNovoProduto={() => setModal("novo")}
            onRetirada={() => setModal("retirada")}
            onListProduto={() => setModal("List")}
          />
          <CardEstoque />
          <ListEstoque />
        </div>
      </div>
      <ListProduto
        open={modal === "List"}
        onClose={() => setModal(null)}
      />
      <NovoProduto
        open={modal === "novo"}
        onClose={() => setModal(null)}
      />
      <Retirada
        open={modal === "retirada"}
        onClose={() => setModal(null)}
      />
    </>
  );
}

export default Estoque;