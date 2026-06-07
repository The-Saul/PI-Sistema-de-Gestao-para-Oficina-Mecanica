import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  enviarCodigo,
  redefinirSenha
} from "../services/cadastrar";

import "../Login.css";

export default function EsqueciSenha() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarCodigo, setMostrarCodigo] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function handleEnviarCodigo() {

    if (!email) {

      alert("Digite seu e-mail.");

      return;

    }

    try {

      setLoading(true);

      const response =
        await enviarCodigo(email);

      alert(`Código de recuperação: ${response.codigo}`);

      console.log(
        "Código:",
        response.codigo
      );

      setMostrarCodigo(true);

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }

  async function handleRedefinir(e) {

    e.preventDefault();

    if (
      !codigo ||
      !novaSenha ||
      !confirmarSenha
    ) {

      alert(
        "Preencha todos os campos."
      );

      return;

    }

    if (
      novaSenha !== confirmarSenha
    ) {

      alert(
        "As senhas não coincidem."
      );

      return;

    }

    try {

      setLoading(true);

      const response =
        await redefinirSenha(
          email,
          codigo,
          novaSenha
        );

      alert(response.message);

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
              Sistema de Gestão para
              Oficina Mecânica
            </p>

          </div>

        </div>

      </div>

      <div className="login-right">

        <form
          className="login-box"
          onSubmit={handleRedefinir}
        >

          <div className="login-header">

            <img
              src="/Img/codemeclogo.png"
              alt="CodeMec"
              className="login-top-logo"
            />

            <h2>Recuperar Senha</h2>

            <p>
              Informe seu e-mail
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
              onClick={
                handleEnviarCodigo
              }
              disabled={loading}
            >
              {
                loading
                  ? "Enviando..."
                  : "Enviar Código"
              }
            </button>

          )}

          {mostrarCodigo && (

            <>

              <input
                type="text"
                className="login-input"
                placeholder="Código recebido"
                value={codigo}
                onChange={(e) =>
                  setCodigo(
                    e.target.value
                  )
                }
              />

              <input
                type="password"
                className="login-input"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) =>
                  setNovaSenha(
                    e.target.value
                  )
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
                    ? "Salvando..."
                    : "Redefinir Senha"
                }
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