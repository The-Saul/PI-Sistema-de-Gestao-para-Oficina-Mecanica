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
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e) {

    e.preventDefault();

    if (
      !nome ||
      !email ||
      !senha ||
      !confirmarSenha
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {

      setLoading(true);

      const response = await cadastrar(
        nome,
        email,
        senha
      );

      alert(
        response.message ||
        "Conta criada com sucesso!"
      );

      navigate("/");

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="login-overlay">
          <div className="login-brand">
            <h1>CodeMec</h1>
            <p>
              Sistema de Gestão para Oficina Mecânica
            </p>
          </div>
        </div>
      </div>

      <div className="login-right">

        <form
          className="login-box"
          onSubmit={handleCadastro}
        >

          <div className="login-header">

            <img
              src="/Img/codemeclogo.png"
              alt="CodeMec"
              className="login-top-logo"
            />

            <h2>Criar Conta</h2>

            <p>
              Cadastre-se para acessar o sistema
            </p>

          </div>

          <input
            className="login-input"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
          />

          <input
            type="email"
            className="login-input"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            className="login-input"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
          />

          <input
            type="password"
            className="login-input"
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChange={(e) =>
              setConfirmarSenha(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {
              loading
                ? "Criando..."
                : "Criar Conta"
            }
          </button>

          <div className="login-register">

            <span>
              Já possui uma conta?
            </span>

            <Link
              to="/"
              className="register-link"
            >
              Voltar para Login
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}