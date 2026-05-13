import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FornecedorCard from "../components/FornecedorCard";
import FornecedorModal from "../components/FornecedorModal";
import {
  listarFornecedores,
  criarFornecedor,
  atualizarFornecedor,
  deletarFornecedor,
} from "../services/fornecedoresService";
import "../Fornecedores.css";

// Fornecedores não têm campos com nomes diferentes entre
// o banco e o formulário, então não precisa de conversão.

function Fornecedores() {
  const [fornecedores, setFornecedores]                     = useState([]);
  const [busca, setBusca]                                   = useState("");
  const [modalAberto, setModalAberto]                       = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado]   = useState(null);
  const [carregando, setCarregando]                         = useState(true);
  const [erro, setErro]                                     = useState("");

  // ── Carrega fornecedores da API ──────────────────────────
  const carregarFornecedores = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await listarFornecedores({ busca, limite: 100 });
      setFornecedores(resposta.dados);
    } catch (e) {
      setErro("Não foi possível carregar os fornecedores. Verifique a conexão com a API.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  // Recarrega com delay para não disparar a cada letra digitada
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarFornecedores();
    }, 400);
    return () => clearTimeout(timer);
  }, [carregarFornecedores]);

  // ── Handlers ─────────────────────────────────────────────
  const handleNovoFornecedor = () => {
    setFornecedorSelecionado(null);
    setModalAberto(true);
  };

  const handleVisualizar = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setModalAberto(true);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir este fornecedor?")) return;
    try {
      await deletarFornecedor(id);
      await carregarFornecedores();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSalvar = async (form) => {
    try {
      if (fornecedorSelecionado) {
        await atualizarFornecedor(fornecedorSelecionado.id, form);
      } else {
        await criarFornecedor(form);
        setModalAberto(false);
      }
      await carregarFornecedores();
    } catch (e) {
      alert(e.message);
      throw e; // mantém o modal editável em caso de erro
    }
  };

  // Filtro local como complemento à busca da API
  const listaFiltrada = fornecedores.filter((f) => {
    const termo = busca.toLowerCase();
    return (
      f.nome.toLowerCase().includes(termo) ||
      (f.cnpj      ?? "").includes(termo) ||
      (f.telefone  ?? "").includes(termo)
    );
  });

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
          {carregando && (
            <p className="lista-vazia">Carregando fornecedores...</p>
          )}

          {!carregando && erro && (
            <p className="lista-vazia" style={{ color: "red" }}>{erro}</p>
          )}

          {!carregando && !erro && listaFiltrada.length === 0 && (
            <p className="lista-vazia">Nenhum fornecedor encontrado.</p>
          )}

          {!carregando && !erro && listaFiltrada.map((f) => (
            <FornecedorCard
              key={f.id}
              fornecedor={f}
              onVisualizar={handleVisualizar}
              onExcluir={handleExcluir}
            />
          ))}
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