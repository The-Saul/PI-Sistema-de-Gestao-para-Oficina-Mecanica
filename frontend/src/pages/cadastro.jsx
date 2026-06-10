import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../services/cadastrar";
import "../Login.css";

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [cargo, setCargo] = useState("funcionario");
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();

    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      await cadastrar(nome, email, senha, cargo);

      alert("Conta criada com sucesso!");
      navigate("/");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      {/* 🔵 LADO ESQUERDO (RESTO DO CSS) */}
      <div className="login-left">
        <div className="login-overlay">
          <div className="login-brand">
            <h1>CodeMec</h1>
            <p>Sistema de Gestão para Oficina Mecânica</p>
          </div>
        </div>
      </div>

      {/* 🔵 LADO DIREITO (FORM PADRÃO) */}
      <div className="login-right">

        <form className="login-box" onSubmit={handleCadastro}>

          <h2>Cadastro</h2>

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="login-input"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          {/* 🔥 CARGO AGORA FUNCIONA */}
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="login-input"
          >
            <option value="funcionario">Funcionário</option>
            <option value="funcionario_admin">Administrador</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="login-input"
          />

          <button className="login-btn" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <div className="login-register">
            <Link to="/">Voltar</Link>
          </div>

        </form>
      </div>

    </div>
  );
}