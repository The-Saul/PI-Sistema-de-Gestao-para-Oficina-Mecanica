// ============================================================
// CodeMec — pages/Login.jsx
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/login";
import "../Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [usuario, setUsuario] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(e) {

    e.preventDefault();

    if (!usuario || !senha) {

      alert(
        "Preencha todos os campos."
      );

      return;
    }

    try {

      setLoading(true);

      const data =
        await login(
          usuario,
          senha
        );

      localStorage.setItem(
        "usuario",
        JSON.stringify(
          data.usuario
        )
      );

      navigate("/dashboard");

    } catch (error) {

      alert(
        error.message ||
        "Erro ao realizar login"
      );

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
              Sistema de Gestão para
              Oficina Mecânica
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
              Faça login para acessar
              o sistema
            </p>

          </div>

          <div className="login-form">

            <div>

              <label>Usuário</label>

              <input
                type="text"
                className="login-input"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) =>
                  setUsuario(
                    e.target.value
                  )
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
                  setSenha(
                    e.target.value
                  )
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

          </div>

        </form>

      </div>

    </div>
  );
}