import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Card from "../components/Card";
import FinanceBox from "../components/FinanceBox";

function Dashboard() {
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
          <Card icon="/icons/people-svgrepo-com.svg" value="9999" label="Clientes" color="blue" />
          <Card icon="/icons/truck-svgrepo-com.svg" value="9999" label="Fornecedores" color="purple" />
          <Card icon="/icons/box-svgrepo-com.svg" value="9999" label="Estoque" color="yellow" />
          <Card icon="/icons/dolar-svgrepo-com.svg" value="9999" label="Financeiro" color="green" />
        </section>

        <FinanceBox />
      </main>
    </div>
  );
}

export default Dashboard;