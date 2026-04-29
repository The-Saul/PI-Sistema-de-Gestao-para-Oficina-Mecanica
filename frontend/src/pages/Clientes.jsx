import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
function Clientes() {
  return (
    
    <div className="app">
      <Sidebar />

      <main className="main">

        <Header
          title="Clientes"
          subtitle="Gerencie os Clientes da Sua Oficina"
        />
      </main>
    </div>

  )
}

export default Clientes;