import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header  from "../components/Header";
import UsuarioModal from "../components/UsuarioModal";
import { usePermissao } from "../hooks/usePermissao";
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

async function editarUsuario(id, dados) {
  const res  = await fetch(`${BASE_URL}/usuario.php?id=${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(dados),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao editar usuário.");
  return json;
}

async function excluirUsuario(id) {
  const res  = await fetch(`${BASE_URL}/usuario.php?id=${id}`, {
    method:  "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao excluir usuário.");
  return json;
}

async function cadastrarFuncionario(nome, email, senha, cargo) {
  const res  = await fetch(`${BASE_CADASTRO}/cadastro.php`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ nome, usuario: email, senha, cargo }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Erro ao cadastrar funcionário.");
  return json;
}

// ── Labels de cargo ───────────────────────────────────────────
const labelCargo = {
  admin:             "Admin",
  funcionario_admin: "Func. Administrador",
  funcionario:       "Funcionário",
};

// ── Card de usuário — mesmo padrão do ClienteCard ─────────────
function UsuarioCard({ u, usuarioLogadoId, isAdmin, onVisualizar, onExcluir, onAlterarStatus }) {
  return (
    <div className="cliente-card">

      {/* Esquerda — avatar + nome + email */}
      <div className="usuario-info">
        <div className="acesso-avatar">{u.nome.charAt(0).toUpperCase()}</div>
        <div className="usuario-info__texto">
          <span className="cliente-card__nome">{u.nome}</span>
          <span className="cliente-card__cpf">{u.usuario}</span>
        </div>
      </div>

      {/* Centro — cargo e status */}
      <div className="usuario-centro">
        <div className="usuario-centro-cargo">
          <span className={`cargo-badge cargo-${u.cargo}`}>
            {labelCargo[u.cargo] ?? u.cargo}
          </span>
        </div>
        <div className="usuario-centro-status">
          <span className={u.ativo ? "status-ativo-usuario" : "status-inativo-usuario"}>
            {u.ativo ? "● Ativo" : "● Inativo"}
          </span>
        </div>
      </div>

      {/* Direita — botões */}
      <div className="cliente-card__acoes">
        <button
          className={u.ativo ? "btn-desativar" : "btn-ativar"}
          onClick={() => onAlterarStatus(u)}
          disabled={u.id === usuarioLogadoId}
        >
          {u.ativo ? "Desativar" : "Ativar"}
        </button>
        <button className="btn-visualizar" onClick={() => onVisualizar(u)}>
          <img src="./icons/eye-svgrepo-com.svg" alt="" className="icon icon-eye" />
          Visualizar detalhes
        </button>
        {isAdmin && (
          <button className="btn-excluir" onClick={() => onExcluir(u)}
            disabled={u.id === usuarioLogadoId}>
            <img src="./icons/trash-svgrepo-com.svg" alt="" className="icon icon-trash" />
          </button>
        )}
      </div>

    </div>
  );
}

// ── Componente principal ──────────────────────────────────────
function ControleAcesso() {
  const [usuarios,           setUsuarios]           = useState([]);
  const [carregando,         setCarregando]         = useState(true);
  const [erro,               setErro]               = useState("");
  const [modalAberto,        setModalAberto]        = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const usuarioLogado = JSON.parse(sessionStorage.getItem("usuario") || "{}");
  const { cargo } = usePermissao();
  const isAdmin = cargo === "admin";

  const carregar = async () => {
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarUsuarios();
      setUsuarios(dados);
    } catch (e) {
      setErro("Não foi possível carregar os usuários.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleVisualizar = (u) => {
    setUsuarioSelecionado(u);
    setModalAberto(true);
  };

  const handleNovoFuncionario = () => {
    setUsuarioSelecionado(null);
    setModalAberto(true);
  };

  const handleSalvar = async (form) => {
    try {
      if (usuarioSelecionado) {
        const dados = { nome: form.nome, usuario: form.usuario, cargo: form.cargo };
        if (form.senha) dados.senha = form.senha;
        await editarUsuario(usuarioSelecionado.id, dados);
      } else {
        await cadastrarFuncionario(form.nome, form.usuario, form.senha, form.cargo);
        setModalAberto(false);
      }
      await carregar();
    } catch (e) {
      alert(e.message);
      throw e;
    }
  };

  const handleAlterarStatus = async (u) => {
    if (u.id === usuarioLogado.id) { alert("Você não pode desativar sua própria conta."); return; }
    const acao = u.ativo ? "desativar" : "ativar";
    if (!window.confirm(`Deseja ${acao} o usuário "${u.nome}"?`)) return;
    try {
      await alterarStatus(u.id, !u.ativo);
      await carregar();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleExcluir = async (u) => {
    if (u.id === usuarioLogado.id) { alert("Você não pode excluir sua própria conta."); return; }
    if (!window.confirm(`Tem certeza que deseja excluir "${u.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await excluirUsuario(u.id);
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
          subtitle={`${usuarios.length} Usuário${usuarios.length !== 1 ? "s" : ""} Cadastrado${usuarios.length !== 1 ? "s" : ""}`}
          action={
            <button className="btn-novo" onClick={handleNovoFuncionario}>
              <strong>+</strong> Novo Funcionário
            </button>
          }
        />

        <div className="busca-wrapper">
          <img src="./icons/lupa-svgrepo-com.svg" alt="" className="icon busca-icon" />
          <input
            type="text"
            className="busca-input"
            placeholder="Busca por nome ou e-mail..."
            disabled
          />
        </div>

        <div className="clientes-lista">
          {carregando && <p className="lista-vazia">Carregando usuários...</p>}
          {!carregando && erro && <p className="lista-vazia" style={{ color: "red" }}>{erro}</p>}
          {!carregando && !erro && usuarios.length === 0 && (
            <p className="lista-vazia">Nenhum usuário cadastrado.</p>
          )}
          {!carregando && !erro && usuarios.map((u) => (
            <UsuarioCard
              key={u.id}
              u={u}
              usuarioLogadoId={usuarioLogado.id}
              isAdmin={isAdmin}
              onVisualizar={handleVisualizar}
              onExcluir={handleExcluir}
              onAlterarStatus={handleAlterarStatus}
            />
          ))}
        </div>
      </main>

      <UsuarioModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        usuarioSelecionado={usuarioSelecionado}
      />
    </div>
  );
}

export default ControleAcesso;