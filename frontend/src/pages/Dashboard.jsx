import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import FinanceBox from "../components/FinanceBox";
import { listarClientes } from "../services/clientesService";
import { listarFornecedores } from "../services/fornecedoresService";
import { listarProdutos } from "../services/produtosService";
import { totalVendas } from "../services/financeiroService";

function Dashboard() {
  // ── Estado dos cards ──────────────────────────────────────
  const [totalClientes,         setTotalClientes] = useState("...");
  const [totalFornecedores, setTotalFornecedores] = useState("...");
  const [totalEstoque,           setTotalEstoque] = useState("...");
  const [totalVendasValor,   setTotalVendasValor] = useState("...");

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

        <FinanceBox />
      </main>
    </div>
  );
}

export default Dashboard;