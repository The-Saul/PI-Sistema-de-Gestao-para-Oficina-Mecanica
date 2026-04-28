import { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderEstoque from "../components/EStoque/HeaderEstoque";
import CardEstoque from "../components/EStoque/CardEstoque";
import ListEstoque from "../components/EStoque/ListaEstoque";
import { NovoProduto } from "../components/EStoque/NovoProduto";
import { Retirada } from "../components/EStoque/Retirada";

function Estoque() {
  const [modal, setModal] = useState(null); // "novo" | "retirada" | null

  return (
    <>
      <div className="estoque-page">
        <Sidebar />

        <div className="app-estoque">
          <HeaderEstoque
            onNovoProduto={() => setModal("novo")}
            onRetirada={() => setModal("retirada")}
          />
          <CardEstoque />
          <ListEstoque />
        </div>
      </div>

      {/* Modal Novo Produto */}
      <NovoProduto
        open={modal === "novo"}
        onClose={() => setModal(null)}
      />

      {/* Modal Retirada */}
      <Retirada
        open={modal === "retirada"}
        onClose={() => setModal(null)}
      />
    </>
  );
}

export default Estoque;