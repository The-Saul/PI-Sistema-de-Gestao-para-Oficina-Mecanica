import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Login.css";

export default function EsqueciSenha() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarCodigo, setMostrarCodigo] = useState(false);

  function enviarCodigo() {

    if (!email) {
      alert("Digite seu e-mail.");
      return;
    }

    alert("Código enviado para o e-mail!");

    setMostrarCodigo(true);
  }

  function redefinirSenha(e) {

    e.preventDefault();

    if (
      !codigo ||
      !novaSenha ||
      !confirmarSenha
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    alert("Senha redefinida com sucesso!");

    navigate("/");
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
          onSubmit={redefinirSenha}
        >

          <div className="login-header">

            <img
              src="/Img/codemeclogo.png"
              alt="CodeMec"
              className="login-top-logo"
            />

            <h2>Recuperar Senha</h2>

            <p>
              Informe seu e-mail para
              recuperar o acesso
            </p>

          </div>

          <input
            type="email"
            className="login-input"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {!mostrarCodigo && (

            <button
              type="button"
              className="login-btn"
              onClick={enviarCodigo}
            >
              Enviar Código
            </button>

          )}

          {mostrarCodigo && (

            <>
              <input
                type="text"
                className="login-input"
                placeholder="Digite o código recebido"
                value={codigo}
                onChange={(e) =>
                  setCodigo(e.target.value)
                }
              />

              <input
                type="password"
                className="login-input"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) =>
                  setNovaSenha(e.target.value)
                }
              />

              <input
                type="password"
                className="login-input"
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
              />

              <button
                type="submit"
                className="login-btn"
              >
                Redefinir Senha
              </button>
            </>

          )}

          <div className="login-register">

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