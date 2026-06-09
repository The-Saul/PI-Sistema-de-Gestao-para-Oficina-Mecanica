import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// AUTENTICAÇÃO
import Login from "./pages/Login";
import Cadastro from "./pages/cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import PrivateRoute from "./components/PrivateRoute";
// SISTEMA
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Fornecedores from "./pages/Fornecedores";
import Estoque from "./pages/Estoque";
import Financeiro from "./pages/Financeiro";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTENTICAÇÃO */}
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/esqueci-senha"
          element={<EsqueciSenha />}
        />

        {/* SISTEMA */}
       <Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/clientes"
  element={
    <PrivateRoute>
      <Clientes />
    </PrivateRoute>
  }
/>

<Route
  path="/fornecedores"
  element={
    <PrivateRoute>
      <Fornecedores />
    </PrivateRoute>
  }
/>

<Route
  path="/estoque"
  element={
    <PrivateRoute>
      <Estoque />
    </PrivateRoute>
  }
/>

<Route
  path="/financeiro"
  element={
    <PrivateRoute>
      <Financeiro />
    </PrivateRoute>
  }
/>

        {/* ROTA INVÁLIDA */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
