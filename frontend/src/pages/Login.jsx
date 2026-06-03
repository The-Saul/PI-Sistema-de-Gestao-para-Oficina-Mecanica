// ============================================================
// CodeMec — pages/Login.jsx
// Tela de Login
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login.css";




export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  function handleLogin(e) {

    e.preventDefault();

    if (!email || !senha) {

      alert(
        "Preencha todos os campos."
      );

      return;
    }

    // Backend será conectado futuramente
    alert("Login realizado com sucesso!");

    navigate("/dashboard");
  }

  return (
    <div className="login-page">

      {/* LADO ESQUERDO */}
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

      {/* LADO DIREITO */}
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
              <label>Email</label>

              <input
                type="email"
                className="login-input"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) =>
                  setEmail(
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
            >
              Entrar
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}