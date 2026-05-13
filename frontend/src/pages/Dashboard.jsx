import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import FinanceBox from "../components/FinanceBox";
import { listarClientes } from "../services/clientesService";
import { listarFornecedores } from "../services/fornecedoresService";

function Dashboard() {
  // ── Estoque: mantém o localStorage do colega ─────────────
  const produtos     = JSON.parse(localStorage.getItem("produtos")) || [];
  const totalEstoque = produtos.reduce(
    (acc, p) => acc + Number(p.quantidade || 0),
    0
  );

  // ── Estado dos cards ──────────────────────────────────────
  const [totalClientes,     setTotalClientes]     = useState("...");
  const [totalFornecedores, setTotalFornecedores] = useState("...");

  // ── Busca os totais da API ────────────────────────────────
  useEffect(() => {
    listarClientes({ limite: 1 })
      .then((res) => setTotalClientes(res.total))
      .catch(() => setTotalClientes("—"));

    listarFornecedores({ limite: 1 })
      .then((res) => setTotalFornecedores(res.total))
      .catch(() => setTotalFornecedores("—"));
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
          />
          <Card
            icon="/icons/truck-svgrepo-com.svg"
            value={totalFornecedores}
            label="Fornecedores"
            color="purple"
          />
          <Card
            icon="/icons/box-svgrepo-com.svg"
            value={totalEstoque}
            label="Estoque"
            color="yellow"
          />
          <Card
            icon="/icons/dolar-svgrepo-com.svg"
            value="9999"
            label="Financeiro"
            color="green"
          />
        </section>

        <FinanceBox />
      </main>
    </div>
  );
}

export default Dashboard;