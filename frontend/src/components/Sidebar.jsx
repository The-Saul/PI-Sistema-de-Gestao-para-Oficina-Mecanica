function Sidebar() {
  return (
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
  );
}

export default Sidebar;