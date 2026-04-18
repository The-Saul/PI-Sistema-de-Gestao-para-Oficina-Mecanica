function App() {
  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <header className="logo">
            <img src="./Img/Rectangle 55.png" alt="logo" />
            <div>
              <h1>Sistema de Gestão</h1>
              <p>Nome da Empresa</p>
            </div>
          </header>

          <nav>
            <ul>
              <li>
                <button className="active">
                  <img src="/Img/SVG DashBoard.png" alt="" />
                  <span>Dashboard</span>
                </button>
              </li>

              <li>
                <button>
                  <img src="/Img/SVG People.png" alt="" />
                  <span>Clientes</span>
                </button>
              </li>

              <li>
                <button>
                  <img src="./Img/SVG Truck.png" alt="" />
                  <span>Fornecedores</span>
                </button>
              </li>

              <li>
                <button>
                  <img src="./Img/SVG Box.png" alt="" />
                  <span>Estoque</span>
                </button>
              </li>

              <li>
                <button>
                  <img src="./Img/SVG Money.png" alt="" />
                  <span>Financeiro</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <footer>
          <button>
            <img src="./Img/SVG Leave.png" alt="" />
            <span>Sair</span>
          </button>
        </footer>
      </aside>

      {/* Conteúdo */}
      <main className="main">
        <header className="header">
          <h2>Dashboard</h2>
          <p>Visão geral da sua oficina mecânica</p>
        </header>

        {/* Aba */}
        <div className="tab">
          <span>$</span>
          <p>Visão Geral</p>
        </div>

        {/* Cards */}
        <section className="cards">
          <div className="card">
            <div className="icon blue">
              👥
            </div>
            <h3>9999</h3>
            <p>Cliente</p>
          </div>

          <div className="card">
            <div className="icon purple">
              🚚
            </div>
            <h3>9999</h3>
            <p>Fornecedores</p>
          </div>

          <div className="card">
            <div className="icon yellow">
              📦
            </div>
            <h3>9999</h3>
            <p>Estoque</p>
          </div>

          <div className="card">
            <div className="icon green">
              $
            </div>
            <h3>9999</h3>
            <p>Financeiro</p>
          </div>
        </section>

        {/* Financeiro */}
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

      </main>
    </div>
  );
}

export default App;