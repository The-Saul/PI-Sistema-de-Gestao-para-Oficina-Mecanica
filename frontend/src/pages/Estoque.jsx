import { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderEstoque from "../components/EStoque/HeaderEstoque";
import CardEstoque from "../components/EStoque/CardEstoque";
import ListEstoque from "../components/EStoque/ListaEstoque";
import {NovoProduto } from "../components/EStoque/NovoProduto";

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

      <NovoProduto
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}
export default Estoque;