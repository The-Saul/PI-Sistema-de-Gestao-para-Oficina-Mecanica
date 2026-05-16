function Box({ title, children, alert }) {
  return (
    <div className={`box ${alert ? "alert" : ""}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const LIMITE_ESTOQUE = 5;

export default function ListaEstoque({
  produtos,
  historico
}) {

  const saidasRecentes = historico.slice(0, 1);

  const entradasRecentes = [...produtos]
    .slice(-1)
    .reverse();

  const estoqueBaixo = produtos.filter(
    (p) =>
      Number(p.quantidade_atual) <= LIMITE_ESTOQUE
  );

  return (
    <section className="list">

      <Box title="Saída recente">

        {saidasRecentes.length === 0 ? (
          <p>Nenhuma saída registrada</p>
        ) : (
          saidasRecentes.map((h) => (
            <p key={h.id}>
              Qtd: {h.quantidade} {h.nome}
            </p>
          ))
        )}

      </Box>

      <Box title="Entrada recente">

        {entradasRecentes.length === 0 ? (
          <p>Nenhuma entrada registrada</p>
        ) : (
          entradasRecentes.map((p) => (
            <p key={p.id}>
              Qtd: {p.quantidade_atual} {p.nome}
            </p>
          ))
        )}

      </Box>

      <Box title="Estoque Baixo" alert>

        {estoqueBaixo.length === 0 ? (
          <p>Sem produtos críticos</p>
        ) : (
          estoqueBaixo.map((p) => (
            <p key={p.id}>
              Qtd: {p.quantidade_atual} {p.nome}
            </p>
          ))
        )}

      </Box>

    </section>
  );
}