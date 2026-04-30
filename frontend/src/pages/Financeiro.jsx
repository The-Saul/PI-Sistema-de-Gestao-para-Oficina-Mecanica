import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Financeiro() {
  return  (
    <div className="app">
      <Sidebar />

      <main className="main">

        <Header
          title="Financeiro"
          subtitle="Gerencie o Financeiro da Sua Oficina"
        />
      </main>
    </div>
  )
}

export default Financeiro;