import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
function Fornecedores() {
  return (
    
    <div className="app">
      <Sidebar />

      <main className="main">

        <Header
          title="Fornecedores"
          subtitle="Gerencie os Fornecedores da Sua Oficina"
        />
      </main>
    </div>

  )
}

export default Fornecedores;