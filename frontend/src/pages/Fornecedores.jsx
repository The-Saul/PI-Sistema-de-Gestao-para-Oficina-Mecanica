import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FornecedorCard from "../components/FornecedorCard";
import FornecedorModal from "../components/FornecedorModal";
import "../Fornecedores.css";

const DADOS_INICIAIS = [
  {
    id: 1,
    nome: "Fornecedor",
    cnpj: "12312312312300",
    telefone: "(88) 91231-1231",
    email: "fornecedor@gmail.com",
  },
];

function Fornecedores() {
  const [fornecedores, setFornecedores]           = useState(DADOS_INICIAIS);
  const [busca, setBusca]                         = useState("");
  const [modalAberto, setModalAberto]             = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);

  const listaFiltrada = fornecedores.filter((f) => {
    const termo = busca.toLowerCase();
    return (
      f.nome.toLowerCase().includes(termo) ||
      f.cnpj.includes(termo) ||
      f.telefone.includes(termo)
    );
  });

  // Abre modal de novo cadastro (sem fornecedor selecionado)
  const handleNovoFornecedor = () => {
    setFornecedorSelecionado(null);
    setModalAberto(true);
  };

  // Abre modal em modo visualização
  const handleVisualizar = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setModalAberto(true);
  };

  const handleExcluir = (id) => {
    if (!window.confirm("Deseja excluir este fornecedor?")) return;
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSalvar = (form) => {
    if (fornecedorSelecionado) {
      setFornecedores((prev) =>
        prev.map((f) => (f.id === fornecedorSelecionado.id ? { ...form, id: f.id } : f))
      );
    } else {
      setFornecedores((prev) => [...prev, { ...form, id: Date.now() }]);
      setModalAberto(false); // fecha só no novo cadastro
    }
    // no editar, o modal permanece aberto em modo visualização (controlado pelo modal)
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header
          title="Fornecedores"
          subtitle={`${fornecedores.length} Fornecedor${fornecedores.length !== 1 ? "es" : ""} Cadastrado${fornecedores.length !== 1 ? "s" : ""}`}
          action={
            <button className="btn-novo" onClick={handleNovoFornecedor}>
              <strong>+</strong> Novo Fornecedor
            </button>
          }
        />

        <div className="busca-wrapper">
          <img src="./icons/lupa-svgrepo-com.svg" alt="" className="icon busca-icon" />
          <input
            type="text"
            className="busca-input"
            placeholder="Busca por nome, CNPJ ou Telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="fornecedores-lista">
          {listaFiltrada.length === 0 ? (
            <p className="lista-vazia">Nenhum fornecedor encontrado.</p>
          ) : (
            listaFiltrada.map((f) => (
              <FornecedorCard
                key={f.id}
                fornecedor={f}
                onVisualizar={handleVisualizar}
                onExcluir={handleExcluir}
              />
            ))
          )}
        </div>
      </main>

      <FornecedorModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        fornecedorSelecionado={fornecedorSelecionado}
      />
    </div>
  );
}

export default Fornecedores;