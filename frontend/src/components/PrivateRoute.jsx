import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, cargosPermitidos }) {
  const userRaw = localStorage.getItem("usuario");

  if (!userRaw) {
    return <Navigate to="/" replace />;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    localStorage.removeItem("usuario");
    return <Navigate to="/" replace />;
  }

  // proteção por cargo
  if (cargosPermitidos && !cargosPermitidos.includes(user.cargo)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}