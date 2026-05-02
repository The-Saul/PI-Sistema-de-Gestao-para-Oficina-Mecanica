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
  const [clientes, setClientes]               = useState(DADOS_INICIAIS);
  const [busca, setBusca]                     = useState("");
  const [modalAberto, setModalAberto]         = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const listaFiltrada = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.nome.toLowerCase().includes(termo) ||
      c.cpf.includes(termo) ||
      c.telefone.includes(termo)
    );
  });

  const handleNovoCliente = () => {
    setClienteSelecionado(null);
    setModalAberto(true);
  };

  const handleVisualizar = (cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  };

  const handleExcluir = (id) => {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSalvar = (form) => {
    if (clienteSelecionado) {
      setClientes((prev) =>
        prev.map((c) => (c.id === clienteSelecionado.id ? { ...form, id: c.id } : c))
      );
    } else {
      setClientes((prev) => [...prev, { ...form, id: Date.now() }]);
      setModalAberto(false); // fecha só no novo cadastro
    }
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

        <div className="clientes-lista">
          {listaFiltrada.length === 0 ? (
            <p className="lista-vazia">Nenhum cliente encontrado.</p>
          ) : (
            listaFiltrada.map((c) => (
              <ClienteCard
                key={c.id}
                cliente={c}
                onVisualizar={handleVisualizar}
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
        clienteSelecionado={clienteSelecionado}
      />
    </div>
  );
}

export default Clientes;