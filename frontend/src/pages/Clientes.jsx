import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ClienteCard from "../components/ClienteCard";
import ClienteModal from "../components/ClienteModal";
import "../Clientes.css";

const DADOS_INICIAIS = [
  {
    id: 1,
    nome: "Cliente",
    cpf: "123123123-00",
    telefone: "(88) 91231-1231",
    email: "cliente@gmail.com",
    placaCarro: "RIO2A18",
    marcaCarro: "Toyota",
    modeloCarro: "Carolla",
    cep: "",
    estado: "RJ",
    complemento: "",
    rua: "",
    numero: "",
    bairro: "",
  },
];

function Clientes() {
  const [clientes, setClientes] = useState(DADOS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const listaFiltrada = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.nome.toLowerCase().includes(termo) ||
      c.cpf.includes(termo) ||
      c.telefone.includes(termo)
    );
  });

  const handleNovoCliente = () => {
    setClienteEditando(null);
    setModalAberto(true);
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setModalAberto(true);
  };

  const handleExcluir = (id) => {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSalvar = (form) => {
    if (clienteEditando) {
      setClientes((prev) =>
        prev.map((c) => (c.id === clienteEditando.id ? { ...form, id: c.id } : c))
      );
    } else {
      setClientes((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setModalAberto(false);
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header
          title="Clientes"
          subtitle={`${clientes.length} Cliente${clientes.length !== 1 ? "s" : ""} Cadastrado${clientes.length !== 1 ? "s" : ""}`}
          action={
            <button className="btn-novo" onClick={handleNovoCliente}>
              <strong>+</strong> Novo Cliente
            </button>
          }
        />

        {/* Busca */}
        <div className="busca-wrapper">
          <img src="./icons/lupa-svgrepo-com.svg" alt="" className="icon busca-icon" />
          <input
            type="text"
            className="busca-input"
            placeholder="Busca por nome, CPF ou Telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Lista */}
        <div className="clientes-lista">
          {listaFiltrada.length === 0 ? (
            <p className="lista-vazia">Nenhum cliente encontrado.</p>
          ) : (
            listaFiltrada.map((c) => (
              <ClienteCard
                key={c.id}
                cliente={c}
                onEditar={handleEditar}
                onExcluir={handleExcluir}
              />
            ))
          )}
        </div>
      </main>

      <ClienteModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        clienteEditando={clienteEditando}
      />
    </div>
  );
}

export default Clientes;