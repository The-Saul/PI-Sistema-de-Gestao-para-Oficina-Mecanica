import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  try {
    JSON.parse(usuario);
  } catch {
    localStorage.removeItem("usuario");
    return <Navigate to="/" replace />;
  }

  return children;
}