import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../ControleAcesso.css";

function ControleAcesso() {
  return (
    <div className="app">

      <Sidebar />

      <main className="main">

        <Header
          title="Controle de Acesso"
          subtitle="Gerencie os usuários do sistema"
        />

        <div className="tab">
          <p>Usuários</p>
        </div>

        <section className="finance-box">

          <div className="acesso-header">

            <h3>
              Funcionários Cadastrados
            </h3>

            <button className="acesso-btn">
              + Novo Funcionário
            </button>

          </div>

          <table className="acesso-table">

            <thead>

              <tr>

                <th>Nome</th>

                <th>Usuário</th>

                <th>Cargo</th>

                <th>Status</th>

                <th>Ações</th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#6b7280"
                  }}
                >
                  Nenhum funcionário cadastrado.
                </td>

              </tr>

            </tbody>

          </table>

        </section>

      </main>

    </div>
  );
}

export default ControleAcesso;