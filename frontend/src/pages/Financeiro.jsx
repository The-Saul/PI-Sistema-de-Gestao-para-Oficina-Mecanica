import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  listarMovimentacoes,
  buscarProdutos,
  criarVenda,
  criarOS,
  criarCompra,
  listarFornecedoresFinanceiro,
  listarClientesFinanceiro,
} from "../services/financeiroService";
import "../Financeiro.css";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function mesAtual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function Btn({ children, onClick, disabled, cancelar }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${cancelar ? "btn-cancelar-fin" : ""}`}
    >
      {children}
    </button>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`pill ${active ? "active" : ""}`}>
      {children}
    </button>
  );
}

function Label({ children }) {
  return <label className="label">{children}</label>;
}

// ─────────────────────────────────────────────────────────────
// Funções auxiliares para descrição
// ─────────────────────────────────────────────────────────────
function extrairInfo(descricao, campo) {
  if (!descricao) return null;
  const partes = descricao.split('|');
  for (const parte of partes) {
    const trimmed = parte.trim();
    if (trimmed.startsWith(`${campo}:`)) {
      return trimmed.replace(`${campo}:`, '').trim();
    }
  }
  return null;
}

function limparDescricao(descricao) {
  if (!descricao) return "";
  return descricao.split('|')[0].trim();
}

// ─────────────────────────────────────────────────────────────
// Seletor de produto (Venda e OS)
// ─────────────────────────────────────────────────────────────
function SeletorProduto({ onAdicionar }) {
  const [busca,       setBusca]       = useState("");
  const [produtos,    setProdutos]    = useState([]);
  const [qtd,         setQtd]         = useState(1);
  const [selecionado, setSelecionado] = useState(null);
  const [carregando,  setCarregando]  = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setCarregando(true);
      try   { setProdutos(await buscarProdutos(busca)); }
      catch { setProdutos([]); }
      finally { setCarregando(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [busca]);

  const handleAdicionar = () => {
    if (!selecionado) { alert("Selecione um produto."); return; }
    if (qtd <= 0)     { alert("Quantidade deve ser maior que zero."); return; }
    if (qtd > Number(selecionado.quantidade_atual)) {
      alert(`Estoque insuficiente. Disponível: ${selecionado.quantidade_atual} ${selecionado.unidade}`);
      return;
    }
    onAdicionar({
      produto_id:     selecionado.id,
      nome:           selecionado.nome,
      quantidade:     qtd,
      preco_unitario: Number(selecionado.preco_venda),
      estoque:        Number(selecionado.quantidade_atual),
      unidade:        selecionado.unidade,
    });
    setSelecionado(null);
    setBusca("");
    setQtd(1);
  };

  return (
    <div className="seletor-produto">
      <Label>Buscar produto</Label>
      <input
        className="input"
        placeholder="Digite o nome ou código..."
        value={busca}
        onChange={(e) => { setBusca(e.target.value); setSelecionado(null); }}
        style={{ marginBottom: 8 }}
      />

      {busca && !selecionado && (
        <div className="seletor-dropdown">
          {carregando && <p className="seletor-dropdown-vazio">Buscando...</p>}
          {!carregando && produtos.length === 0 && (
            <p className="seletor-dropdown-vazio">Nenhum produto encontrado.</p>
          )}
          {!carregando && produtos.map((p) => (
            <div key={p.id} className="seletor-dropdown-item"
              onClick={() => { setSelecionado(p); setBusca(p.nome); }}
            >
              <span><strong>{p.nome}</strong> {p.codigo ? `(${p.codigo})` : ""}</span>
              <span className="seletor-dropdown-info">
                Estq: {p.quantidade_atual} {p.unidade} · R$ {Number(p.preco_venda).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {selecionado && (
        <div className="seletor-selecionado">
          <div className="seletor-selecionado-nome">
            ✓ <strong>{selecionado.nome}</strong> — R$ {Number(selecionado.preco_venda).toFixed(2)} / {selecionado.unidade}
            <span className="seletor-selecionado-info">(Estq: {selecionado.quantidade_atual})</span>
          </div>
          <div>
            <Label>Qtd</Label>
            <input type="number" min="1" max={selecionado.quantidade_atual}
              value={qtd} onChange={(e) => setQtd(Number(e.target.value))}
              className="input seletor-qtd" />
          </div>
          <button onClick={handleAdicionar} className="btn btn-adicionar-produto" style={{ marginLeft: 0 }}>
            <strong>+</strong> Adicionar
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tabela de itens (Venda e OS)
// ─────────────────────────────────────────────────────────────
function TabelaItens({ itens, onRemover }) {
  if (itens.length === 0) return null;
  const total = itens.reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0);
  return (
    <div className="tabela-itens">
      <Label>Itens adicionados</Label>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th className="center">Qtd</th>
            <th className="right">Preço unit.</th>
            <th className="right">Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, i) => (
            <tr key={i}>
              <td>{item.nome}</td>
              <td className="center">{item.quantidade} {item.unidade}</td>
              <td className="right">R$ {item.preco_unitario.toFixed(2)}</td>
              <td className="right">R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</td>
              <td className="center">
                <button className="btn-remover-item" onClick={() => onRemover(i)}>✕</button>
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="3" className="right">Total:</td>
            <td className="right">R$ {total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de Nova Venda
// ─────────────────────────────────────────────────────────────
function ModalVenda({ onClose, onSalvar }) {
  const [clientes,    setClientes]    = useState([]);
  const [clienteId,   setClienteId]   = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [observacao,  setObservacao]  = useState("");
  const [itens,       setItens]       = useState([]);
  const [salvando,    setSalvando]    = useState(false);

  useEffect(() => {
    listarClientesFinanceiro().then(setClientes).catch(() => setClientes([]));
  }, []);

  const adicionarItem = (item) => {
    setItens((prev) => {
      const existe = prev.findIndex((i) => i.produto_id === item.produto_id);
      if (existe >= 0) {
        const novo = [...prev];
        const novaQtd = novo[existe].quantidade + item.quantidade;
        if (novaQtd > item.estoque) { alert(`Quantidade total excede o estoque disponível (${item.estoque}).`); return prev; }
        novo[existe] = { ...novo[existe], quantidade: novaQtd };
        return novo;
      }
      return [...prev, item];
    });
  };

  const removerItem = (index) => setItens((prev) => prev.filter((_, i) => i !== index));

  const handleSalvar = async () => {
    if (itens.length === 0) { alert("Adicione pelo menos um produto."); return; }
    setSalvando(true);
    try {
      await onSalvar({ cliente_nome: clienteNome, observacao, itens });
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Nova Venda de Produto</h2>
        <div className="modal-form">
          <div>
            <Label>Cliente</Label>
            <select className="input" value={clienteId}
              onChange={(e) => {
                setClienteId(e.target.value);
                const c = clientes.find((c) => String(c.id) === e.target.value);
                setClienteNome(c ? c.nome : "");
              }}
            >
              <option value="">Selecione um cliente cadastrado</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome} — {c.cpf ?? "sem CPF"}</option>
              ))}
            </select>
            <p className="label" style={{ marginTop: 6 }}>Ou digite manualmente:</p>
            <input className="input" placeholder="Nome do cliente" value={clienteNome}
              onChange={(e) => { setClienteNome(e.target.value); setClienteId(""); }} />
          </div>
          <div>
            <Label>Observação (opcional)</Label>
            <input className="input" value={observacao}
              onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: pagamento à vista" />
          </div>
        </div>
        <SeletorProduto onAdicionar={adicionarItem} />
        <TabelaItens itens={itens} onRemover={removerItem} />
        <div className="modal-actions">
          <Btn cancelar onClick={onClose}>Cancelar</Btn>
          <Btn onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Confirmar Venda"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de Nova OS
// ─────────────────────────────────────────────────────────────
const SERVICOS = [
  "Troca de óleo","Alinhamento","Balanceamento","Revisão completa","Troca de pneus",
  "Suspensão","Freios","Motor","Injeção eletrônica","Embreagem","Ar-condicionado",
  "Diagnóstico eletrônico","Bateria","Lanternagem","Pintura",
];

function ModalOS({ onClose, onSalvar }) {
  const [clientes,     setClientes]     = useState([]);
  const [clienteId,    setClienteId]    = useState("");
  const [clienteNome,  setClienteNome]  = useState("");
  const [placa,        setPlaca]        = useState("");
  const [marca,        setMarca]        = useState("");
  const [modelo,       setModelo]       = useState("");
  const [problema,     setProblema]     = useState("");
  const [servicos,     setServicos]     = useState([]);
  const [buscaServico, setBuscaServico] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [pecas,        setPecas]        = useState([]);
  const [salvando,     setSalvando]     = useState(false);

  useEffect(() => {
    listarClientesFinanceiro().then(setClientes).catch(() => setClientes([]));
  }, []);

  const servicosFiltrados = SERVICOS.filter((s) =>
    s.toLowerCase().includes(buscaServico.toLowerCase())
  );

  const adicionarServico = (descricao) => {
    if (!descricao) { alert("Selecione ou digite um serviço."); return; }
    if (!valorServico || Number(valorServico) <= 0) { alert("Informe o valor do serviço."); return; }
    setServicos((prev) => [...prev, { descricao, valor: Number(valorServico) }]);
    setBuscaServico("");
    setValorServico("");
  };

  const removerServico = (index) => setServicos((prev) => prev.filter((_, i) => i !== index));

  const adicionarPeca = (item) => {
    setPecas((prev) => {
      const existe = prev.findIndex((p) => p.produto_id === item.produto_id);
      if (existe >= 0) {
        const novo = [...prev];
        const novaQtd = novo[existe].quantidade + item.quantidade;
        if (novaQtd > item.estoque) { alert(`Quantidade total excede o estoque disponível (${item.estoque}).`); return prev; }
        novo[existe] = { ...novo[existe], quantidade: novaQtd };
        return novo;
      }
      return [...prev, item];
    });
  };

  const removerPeca = (index) => setPecas((prev) => prev.filter((_, i) => i !== index));

  const totalServicos = servicos.reduce((acc, s) => acc + s.valor, 0);
  const totalPecas    = pecas.reduce((acc, p) => acc + p.quantidade * p.preco_unitario, 0);

  const handleSalvar = async () => {
    if (servicos.length === 0) { alert("Adicione pelo menos um serviço."); return; }
    setSalvando(true);
    try {
      await onSalvar({
        cliente_nome:       clienteNome,
        veiculo_placa:      placa,
        veiculo_marca:      marca,
        veiculo_modelo:     modelo,
        descricao_problema: problema,
        servicos,
        pecas,
      });
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Nova Ordem de Serviço</h2>
        <div className="modal-form">

          {/* Cliente */}
          <div>
            <Label>Cliente</Label>
            <select className="input" value={clienteId}
              onChange={(e) => {
                setClienteId(e.target.value);
                const c = clientes.find((c) => String(c.id) === e.target.value);
                if (c) {
                  setClienteNome(c.nome);
                  setPlaca(c.veiculo_placa   ?? "");
                  setMarca(c.veiculo_marca   ?? "");
                  setModelo(c.veiculo_modelo ?? "");
                } else {
                  setClienteNome("");
                }
              }}
            >
              <option value="">Selecione um cliente cadastrado</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome} — {c.cpf ?? "sem CPF"}</option>
              ))}
            </select>
            <input className="input" placeholder="Ou digite manualmente" value={clienteNome}
              onChange={(e) => { setClienteNome(e.target.value); setClienteId(""); }}
              style={{ marginTop: 6 }} />
          </div>

          {/* Veículo */}
          <div className="veiculo-grid">
            <div>
              <Label>Placa</Label>
              <input className="input" value={placa} maxLength={8}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())} placeholder="ABC1D23" />
            </div>
            <div>
              <Label>Marca</Label>
              <input className="input" value={marca}
                onChange={(e) => setMarca(e.target.value)} placeholder="Ex: Volkswagen" />
            </div>
            <div>
              <Label>Modelo</Label>
              <input className="input" value={modelo}
                onChange={(e) => setModelo(e.target.value)} placeholder="Ex: Gol 1.6" />
            </div>
          </div>

          {/* Problema */}
          <div>
            <Label>Descrição do problema (opcional)</Label>
            <input className="input" value={problema}
              onChange={(e) => setProblema(e.target.value)}
              placeholder="Ex: Barulho no freio dianteiro" />
          </div>

        </div>

        {/* Seletor de serviços */}
        <div className="seletor-servico">
          <Label>Adicionar serviço <span style={{ color: "#ef4444" }}>*</span></Label>
          <input className="input" value={buscaServico}
            onChange={(e) => setBuscaServico(e.target.value)}
            placeholder="Digite para buscar ou descrever o serviço..."
            style={{ marginBottom: 6 }}
          />
          {buscaServico && (
            <div className="seletor-dropdown">
              {servicosFiltrados.map((s) => (
                <div key={s} className="seletor-dropdown-item"
                  onClick={() => setBuscaServico(s)}>
                  {s}
                </div>
              ))}
              <div className="seletor-dropdown-item"
                onClick={() => {}}
                style={{ color: "#2d7df6", fontWeight: 600 }}>
                + Usar "{buscaServico}" como serviço
              </div>
            </div>
          )}
          <div className="seletor-servico-row">
            <div>
              <Label>Valor do serviço (R$)</Label>
              <div className="input-money">
                <span>R$</span>
                <input type="number" className="input money-field" placeholder="0,00" min="0"
                  value={valorServico} onChange={(e) => setValorServico(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-adicionar-servico"
              onClick={() => adicionarServico(buscaServico)}>
              <strong>+</strong> Adicionar
            </button>
          </div>
        </div>

        {/* Tabela de serviços */}
        {servicos.length > 0 && (
          <div className="tabela-servicos">
            <Label>Serviços adicionados</Label>
            <table>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th className="right">Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s, i) => (
                  <tr key={i}>
                    <td>{s.descricao}</td>
                    <td className="right">R$ {s.valor.toFixed(2)}</td>
                    <td className="center">
                      <button className="btn-remover-item" onClick={() => removerServico(i)}>✕</button>
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td className="right">Total serviços:</td>
                  <td className="right">R$ {totalServicos.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Peças */}
        <div style={{ marginTop: 16 }}>
          <Label>Produtos utilizados (opcional)</Label>
          <SeletorProduto onAdicionar={adicionarPeca} />
          <TabelaItens itens={pecas} onRemover={removerPeca} />
        </div>

        {/* Total geral */}
        {(servicos.length > 0 || pecas.length > 0) && (
          <div className="total-os">
            Total da OS: R$ {(totalServicos + totalPecas).toFixed(2)}
          </div>
        )}

        <div className="modal-actions">
          <Btn cancelar onClick={onClose}>Cancelar</Btn>
          <Btn onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Confirmar OS"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Seletor de produto para Compra (preço de compra)
// ─────────────────────────────────────────────────────────────
function SeletorProdutoCompra({ onAdicionar }) {
  const [busca,       setBusca]       = useState("");
  const [produtos,    setProdutos]    = useState([]);
  const [qtd,         setQtd]         = useState(1);
  const [preco,       setPreco]       = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [carregando,  setCarregando]  = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setCarregando(true);
      try   { setProdutos(await buscarProdutos(busca)); }
      catch { setProdutos([]); }
      finally { setCarregando(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [busca]);

  const handleAdicionar = () => {
    if (!selecionado)         { alert("Selecione um produto."); return; }
    if (qtd <= 0)             { alert("Quantidade deve ser maior que zero."); return; }
    if (!preco || preco <= 0) { alert("Informe o preço de compra."); return; }
    onAdicionar({
      produto_id:     selecionado.id,
      nome:           selecionado.nome,
      quantidade:     qtd,
      preco_unitario: Number(preco),
      preco_compra:   Number(preco),
      unidade:        selecionado.unidade,
    });
    setSelecionado(null); setBusca(""); setQtd(1); setPreco("");
  };

  return (
    <div className="seletor-produto">
      <Label>Buscar produto</Label>
      <input className="input" placeholder="Digite o nome ou código..."
        value={busca} onChange={(e) => { setBusca(e.target.value); setSelecionado(null); }}
        style={{ marginBottom: 8 }} />

      {busca && !selecionado && (
        <div className="seletor-dropdown">
          {carregando && <p className="seletor-dropdown-vazio">Buscando...</p>}
          {!carregando && produtos.length === 0 && <p className="seletor-dropdown-vazio">Nenhum produto encontrado.</p>}
          {!carregando && produtos.map((p) => (
            <div key={p.id} className="seletor-dropdown-item"
              onClick={() => { setSelecionado(p); setBusca(p.nome); setPreco(p.preco_compra); }}
            >
              <span><strong>{p.nome}</strong> {p.codigo ? `(${p.codigo})` : ""}</span>
              <span className="seletor-dropdown-info">Compra: R$ {Number(p.preco_compra).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {selecionado && (
        <div className="seletor-selecionado" style={{ alignItems: "flex-end" }}>
          <div>
            <Label>Produto selecionado</Label>
            <div className="seletor-selecionado-nome">✓ <strong>{selecionado.nome}</strong></div>
          </div>
          <div>
            <Label>Qtd</Label>
            <input type="number" min="1" value={qtd}
              onChange={(e) => setQtd(Number(e.target.value))}
              className="input seletor-qtd" />
          </div>
          <div>
            <Label>Preço unit. (R$)</Label>
            <input type="number" min="0" step="0.01" value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="input" style={{ width: 100 }} />
          </div>
          <button onClick={handleAdicionar} className="btn" style={{ marginLeft: 0 }}>
            <strong>+</strong> Adicionar
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de Nova Compra
// ─────────────────────────────────────────────────────────────
function ModalCompra({ onClose, onSalvar }) {
  const [fornecedores,   setFornecedores]   = useState([]);
  const [fornecedorId,   setFornecedorId]   = useState("");
  const [fornecedorNome, setFornecedorNome] = useState("");
  const [observacao,     setObservacao]     = useState("");
  const [itens,          setItens]          = useState([]);
  const [salvando,       setSalvando]       = useState(false);

  useEffect(() => {
    listarFornecedoresFinanceiro().then(setFornecedores).catch(() => setFornecedores([]));
  }, []);

  const adicionarItem = (item) => {
    setItens((prev) => {
      const existe = prev.findIndex((i) => i.produto_id === item.produto_id);
      if (existe >= 0) {
        const novo = [...prev];
        novo[existe] = { ...novo[existe], quantidade: novo[existe].quantidade + item.quantidade };
        return novo;
      }
      return [...prev, { ...item, preco_unitario: item.preco_compra ?? item.preco_unitario }];
    });
  };

  const removerItem = (index) => setItens((prev) => prev.filter((_, i) => i !== index));

  const handleSalvar = async () => {
    if (!fornecedorNome && !fornecedorId) { alert("Informe o fornecedor."); return; }
    if (itens.length === 0) { alert("Adicione pelo menos um produto."); return; }
    setSalvando(true);
    try {
      await onSalvar({
        fornecedor_id:   fornecedorId   || null,
        fornecedor_nome: fornecedorNome,
        observacao,
        itens: itens.map((i) => ({
          produto_id:     i.produto_id,
          quantidade:     i.quantidade,
          preco_unitario: i.preco_unitario,
        })),
      });
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Nova Compra de Mercadoria</h2>
        <div className="modal-form">
          <div>
            <Label>Fornecedor <span style={{ color: "#ef4444" }}>*</span></Label>
            <select className="input" value={fornecedorId}
              onChange={(e) => {
                setFornecedorId(e.target.value);
                const f = fornecedores.find((f) => String(f.id) === e.target.value);
                setFornecedorNome(f ? f.nome : "");
              }}
            >
              <option value="">Selecione um fornecedor cadastrado</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </select>
            <p className="label" style={{ marginTop: 6 }}>Ou digite o nome manualmente:</p>
            <input className="input" placeholder="Nome do fornecedor" value={fornecedorNome}
              onChange={(e) => { setFornecedorNome(e.target.value); setFornecedorId(""); }} />
          </div>
          <div>
            <Label>Observação (opcional)</Label>
            <input className="input" value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Compra mensal de filtros" />
          </div>
        </div>
        <SeletorProdutoCompra onAdicionar={adicionarItem} />
        <TabelaItens itens={itens} onRemover={removerItem} />
        <div className="modal-actions">
          <Btn cancelar onClick={onClose}>Cancelar</Btn>
          <Btn onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Confirmar Compra"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de Exportação
// ─────────────────────────────────────────────────────────────
function ModalExport({ onClose, movimentacoes, totais }) {
  const handleImprimir = () => {
    const receitas = movimentacoes.filter((m) => m.tipo === 'entrada');
    const gastos   = movimentacoes.filter((m) => m.tipo === 'saida');

    const linhas = (lista) => lista.map((r) => `
      <tr>
        <td>${r.data}</td>
        <td>${limparDescricao(r.descricao)}</td>
        <td>R$ ${Number(r.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
      </tr>
    `).join("");

    const janela = window.open("", "_blank");
    janela.document.write(`
      <html>
        <head>
          <title>Relatório Financeiro — CodeMec</title>
          <style>
            body  { font-family: Arial, sans-serif; padding: 30px; color: #111; }
            h1    { font-size: 22px; margin-bottom: 4px; }
            p     { color: #666; font-size: 13px; margin-bottom: 24px; }
            h2    { font-size: 16px; margin: 24px 0 10px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th    { background: #f3f4f6; padding: 10px 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
            td    { padding: 10px 12px; border-bottom: 1px solid #f1f1f1; }
            .saldo { margin-top: 24px; padding: 14px 18px; background: #d1fae5; border-radius: 8px; font-weight: 700; font-size: 15px; color: #065f46; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>Relatório Financeiro — CodeMec</h1>
          <p>Gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
          <h2>Receitas</h2>
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Valor</th></tr></thead>
            <tbody>${linhas(receitas)}</tbody>
          </table>
          <h2>Gastos / Compras</h2>
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Valor</th></tr></thead>
            <tbody>${linhas(gastos)}</tbody>
          </table>
          <div class="saldo">
            Saldo: R$ ${totais.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <br/>
          <button onclick="window.print()">🖨️ Imprimir / Salvar como PDF</button>
        </body>
      </html>
    `);
    janela.document.close();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Exportar Relatório</h2>
        <p className="label" style={{ marginBottom: 20, textTransform: "none", fontSize: 13 }}>
          Abre uma nova aba com o relatório formatado. Use Ctrl+P para salvar como PDF.
        </p>
        <div className="modal-actions">
          <Btn cancelar onClick={onClose}>Cancelar</Btn>
          <Btn onClick={handleImprimir}>Gerar Relatório</Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de Detalhe
// ─────────────────────────────────────────────────────────────
function ModalDetalhe({ item, onClose }) {
  if (!item) return null;
  const isEntrada = item.tipo === 'entrada';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header-row">
          <h2>Detalhes da Movimentação</h2>
          <button className="modal-fechar-btn" onClick={onClose}>×</button>
        </div>

        <span className={isEntrada ? "detalhe-badge-entrada" : "detalhe-badge-saida"}>
          {isEntrada ? "↗ Receita" : "↘ Despesa"}
        </span>

        <div className="detalhe-campo">
          <p className="detalhe-label">
            {item.referencia_tipo === 'os' ? 'Serviços' : item.referencia_tipo === 'venda' ? 'Produtos' : 'Descrição'}
          </p>
          <p className="detalhe-texto">{limparDescricao(item.descricao)}</p>
        </div>

        {extrairInfo(item.descricao, 'Peças') && (
          <div className="detalhe-campo">
            <p className="detalhe-label">Produtos Utilizados</p>
            <p className="detalhe-texto-sm">{extrairInfo(item.descricao, 'Peças')}</p>
          </div>
        )}

        {(extrairInfo(item.descricao, 'Cliente') || extrairInfo(item.descricao, 'Fornecedor')) && (
          <div className="detalhe-campo">
            <p className="detalhe-label">{isEntrada ? 'Cliente' : 'Fornecedor'}</p>
            <p className="detalhe-texto-sm">
              {extrairInfo(item.descricao, 'Cliente') || extrairInfo(item.descricao, 'Fornecedor')}
            </p>
          </div>
        )}

        {extrairInfo(item.descricao, 'Veículo') && (
          <div className="detalhe-campo">
            <p className="detalhe-label">Veículo</p>
            <p className="detalhe-texto-sm">{extrairInfo(item.descricao, 'Veículo')}</p>
          </div>
        )}

        <div className="detalhe-campo">
          <p className="detalhe-label">Valor</p>
          <p className={`detalhe-valor-principal ${isEntrada ? "detalhe-valor-entrada" : "detalhe-valor-saida"}`}>
            R$ {Number(item.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="detalhe-campo">
          <p className="detalhe-label">Data</p>
          <p className="detalhe-texto-sm">{item.criado_em}</p>
        </div>

        {item.referencia_tipo && (
          <div className="detalhe-campo">
            <p className="detalhe-label">Origem</p>
            <span className="detalhe-origem-badge">
              {item.referencia_tipo === 'os'     ? "Ordem de Serviço" :
               item.referencia_tipo === 'venda'  ? "Venda de Produto" :
               item.referencia_tipo === 'compra' ? "Compra"           : "Ajuste"}
              {item.referencia_id ? ` #${item.referencia_id}` : ""}
            </span>
          </div>
        )}

        <div className="modal-actions">
          <Btn onClick={onClose}>Fechar</Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Painel principal
// ─────────────────────────────────────────────────────────────
function Painel({ onVerReceita, movimentacoes, totais, onVenda, onOS, onCompra, carregando }) {
  const [showCompra, setShowCompra] = useState(false);
  const [showVenda,  setShowVenda]  = useState(false);
  const [showOS,     setShowOS]     = useState(false);

  const ultimasOS = movimentacoes.filter((m) => m.referencia_tipo === 'os').slice(0, 5);
  const maxVal    = Math.max(totais.total_entradas, totais.total_saidas, 1);

  return (
    <main className="main">
      <Header
        title="Financeiro"
        subtitle="Controle financeiro da oficina"
        action={
          <div className="header-actions">
            <Btn onClick={onVerReceita}>Ver Receita</Btn>
            <Btn onClick={() => setShowOS(true)}>Ordem de Serviço</Btn>
            <Btn onClick={() => setShowVenda(true)}>Nova Venda</Btn>
            <Btn onClick={() => setShowCompra(true)}>Nova Compra</Btn>
          </div>
        }
      />

      <div className="cards-grid">
        <div className="card-financeiro card-red">
          <div className="card-icon-financeiro">↘</div>
          <h3>R$ {totais.total_saidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          <p>Gastos / Compras</p>
        </div>
        <div className="card-financeiro card-green">
          <div className="card-icon-financeiro">↗</div>
          <h3>R$ {totais.total_entradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          <p>Receitas</p>
        </div>
        <div className="card-financeiro card-orange">
          <div className="card-icon-financeiro">$</div>
          <h3>R$ {totais.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          <p>Saldo Atual</p>
        </div>
      </div>

      <div className="painel-grid">
        <div className="grafico-box modern-chart">
          <div className="grafico-header">
            <h2>Resumo Financeiro</h2>
            <p>Movimentação do mês</p>
          </div>
          {carregando ? <p className="sem-dados">Carregando...</p> : (
            <div className="modern-bars">
              {[
                { label: "Gastos",   val: totais.total_saidas,       cls: "fill-entrada" },
                { label: "Receitas", val: totais.total_entradas,     cls: "fill-venda"   },
                { label: "Saldo",    val: Math.max(totais.saldo, 0), cls: "fill-lucro"   },
              ].map(({ label, val, cls }) => (
                <div key={label} className="bar-card">
                  <div className="bar-top">
                    <span>{label}</span>
                    <strong>R$ {val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="bar-bg">
                    <div className={`bar-fill ${cls}`}
                      style={{ width: `${Math.min((val / maxVal) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="os-box">
          <div className="grafico-header">
            <h2>Ordens de Serviço</h2>
            <p>Últimas registradas este mês</p>
          </div>
          <div className="table-mini">
            <table>
              <thead>
                <tr><th>Data</th><th>Descrição</th><th>Valor</th></tr>
              </thead>
              <tbody>
                {ultimasOS.length > 0 ? ultimasOS.map((os) => (
                  <tr key={os.id}>
                    <td>{os.data}</td>
                    <td>{limparDescricao(os.descricao)}</td>
                    <td>
                      <span className="valor-pill">
                        R$ {Number(os.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="sem-dados">Nenhuma OS registrada este mês.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCompra && <ModalCompra onClose={() => setShowCompra(false)} onSalvar={onCompra} />}
      {showVenda  && <ModalVenda  onClose={() => setShowVenda(false)}  onSalvar={onVenda}  />}
      {showOS     && <ModalOS     onClose={() => setShowOS(false)}     onSalvar={onOS}     />}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Tela de Receita
// ─────────────────────────────────────────────────────────────
function Receita({ onVoltar, movimentacoes, totais }) {
  const [busca,           setBusca]           = useState("");
  const [filtro,          setFiltro]          = useState("Mensal");
  const [showExport,      setShowExport]      = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const hoje = new Date();

  const dataCorte = {
    Mensal:     new Date(hoje.getFullYear(), hoje.getMonth(), 1),
    Trimestral: new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1),
    Anual:      new Date(hoje.getFullYear(), 0, 1),
    Todos:      new Date(2000, 0, 1),
  }[filtro];

  const parsarData = (dataStr) => {
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(`${ano}-${mes}-${dia}`);
  };

  const receitas = movimentacoes.filter((m) =>
    m.tipo === 'entrada' &&
    parsarData(m.data) >= dataCorte &&
    m.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const despesas = movimentacoes.filter((m) =>
    m.tipo === 'saida' &&
    parsarData(m.data) >= dataCorte &&
    m.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const totalReceitas = receitas.reduce((acc, r) => acc + Number(r.valor), 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + Number(d.valor), 0);
  const saldoPeriodo  = totalReceitas - totalDespesas;

  const tipoReceita = (item) => {
    if (item.referencia_tipo === 'os')    return { label: "OS",    cls: "badge-os"    };
    if (item.referencia_tipo === 'venda') return { label: "Venda", cls: "badge-venda" };
    return                                       { label: "Outro", cls: "badge-outro" };
  };

  return (
    <main className="main">
      <Header
        title="Receitas"
        subtitle="Detalhamento financeiro da oficina"
        action={
          <div className="header-actions">
            <Btn onClick={() => setShowExport(true)}>Exportar</Btn>
            <Btn onClick={onVoltar}>Voltar</Btn>
          </div>
        }
      />

      {/* Cards de resumo */}
      <div className="cards-grid">
        <div className="card-financeiro card-green">
          <div className="card-icon-financeiro">↗</div>
          <h3>R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          <p>Receitas do período</p>
        </div>
        <div className="card-financeiro card-red">
          <div className="card-icon-financeiro">↘</div>
          <h3>R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          <p>Despesas do período</p>
        </div>
        <div className="card-financeiro card-orange">
          <div className="card-icon-financeiro">$</div>
          <h3>R$ {saldoPeriodo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          <p>Saldo do período</p>
        </div>
      </div>

      {/* Barra de ferramentas */}
      <div className="receita-toolbar">
        <div className="busca-wrapper" style={{ marginBottom: 0 }}>
          <img src="./icons/lupa-svgrepo-com.svg" alt="" className="icon busca-icon" />
          <input type="text" className="busca-input"
            placeholder=" Buscar por descrição..."
            value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="pill-group">
          {["Mensal","Trimestral","Anual","Todos"].map((f) => (
            <Pill key={f} active={filtro === f} onClick={() => setFiltro(f)}>{f}</Pill>
          ))}
        </div>
      </div>

      {/* Tabelas */}
      <div className="receita-grid">

        <div className="table-box">
          <h3 className="table-title">Receitas</h3>
          <table>
            <thead>
              <tr>
                <th>Cód.</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {receitas.length > 0 ? receitas.map((r) => {
                const tipo     = tipoReceita(r);
                const cliente  = extrairInfo(r.descricao, 'Cliente');
                const descLimpa = limparDescricao(r.descricao);
                return (
                  <tr key={r.id} className="linha-clicavel"
                    onClick={() => setItemSelecionado(r)}>
                    <td className="td-codigo">{r.referencia_id || "—"}</td>
                    <td><span className={tipo.cls}>{tipo.label}</span></td>
                    <td className="td-cliente">{cliente || "—"}</td>
                    <td className="td-desc">{descLimpa}</td>
                    <td><span className="valor-pill">R$ {Number(r.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></td>
                  </tr>
                );
              }) : <tr><td colSpan="5" className="sem-dados">Nenhuma receita no período.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h3 className="table-title">Despesas</h3>
          <table>
            <thead>
              <tr>
                <th>Cód.</th>
                <th>Fornecedor</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {despesas.length > 0 ? despesas.map((d) => {
                const fornecedor = extrairInfo(d.descricao, 'Fornecedor');
                const descLimpa  = limparDescricao(d.descricao);
                return (
                  <tr key={d.id} className="linha-clicavel"
                    onClick={() => setItemSelecionado(d)}>
                    <td className="td-codigo">{d.referencia_id || "—"}</td>
                    <td className="td-cliente">{fornecedor || "—"}</td>
                    <td className="td-desc">{descLimpa}</td>
                    <td><span className="valor-pill">R$ {Number(d.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></td>
                  </tr>
                );
              }) : <tr><td colSpan="4" className="sem-dados">Nenhuma despesa no período.</td></tr>}
            </tbody>
          </table>
        </div>

      </div>

      {itemSelecionado && (
        <ModalDetalhe item={itemSelecionado} onClose={() => setItemSelecionado(null)} />
      )}

      {showExport && (
        <ModalExport
          onClose={() => setShowExport(false)}
          movimentacoes={movimentacoes}
          totais={{ ...totais, saldo: saldoPeriodo }}
        />
      )}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente raiz
// ─────────────────────────────────────────────────────────────
export default function Financeiro() {
  const [page,          setPage]          = useState("painel");
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [totais,        setTotais]        = useState({ total_entradas: 0, total_saidas: 0, saldo: 0 });
  const [carregando,    setCarregando]    = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await listarMovimentacoes({ mes: mesAtual() });
      setMovimentacoes(res.dados);
      setTotais({ total_entradas: res.total_entradas, total_saidas: res.total_saidas, saldo: res.saldo });
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const handleVenda = async (dados) => {
    const res = await criarVenda(dados);
    await carregar();
    alert(`✅ ${res.mensagem}\nTotal: R$ ${Number(res.total).toFixed(2)}`);
  };

  const handleOS = async (dados) => {
    const res = await criarOS(dados);
    await carregar();
    alert(`✅ ${res.mensagem}\nTotal: R$ ${Number(res.valor_total).toFixed(2)}`);
  };

  const handleCompra = async (dados) => {
    const res = await criarCompra(dados);
    await carregar();
    alert(`✅ ${res.mensagem}\nTotal: R$ ${Number(res.total).toFixed(2)}`);
  };

  return (
    <div className="app">
      <Sidebar />
      {page === "painel" ? (
        <Painel
          movimentacoes={movimentacoes}
          totais={totais}
          carregando={carregando}
          onVenda={handleVenda}
          onOS={handleOS}
          onCompra={handleCompra}
          onVerReceita={() => setPage("receita")}
        />
      ) : (
        <Receita movimentacoes={movimentacoes} totais={totais} onVoltar={() => setPage("painel")} />
      )}
    </div>
  );
}