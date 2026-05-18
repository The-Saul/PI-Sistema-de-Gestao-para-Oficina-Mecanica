import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ProdutoCard from "../components/Estoque/ProdutoCard";
import ProdutoModal from "../components/Estoque/ProdutoModal";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "../services/produtosService";
import "../Estoque.css";

function Estoque() {
  const [produtos, setProdutos]                     = useState([]);
  const [busca, setBusca]                           = useState("");
  const [modalAberto, setModalAberto]               = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregando, setCarregando]                 = useState(true);
  const [erro, setErro]                             = useState("");
  const [filtro, setFiltro]                         = useState("todos"); // todos | baixo

  // ── Carrega produtos da API ──────────────────────────────
  const carregarProdutos = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await listarProdutos({ busca, limite: 100 });
      setProdutos(resposta.dados);
    } catch (e) {
      setErro("Não foi possível carregar os produtos. Verifique a conexão com a API.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarProdutos();
    }, 400);
    return () => clearTimeout(timer);
  }, [carregarProdutos]);

  // ── Handlers ─────────────────────────────────────────────
  const handleNovoProduto = () => {
    setProdutoSelecionado(null);
    setModalAberto(true);
  };

  const handleVisualizar = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir este produto?")) return;
    try {
      await deletarProduto(id);
      await carregarProdutos();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSalvar = async (form) => {
    try {
      if (produtoSelecionado) {
        await atualizarProduto(produtoSelecionado.id, form);
      } else {
        await criarProduto(form);
        setModalAberto(false);
      }
      await carregarProdutos();
    } catch (e) {
      alert(e.message);
      throw e;
    }
  };

  // ── Métricas para os cards de resumo ─────────────────────
  const totalProdutos   = produtos.length;
  const estoqueBaixo    = produtos.filter(
    (p) => Number(p.quantidade_atual) <= Number(p.quantidade_minima)
  );
  const totalQtd = produtos.reduce(
    (acc, p) => acc + Number(p.quantidade_atual || 0), 0
  );

  // ── Filtro local ──────────────────────────────────────────
  const listaFiltrada = produtos.filter((p) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      p.nome.toLowerCase().includes(termo) ||
      (p.codigo ?? "").toLowerCase().includes(termo);
    const matchFiltro =
      filtro === "todos" ||
      (filtro === "baixo" && Number(p.quantidade_atual) <= Number(p.quantidade_minima));
    return matchBusca && matchFiltro;
  });

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header
          title="Estoque"
          subtitle={`${totalProdutos} Produto${totalProdutos !== 1 ? "s" : ""} Cadastrado${totalProdutos !== 1 ? "s" : ""}`}
          action={
            <button className="btn-novo" onClick={handleNovoProduto}>
              <strong>+</strong> Novo Produto
            </button>
          }
        />

        {/* Cards de resumo */}
        <div className="estoque-resumo">
          <div className="estoque-resumo__card estoque-resumo__card--blue">
            <span className="estoque-resumo__valor">{totalProdutos}</span>
            <span className="estoque-resumo__label">Produtos</span>
          </div>
          <div className="estoque-resumo__card estoque-resumo__card--orange">
            <span className="estoque-resumo__valor">{totalQtd}</span>
            <span className="estoque-resumo__label">Unidades em estoque</span>
          </div>
          <div
            className="estoque-resumo__card estoque-resumo__card--red"
            style={{ cursor: "pointer" }}
            onClick={() => setFiltro(filtro === "baixo" ? "todos" : "baixo")}
          >
            <span className="estoque-resumo__valor">{estoqueBaixo.length}</span>
            <span className="estoque-resumo__label">
              Estoque crítico {filtro === "baixo" ? "— clique para ver todos" : "— clique para filtrar"}
            </span>
          </div>
        </div>

        {/* Busca */}
        <div className="busca-wrapper">
          <img src="./icons/lupa-svgrepo-com.svg" alt="" className="icon busca-icon" />
          <input
            type="text"
            className="busca-input"
            placeholder="Busca por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Lista */}
        <div className="clientes-lista">
          {carregando && (
            <p className="lista-vazia">Carregando produtos...</p>
          )}

          {!carregando && erro && (
            <p className="lista-vazia" style={{ color: "red" }}>{erro}</p>
          )}

          {!carregando && !erro && listaFiltrada.length === 0 && (
            <p className="lista-vazia">Nenhum produto encontrado.</p>
          )}

          {!carregando && !erro && listaFiltrada.map((p) => (
            <ProdutoCard
              key={p.id}
              produto={p}
              onVisualizar={handleVisualizar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      </main>

      <ProdutoModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        produtoSelecionado={produtoSelecionado}
      />
    </div>
  );
}

export default Estoque;