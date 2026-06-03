import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// LOGIN
import Login from "./pages/Login";

// PÁGINAS
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Fornecedores from "./pages/Fornecedores";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* SISTEMA */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/clientes"
          element={<Clientes />}
        />

        <Route
          path="/fornecedores"
          element={<Fornecedores />}
        />

        <Route
          path="/estoque"
          element={<Estoque />}
        />

        <Route
          path="/financeiro"
          element={<Financeiro />}
        />

        {/* ROTAS INVÁLIDAS */}
        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;
