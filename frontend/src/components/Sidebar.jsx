import { NavLink, useNavigate } from "react-router-dom";
import { usePermissao } from "../hooks/usePermissao";

function Sidebar() {

  const navigate    = useNavigate();
  const { podeAcessarControle } = usePermissao();

  return (
    <aside className="sidebar">

      <div>

        <header className="logo">
          <img src="./Img/Rectangle 55.png" alt="logo" />
          <div>
            <h1>CODEMEC</h1>
            <p>Nome da Empresa</p>
          </div>
        </header>

        <nav>
          <ul>

            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                <img src="/icons/dashboard-svgrepo-com.svg" alt="" className="icon" id="icon-dash" />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/clientes" className={({ isActive }) => isActive ? "active" : ""}>
                <img src="/icons/people-svgrepo-com.svg" alt="" className="icon" />
                <span>Clientes</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/fornecedores" className={({ isActive }) => isActive ? "active" : ""}>
                <img src="/icons/truck-svgrepo-com.svg" alt="" className="icon" />
                <span>Fornecedores</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/estoque" className={({ isActive }) => isActive ? "active" : ""}>
                <img src="/icons/box-svgrepo-com.svg" alt="" className="icon" />
                <span>Estoque</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/financeiro" className={({ isActive }) => isActive ? "active" : ""}>
                <img src="/icons/dolar-svgrepo-com.svg" alt="" className="icon" />
                <span>Financeiro</span>
              </NavLink>
            </li>

            {/* Controle de Acesso — visível apenas para admin e funcionario_admin */}
            {podeAcessarControle && (
              <li>
                <NavLink to="/controle-acesso" className={({ isActive }) => isActive ? "active" : ""}>
                  <img src="/icons/lock-alt-svgrepo-com.svg" alt="" className="icon" />
                  <span>Controle de Acesso</span>
                </NavLink>
              </li>
            )}

          </ul>
        </nav>

      </div>

      <footer>
        <button onClick={() => { sessionStorage.clear(); navigate("/"); }}>
          <img src="/icons/leave-svgrepo-com.svg" alt="" className="icon" id="icon-lea" />
          <span>Sair</span>
        </button>
      </footer>

    </aside>
  );
}

export default Sidebar;