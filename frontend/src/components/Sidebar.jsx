import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

  const cargo = localStorage.getItem("cargo");
  const navigate = useNavigate();

  const cargos = {
    gerente: "Gerente",
    atendente: "Atendente",
    estoquista: "Estoquista",
    mecanico: "Mecânico",
    financeiro: "Financeiro"
  };

  return (
    <aside className="sidebar">

      <div>

        <header className="logo">

          <img
            src="./Img/Rectangle 55.png"
            alt="logo"
          />

          <div>

            <h1>CODEMEC</h1>

            <p>Nome da Empresa</p>

            <span className="cargo-badge">
              {cargos[cargo] || "Usuário"}
            </span>

          </div>

        </header>

        <nav>

          <ul>

            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <img
                  src="/icons/dashboard-svgrepo-com.svg"
                  alt=""
                  className="icon"
                  id="icon-dash"
                />

                <span>Dashboard</span>
              </NavLink>
            </li>

            {(cargo === "gerente" ||
              cargo === "atendente") && (

              <li>
                <NavLink
                  to="/clientes"
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  <img
                    src="/icons/people-svgrepo-com.svg"
                    alt=""
                    className="icon"
                  />

                  <span>Clientes</span>
                </NavLink>
              </li>

            )}

            {cargo === "gerente" && (

              <li>
                <NavLink
                  to="/fornecedores"
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  <img
                    src="/icons/truck-svgrepo-com.svg"
                    alt=""
                    className="icon"
                  />

                  <span>Fornecedores</span>
                </NavLink>
              </li>

            )}

            {(cargo === "gerente" ||
              cargo === "estoquista" ||
              cargo === "mecanico") && (

              <li>
                <NavLink
                  to="/estoque"
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  <img
                    src="/icons/box-svgrepo-com.svg"
                    alt=""
                    className="icon"
                  />

                  <span>Estoque</span>
                </NavLink>
              </li>

            )}

            {(cargo === "gerente" ||
              cargo === "financeiro") && (

              <li>
                <NavLink
                  to="/financeiro"
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  <img
                    src="/icons/dolar-svgrepo-com.svg"
                    alt=""
                    className="icon"
                  />

                  <span>Financeiro</span>
                </NavLink>
              </li>

            )}

          </ul>

        </nav>

      </div>

      <footer>

        <button
          onClick={() => {

            localStorage.removeItem("cargo");

            navigate("/");

          }}
        >
          <img
            src="/icons/iconlogin.svg"
            alt=""
            className="icon"
          />

          <span>Trocar Usuário</span>
        </button>

        <button
          onClick={() => {

            localStorage.clear();

            navigate("/");

          }}
        >
          <img
            src="/icons/leave-svgrepo-com.svg"
            alt=""
            className="icon"
            id="icon-lea"
          />

          <span>Sair</span>
        </button>

      </footer>

    </aside>
  );
}

export default Sidebar;
