import React from "react";

function Card({ title, qtd, value, color }) {
  return (
    <div className={`card ${color}`}>
      <h3>{title}</h3>
      <p>QTD: {qtd}</p>
      <strong>{value}</strong>
    </div>
  );
}

export default function Cards() {
  return (
    <section className="cards">
      <Card title="Saída" qtd={30} value="R$ 20,00" color="red" />
      <Card title="Entrada" qtd={20} value="R$ 20,00" color="green" />
      <Card title="Estoque" qtd={2000} value="R$ -20,00" color="orange" />
    </section>
  );
}