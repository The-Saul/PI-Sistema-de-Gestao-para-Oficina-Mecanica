function Card({ title, qtd, color }) {
  return (
    <div className={`card ${color}`}>
      <h3>{title}</h3>
      <p>QTD: {qtd}</p>
    </div>
  );
}

export default function CardEstoque({ produtos, historico }) {
  const totalEstoque = produtos.reduce(
    (acc, p) => acc + Number(p.quantidade || 0),
    0
  );

  const totalSaida = historico.reduce(
    (acc, h) => acc + Number(h.quantidade || 0),
    0
  );

  const totalEntrada = produtos.length;

  return (
    <section className="cards">
      <Card title="Saída" qtd={totalSaida} color="red" />
      <Card title="Entrada" qtd={totalEntrada} color="green" />
      <Card title="Estoque" qtd={totalEstoque} color="orange" />
    </section>
  );
}