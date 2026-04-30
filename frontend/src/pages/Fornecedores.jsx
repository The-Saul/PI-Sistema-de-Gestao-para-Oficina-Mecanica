import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FornecedorCard from "../components/FornecedorCard";
import FornecedorModal from "../components/FornecedorModal";
import "../Fornecedores.css";

// Dados de exemplo — substituir pela chamada à API quando o backend estiver pronto
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
  const [fornecedores, setFornecedores] = useState(DADOS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState(null);

  // Filtra a lista conforme o texto de busca
  const listaFiltrada = fornecedores.filter((f) => {
    const termo = busca.toLowerCase();
    return (
      f.nome.toLowerCase().includes(termo) ||
      f.cnpj.includes(termo) ||
      f.telefone.includes(termo)
    );
  });

  // Abre o modal limpo para novo cadastro
  const handleNovoFornecedor = () => {
    setFornecedorEditando(null);
    setModalAberto(true);
  };

  // Abre o modal preenchido para edição
  const handleEditar = (fornecedor) => {
    setFornecedorEditando(fornecedor);
    setModalAberto(true);
  };

  // Remove da lista
  const handleExcluir = (id) => {
    if (!window.confirm("Deseja excluir este fornecedor?")) return;
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
  };

  // Salva (cria ou atualiza)
  const handleSalvar = (form) => {
    if (fornecedorEditando) {
      // Edição
      setFornecedores((prev) =>
        prev.map((f) => (f.id === fornecedorEditando.id ? { ...form, id: f.id } : f))
      );
    } else {
      // Novo — gera id temporário; o backend retornará o id real
      const novoId = Date.now();
      setFornecedores((prev) => [...prev, { ...form, id: novoId }]);
    }
    setModalAberto(false);
  };

  const handleFecharModal = () => setModalAberto(false);

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

        {/* Busca */}
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

        {/* Lista */}
        <div className="fornecedores-lista">
          {listaFiltrada.length === 0 ? (
            <p className="lista-vazia">Nenhum fornecedor encontrado.</p>
          ) : (
            listaFiltrada.map((f) => (
              <FornecedorCard
                key={f.id}
                fornecedor={f}
                onEditar={handleEditar}
                onExcluir={handleExcluir}
              />
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      <FornecedorModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        onSalvar={handleSalvar}
        fornecedorEditando={fornecedorEditando}
      />
    </div>
  );
}

export default Fornecedores;
