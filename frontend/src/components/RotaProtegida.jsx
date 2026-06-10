// ============================================================
// CodeMec — components/RotaProtegida.jsx
// Redireciona para / se não logado
// Redireciona para /dashboard se não tiver permissão de cargo
// ============================================================
import { Navigate } from "react-router-dom";

function RotaProtegida({ children, cargosPermitidos }) {
  const usuarioRaw = sessionStorage.getItem("usuario");

  //console.log("RotaProtegida - usuarioRaw:", usuarioRaw);

  // Não logado → vai para login
  if (!usuarioRaw) {
    return <Navigate to="/" replace />;
  }

  // Verifica cargo se a rota exigir
  if (cargosPermitidos) {
    const usuario = JSON.parse(usuarioRaw);
    const cargo   = usuario?.cargo ?? "funcionario";

    if (!cargosPermitidos.includes(cargo)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default RotaProtegida;