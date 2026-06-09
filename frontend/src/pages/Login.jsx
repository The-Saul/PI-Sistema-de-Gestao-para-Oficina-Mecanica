import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/login";
import "../Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {

      setLoading(true);

      const response = await login(
        email,
        senha
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(
          response.usuario
        )
      );

      alert("Login realizado com sucesso!");

      navigate("/dashboard");

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
          onSubmit={handleLogin}
        >

          <div className="login-header">

            <img
              src="/Img/codemeclogo.png"
              alt="CodeMec"
              className="login-top-logo"
            />

            <h2>Bem-vindo</h2>

            <p>
              Faça login para acessar o sistema
            </p>

          </div>

          <div className="login-form">

            <div>

              <label>Email</label>

              <input
                type="email"
                className="login-input"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div>

              <label>Senha</label>

              <input
                type="password"
                className="login-input"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
              />

            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {
                loading
                  ? "Entrando..."
                  : "Entrar"
              }
            </button>

            <div className="login-register">

              <Link
                to="/esqueci-senha"
                className="register-link"
              >
                Esqueceu sua senha?
              </Link>

              <span>
                Não possui uma conta?
              </span>

              <Link
                to="/cadastro"
                className="register-link"
              >
                Criar conta
              </Link>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}