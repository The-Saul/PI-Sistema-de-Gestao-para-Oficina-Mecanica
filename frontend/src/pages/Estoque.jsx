import { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderEstoque from "../components/HeaderEstoque";
import CardEstoque from "../components/CardEstoque";
import ListEstoque from "../components/ListaEstoque";
import { ModalNovoProduto } from "../components/NovoProduto";

function Estoque() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {/* 🔥 LAYOUT */}
      <div className="estoque-page">
        <Sidebar />

        <div className="app-estoque">
          <HeaderEstoque onNovoProduto={() => setOpenModal(true)} />
          <CardEstoque />
          <ListEstoque />
        </div>
      </div>

      {/* 🔥 MODAL FORA DO FLEX */}
      <ModalNovoProduto
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
export default Estoque;