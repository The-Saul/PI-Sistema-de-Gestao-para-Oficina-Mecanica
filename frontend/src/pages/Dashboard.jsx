import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import FinanceBox from "../components/FinanceBox";

function Dashboard() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header />

        <div className="tab">
          <span>$</span>
          <p>Visão Geral</p>
        </div>

        <section className="cards">
          <Card icon="👥" value="9999" label="Clientes" color="blue" />
          <Card icon="🚚" value="9999" label="Fornecedores" color="purple" />
          <Card icon="📦" value="9999" label="Estoque" color="yellow" />
          <Card icon="$" value="9999" label="Financeiro" color="green" />
        </section>

        <FinanceBox />
      </main>
    </div>
  );
}

export default Dashboard;