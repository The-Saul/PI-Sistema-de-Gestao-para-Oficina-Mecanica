function FinanceBox() {
  return (
    <section className="finance-box">
      <h3>Resumo Financeiro (Total)</h3>

      <div className="finance">
        <div className="fin red">
          <p>↘ Gastos (Entradas)</p>
          <h2>R$ 20,00</h2>
        </div>

        <div className="fin green">
          <p>↗ Vendas (saída)</p>
          <h2>R$ 20,00</h2>
        </div>

        <div className="fin orange">
          <p>$ saldo</p>
          <h2>R$ 00,00</h2>
        </div>
      </div>
    </section>
  );
}

export default FinanceBox;