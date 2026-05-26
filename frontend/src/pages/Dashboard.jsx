import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import { listarClientes } from "../services/clientesService";
import { listarFornecedores } from "../services/fornecedoresService";
import { listarProdutos } from "../services/produtosService";
import { totalVendas } from "../services/financeiroService";
import { listarMovimentacoes } from "../services/financeiroService";

function Dashboard() {
  // ── Estado dos cards ──────────────────────────────────────
  const [totalClientes,         setTotalClientes] = useState("...");
  const [totalFornecedores, setTotalFornecedores] = useState("...");
  const [totalEstoque,           setTotalEstoque] = useState("...");
  const [totalVendasValor,   setTotalVendasValor] = useState("...");
  const [totalEntradas,         setTotalEntradas] = useState(0);
  const [totalSaidas,           setTotalSaidas]   = useState(0);
  const [saldo,                 setSaldo]         = useState(0);

  // ── Busca os totais da API ────────────────────────────────
  useEffect(() => {
    listarClientes({ limite: 1 })
      .then((res) => setTotalClientes(res.total))
      .catch(() => setTotalClientes("—"));

    listarFornecedores({ limite: 1 })
      .then((res) => setTotalFornecedores(res.total))
      .catch(() => setTotalFornecedores("—"));

    listarProdutos({ limite: 1 })
      .then((res) => setTotalEstoque(res.total))
      .catch(() => setTotalEstoque("—"));

    totalVendas()
      .then((val) => setTotalVendasValor(val))
      .catch(() => setTotalVendasValor("—"));

    listarMovimentacoes({})
      .then((res) => {
        setTotalEntradas(res.total_entradas);
        setTotalSaidas(res.total_saidas);
        setSaldo(res.saldo);
      })
      .catch(() => {});

  }, []);

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header
          title="Dashboard"
          subtitle="Visão geral da sua oficina mecânica"
        />

        <div className="tab">
          <span>$</span>
          <p>Visão Geral</p>
        </div>

        <section className="cards">
          <Card
            icon="/icons/people-svgrepo-com.svg"
            value={totalClientes}
            label="Clientes"
            color="blue"
            rota="/clientes"
          />
          <Card
            icon="/icons/truck-svgrepo-com.svg"
            value={totalFornecedores}
            label="Fornecedores"
            color="purple"
            rota="/fornecedores"
          />
          <Card
            icon="/icons/box-svgrepo-com.svg"
            value={totalEstoque}
            label="Estoque"
            color="yellow"
            rota="/estoque"
          />
          <Card
            icon="/icons/dolar-svgrepo-com.svg"
            value={totalVendasValor}
            label="Vendas"
            color="green"
            rota="/financeiro"
          />
        </section>

        <section className="finance-box">
          <h3>Resumo Financeiro (Total)</h3>
          <div className="finance">
            <div className="fin red">
              <p>↘ Gastos / Compras</p>
              <h2>R$ {totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="fin green">
              <p>↗ Receitas</p>
              <h2>R$ {totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="fin orange">
              <p>$ Saldo</p>
              <h2>R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h2>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;