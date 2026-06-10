import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../ControleAcesso.css";

const BASE_URL = "http://localhost/pi/backend/api/usuarios";
const BASE_CADASTRO = "http://localhost/pi/backend/api/cadastrar";

/* ================= API ================= */

async function listarUsuarios() {
  const res = await fetch(`${BASE_URL}/index.php`);
  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Erro ao listar usuários.");
  return json;
}

async function alterarStatus(id, ativo) {
  const res = await fetch(`${BASE_URL}/usuario.php?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ativo }),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Erro ao alterar status.");
  return json;
}

async function cadastrarFuncionario(nome, email, senha, cargo) {
  const res = await fetch(`${BASE_CADASTRO}/cadastro.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, cargo }),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Erro ao cadastrar.");
  return json;
}

/* ================= MODAL ================= */

function ModalNovoFuncionario({ onClose, onSuccess }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("funcionario");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await cadastrarFuncionario(nome, email, senha, cargo);
      alert("Funcionário cadastrado com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay-acesso" onClick={onClose}>
      <div className="modal-acesso" onClick={(e) => e.stopPropagation()}>
        <h2>Novo Funcionário</h2>

        <form onSubmit={handleSubmit}>
          <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="funcionario">Funcionário</option>
            <option value="funcionario_admin">Administrador</option>
            <option value="admin">Admin Master</option>
          </select>

          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <input type="password" placeholder="Confirmar senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar"}
          </button>

          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

/* ================= PRINCIPAL ================= */

const labelCargo = {
  admin: "Administrador",
  funcionario_admin: "Administrador",
  funcionario: "Funcionário",
};

export default function ControleAcesso() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("usuario") || "{}");

  async function carregar() {
    setLoading(true);
    setErro("");

    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch {
      setErro("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const toggleStatus = async (usuario) => {
    if (usuario.id === user.id) {
      alert("Você não pode alterar sua própria conta.");
      return;
    }

    try {
      await alterarStatus(usuario.id, !usuario.ativo);
      await carregar();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header title="Controle de Acesso" subtitle="Usuários do sistema" />

        <button onClick={() => setModalOpen(true)}>
          + Novo Funcionário
        </button>

        {loading && <p>Carregando...</p>}
        {erro && <p>{erro}</p>}

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.usuario}</td>

                <td>
                  <span className={`cargo-${u.cargo}`}>
                    {labelCargo[u.cargo] || u.cargo}
                  </span>
                </td>

                <td>{u.ativo ? "Ativo" : "Inativo"}</td>

                <td>
                  <button
                    onClick={() => toggleStatus(u)}
                    disabled={u.id === user.id}
                  >
                    {u.ativo ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {modalOpen && (
          <ModalNovoFuncionario
            onClose={() => setModalOpen(false)}
            onSuccess={carregar}
          />
        )}
      </main>
    </div>
  );
}