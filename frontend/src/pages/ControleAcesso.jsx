import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header  from "../components/Header";
import "../ControleAcesso.css";

const BASE_URL      = "http://localhost/pi/backend/api/usuarios";
const BASE_CADASTRO = "http://localhost/pi/backend/api/cadastrar";

async function listarUsuarios() {
  const res  = await fetch(`${BASE_URL}/index.php`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao listar usuários.");
  return json;
}

async function alterarStatus(id, ativo) {
  const res  = await fetch(`${BASE_URL}/usuario.php?id=${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ ativo }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao alterar status.");
  return json;
}

async function cadastrarFuncionario(nome, email, senha, cargo) {
  const res  = await fetch(`${BASE_CADASTRO}/cadastro.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ nome, email, senha, cargo }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao cadastrar funcionário.");
  return json;
}

// ── Modal de Novo Funcionário ─────────────────────────────────
function ModalNovoFuncionario({ onFechar, onSalvo }) {
  const [nome,           setNome]           = useState("");
  const [email,          setEmail]          = useState("");
  const [cargo,          setCargo]          = useState("funcionario");
  const [senha,          setSenha]          = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvando,       setSalvando]       = useState(false);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha || !confirmarSenha) { alert("Preencha todos os campos."); return; }
    if (senha !== confirmarSenha) { alert("As senhas não coincidem."); return; }
    if (senha.length < 6) { alert("A senha deve ter pelo menos 6 caracteres."); return; }
    setSalvando(true);
    try {
      await cadastrarFuncionario(nome, email, senha, cargo);
      alert(`Funcionário "${nome}" cadastrado com sucesso!`);
      onSalvo();
      onFechar();
    } catch (e) {
      alert(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay-acesso" onClick={onFechar}>
      <div className="modal-acesso" onClick={(e) => e.stopPropagation()}>

        <div className="modal-acesso-header">
          <h2>Novo Funcionário</h2>
          <button className="modal-acesso-fechar" onClick={onFechar}>×</button>
        </div>

        <form onSubmit={handleSalvar}>

          <div className="modal-acesso-campo">
            <label>Nome completo</label>
            <input className="modal-acesso-input" placeholder="Nome do funcionário"
              value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>

          <div className="modal-acesso-campo">
            <label>E-mail (usado para login)</label>
            <input type="email" className="modal-acesso-input" placeholder="email@exemplo.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="modal-acesso-campo">
            <label>Cargo</label>
            <select className="modal-acesso-input" value={cargo} onChange={(e) => setCargo(e.target.value)}>
              <option value="funcionario">Funcionário Comum</option>
              <option value="funcionario_admin">Funcionário Administrador</option>
            </select>
          </div>

          <div className="modal-acesso-campo">
            <label>Senha</label>
            <input type="password" className="modal-acesso-input" placeholder="Mínimo 6 caracteres"
              value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>

          <div className="modal-acesso-campo">
            <label>Confirmar senha</label>
            <input type="password" className="modal-acesso-input" placeholder="Repita a senha"
              value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
          </div>

          <div className="modal-acesso-footer">
            <button type="button" className="btn-cancelar-acesso" onClick={onFechar}>Cancelar</button>
            <button type="submit" className="acesso-btn" disabled={salvando}>
              {salvando ? "Cadastrando..." : "Cadastrar Funcionário"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// ── Labels de cargo ───────────────────────────────────────────
const labelCargo = {
  admin:             "Admin",
  funcionario_admin: "Func. Administrador",
  funcionario:       "Funcionário",
};

// ── Componente principal ──────────────────────────────────────
function ControleAcesso() {

  const [usuarios,    setUsuarios]    = useState([]);
  const [carregando,  setCarregando]  = useState(true);
  const [erro,        setErro]        = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const usuarioLogado = JSON.parse(sessionStorage.getItem("usuario") || "{}");

  const carregar = async () => {
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarUsuarios();
      setUsuarios(dados);
    } catch (e) {
      setErro("Não foi possível carregar os usuários. Verifique a conexão com a API.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleAlterarStatus = async (usuario) => {
    if (usuario.id === usuarioLogado.id) {
      alert("Você não pode desativar sua própria conta.");
      return;
    }
    const acao = usuario.ativo ? "desativar" : "ativar";
    if (!window.confirm(`Deseja ${acao} o usuário "${usuario.nome}"?`)) return;
    try {
      await alterarStatus(usuario.id, !usuario.ativo);
      await carregar();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Header
          title="Controle de Acesso"
          subtitle="Gerencie os usuários do sistema"
        />

        <div className="tab"><p>Usuários</p></div>

        <section className="finance-box">
          <div className="acesso-header">
            <h3>Funcionários Cadastrados</h3>
            <button className="acesso-btn" onClick={() => setModalAberto(true)}>
              + Novo Funcionário
            </button>
          </div>

          {carregando && <p className="acesso-vazio">Carregando usuários...</p>}
          {!carregando && erro && <p className="acesso-vazio acesso-erro">{erro}</p>}

          {!carregando && !erro && (
            <table className="acesso-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="acesso-vazio">Nenhum usuário cadastrado.</td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="acesso-nome">
                          <div className="acesso-avatar">{u.nome.charAt(0).toUpperCase()}</div>
                          {u.nome}
                        </div>
                      </td>
                      <td>{u.usuario}</td>
                      <td>
                        <span className={`cargo-badge cargo-${u.cargo}`}>
                          {labelCargo[u.cargo] ?? u.cargo}
                        </span>
                      </td>
                      <td>
                        <span className={u.ativo ? "status-ativo" : "status-inativo"}>
                          {u.ativo ? "● Ativo" : "● Inativo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={u.ativo ? "btn-desativar" : "btn-ativar"}
                          onClick={() => handleAlterarStatus(u)}
                          disabled={u.id === usuarioLogado.id}
                          title={u.id === usuarioLogado.id ? "Não é possível alterar sua própria conta" : ""}
                        >
                          {u.ativo ? "Desativar" : "Ativar"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {modalAberto && (
        <ModalNovoFuncionario
          onFechar={() => setModalAberto(false)}
          onSalvo={carregar}
        />
      )}
    </div>
  );
}

export default ControleAcesso;