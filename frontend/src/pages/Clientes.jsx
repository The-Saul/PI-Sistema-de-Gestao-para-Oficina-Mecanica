import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ClienteCard from "../components/ClienteCard";
import ClienteModal from "../components/ClienteModal";
import {
  listarClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
} from "../services/clientesService";
import "../Clientes.css";

// ─────────────────────────────────────────────────────────────
// Converte o objeto do banco → formato que o formulário espera
// banco usa veiculo_placa / veiculo_marca / veiculo_modelo
// o form usa placaCarro / marcaCarro / modeloCarro
// ─────────────────────────────────────────────────────────────
function bancoParaForm(cliente) {
  return {
    ...cliente,
    placaCarro:  cliente.veiculo_placa  ?? "",
    marcaCarro:  cliente.veiculo_marca  ?? "",
    modeloCarro: cliente.veiculo_modelo ?? "",
  };
}

// ─────────────────────────────────────────────────────────────
// Converte o objeto do formulário → formato que a API espera
// ─────────────────────────────────────────────────────────────
function formParaBanco(form) {
  return {
    nome:           form.nome,
    cpf:            form.cpf,
    telefone:       form.telefone,
    email:          form.email,
    cep:            form.cep,
    rua:            form.rua,
    numero:         form.numero,
    bairro:         form.bairro,
    cidade:         form.cidade ?? "",
    estado:         form.estado,
    complemento:    form.complemento,
    veiculo_placa:  form.placaCarro,
    veiculo_marca:  form.marcaCarro,
    veiculo_modelo: form.modeloCarro,
  };
}

function Clientes() {
  const [clientes, setClientes]                     = useState([]);
  const [busca, setBusca]                           = useState("");
  const [modalAberto, setModalAberto]               = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [carregando, setCarregando]                 = useState(true);
  const [erro, setErro]                             = useState("");

  // ── Carrega clientes da API ──────────────────────────────
  const carregarClientes = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await listarClientes({ busca, limite: 100 });
      // Converte cada cliente do banco para o formato do form
      setClientes(resposta.dados.map(bancoParaForm));
    } catch (e) {
      setErro("Não foi possível carregar os clientes. Verifique a conexão com a API.");
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  // Carrega sempre que a busca mudar (com pequeno delay para não
  // disparar uma requisição a cada letra digitada)
  useEffect(() => {
    const timer = setTimeout(() => {
      carregarClientes();
    }, 400);
    return () => clearTimeout(timer);
  }, [carregarClientes]);

  // ── Handlers ─────────────────────────────────────────────
  const handleNovoCliente = () => {
    setClienteSelecionado(null);
    setModalAberto(true);
  };

  const handleVisualizar = (cliente) => {
    setClienteSelecionado(cliente);
    setModalAberto(true);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    try {
      await deletarCliente(id);
      await carregarClientes(); // atualiza a lista
    } catch (e) {
      alert(e.message); // ex: "cliente possui vendas vinculadas"
    }
  };

  const handleSalvar = async (form) => {
    const dados = formParaBanco(form);
    try {
      if (clienteSelecionado) {
        await atualizarCliente(clienteSelecionado.id, dados);
      } else {
        await criarCliente(dados);
        setModalAberto(false);
      }
      await carregarClientes();
    } catch (e) {
      alert(e.message);
      throw e; // ← isso aqui é o que estava faltando
    }
  };

  // ── A busca agora é feita pela API, mas mantemos o filtro
  // local como fallback para quando a lista já está carregada
  const listaFiltrada = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.nome.toLowerCase().includes(termo) ||
      (c.cpf ?? "").includes(termo) ||
      (c.telefone ?? "").includes(termo)
    );
  });

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
          {carregando && (
            <p className="lista-vazia">Carregando clientes...</p>
          )}

          {!carregando && erro && (
            <p className="lista-vazia" style={{ color: "red" }}>{erro}</p>
          )}

          {!carregando && !erro && listaFiltrada.length === 0 && (
            <p className="lista-vazia">Nenhum cliente encontrado.</p>
          )}

          {!carregando && !erro && listaFiltrada.map((c) => (
            <ClienteCard
              key={c.id}
              cliente={c}
              onVisualizar={handleVisualizar}
              onExcluir={handleExcluir}
            />
          ))}
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