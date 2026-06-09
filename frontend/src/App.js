import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import RotaProtegida  from "./components/RotaProtegida";

import Login          from "./pages/Login";
import Cadastro       from "./pages/Cadastro";
import EsqueciSenha   from "./pages/EsqueciSenha";

import Dashboard      from "./pages/Dashboard";
import Clientes       from "./pages/Clientes";
import Fornecedores   from "./pages/Fornecedores";
import Estoque        from "./pages/Estoque";
import Financeiro     from "./pages/Financeiro";
import ControleAcesso from "./pages/ControleAcesso";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Rotas públicas ── */}
        <Route path="/"              element={<Login />} />
        <Route path="/cadastro"      element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />

        {/* ── Rotas protegidas — todos os logados ── */}
        <Route path="/dashboard" element={
          <RotaProtegida><Dashboard /></RotaProtegida>
        } />
        <Route path="/clientes" element={
          <RotaProtegida><Clientes /></RotaProtegida>
        } />
        <Route path="/fornecedores" element={
          <RotaProtegida><Fornecedores /></RotaProtegida>
        } />
        <Route path="/estoque" element={
          <RotaProtegida><Estoque /></RotaProtegida>
        } />
        <Route path="/financeiro" element={
          <RotaProtegida><Financeiro /></RotaProtegida>
        } />

        {/* ── Rota restrita — admin e funcionario_admin ── */}
        <Route path="/controle-acesso" element={
          <RotaProtegida cargosPermitidos={["admin", "funcionario_admin"]}>
            <ControleAcesso />
          </RotaProtegida>
        } />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;