import React from "react";

function Box({ title, children, alert }) {
  return (
    <div className={`box ${alert ? "alert" : ""}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default function ListaEstoque() {
  return (
    <section className="list">
      <Box title="Saida recente">
        <p>QTD: 20 | FUNCIONARIO: Fulano</p>
      </Box>

      <Box title="Entrada recente">
        <p>QTD: 20 | Fornecedor: Fulano</p>
      </Box>

      <Box title="Estoque Baixa" alert>
        <p>QTD: 20</p>
      </Box>
    </section>
  );
}