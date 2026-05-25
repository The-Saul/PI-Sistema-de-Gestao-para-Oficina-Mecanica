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

function Btn({ children, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} className="btn">{children}</button>;
}

function Pill({ children, active, onClick }) {
  return <button onClick={onClick} className={`pill ${active ? "active" : ""}`}>{children}</button>;
}

function Label({ children }) {
  return <label className="label">{children}</label>;
}

// ─────────────────────────────────────────────────────────────
// Seletor de produto com busca (usado em Venda e OS)
// ─────────────────────────────────────────────────────────────
function SeletorProduto({ onAdicionar }) {
  const [busca,    setBusca]    = useState("");
  const [produtos, setProdutos] = useState([]);
  const [qtd,      setQtd]      = useState(1);
  const [selecionado, setSelecionado] = useState(null);
  const [carregando,  setCarregando]  = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setCarregando(true);
      try {
        const lista = await buscarProdutos(busca);
        setProdutos(lista);
      } catch {
        setProdutos([]);
      } finally {
        setCarregando(false);
      }
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
    <div style={{ background: "#f8f9fd", borderRadius: 10, padding: 14, marginTop: 10 }}>
      <Label>Buscar produto</Label>
      <input
        className="input"
        placeholder="Digite o nome ou código..."
        value={busca}
        onChange={(e) => { setBusca(e.target.value); setSelecionado(null); }}
        style={{ marginBottom: 8 }}
      />

      {/* Lista de resultados */}
      {busca && !selecionado && (
        <div style={{ maxHeight: 160, overflowY: "auto", border: "1px solid #d4dae8", borderRadius: 8, background: "#fff", marginBottom: 8 }}>
          {carregando && <p style={{ padding: 10, color: "#888", fontSize: 13 }}>Buscando...</p>}
          {!carregando && produtos.length === 0 && (
            <p style={{ padding: 10, color: "#888", fontSize: 13 }}>Nenhum produto encontrado.</p>
          )}
          {!carregando && produtos.map((p) => (
            <div
              key={p.id}
              onClick={() => { setSelecionado(p); setBusca(p.nome); }}
              style={{
                padding: "10px 14px", cursor: "pointer", fontSize: 13,
                borderBottom: "1px solid #f1f1f1",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f3f5fa"}
              onMouseLeave={(e) => e.currentTarget.style.background = ""}
            >
              <span><strong>{p.nome}</strong> {p.codigo ? `(${p.codigo})` : ""}</span>
              <span style={{ color: "#7b8299", fontSize: 12 }}>
                Estq: {p.quantidade_atual} {p.unidade} · R$ {Number(p.preco_venda).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Produto selecionado + quantidade */}
      {selecionado && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <div style={{ flex: 1, fontSize: 13, background: "#fff", padding: "8px 12px", borderRadius: 8, border: "1px solid #d4dae8" }}>
            ✓ <strong>{selecionado.nome}</strong> — R$ {Number(selecionado.preco_venda).toFixed(2)} / {selecionado.unidade}
            <span style={{ color: "#7b8299", marginLeft: 8 }}>(Estq: {selecionado.quantidade_atual})</span>
          </div>
          <div>
            <Label>Qtd</Label>
            <input
              type="number" min="1" max={selecionado.quantidade_atual}
              value={qtd} onChange={(e) => setQtd(Number(e.target.value))}
              className="input" style={{ width: 70 }}
            />
          </div>
          <button onClick={handleAdicionar} className="btn" style={{ marginLeft: 0, fontSize: 14, padding: "8px 16px" }}>
            + Adicionar
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tabela de itens adicionados (usada em Venda e OS)
// ─────────────────────────────────────────────────────────────
function TabelaItens({ itens, onRemover }) {
  if (itens.length === 0) return null;
  const total = itens.reduce((acc, i) => acc + i.quantidade * i.preco_unitario, 0);
  return (
    <div style={{ marginTop: 12 }}>
      <Label>Itens adicionados</Label>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8f9fd" }}>
            <th style={{ textAlign: "left", padding: "8px 10px" }}>Produto</th>
            <th style={{ textAlign: "center", padding: "8px 10px" }}>Qtd</th>
            <th style={{ textAlign: "right", padding: "8px 10px" }}>Preço unit.</th>
            <th style={{ textAlign: "right", padding: "8px 10px" }}>Subtotal</th>
            <th style={{ padding: "8px 10px" }}></th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, i) => (
            <tr key={i} style={{ borderTop: "1px solid #eaeef5" }}>
              <td style={{ padding: "8px 10px" }}>{item.nome}</td>
              <td style={{ textAlign: "center", padding: "8px 10px" }}>{item.quantidade} {item.unidade}</td>
              <td style={{ textAlign: "right", padding: "8px 10px" }}>R$ {item.preco_unitario.toFixed(2)}</td>
              <td style={{ textAlign: "right", padding: "8px 10px" }}>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</td>
              <td style={{ textAlign: "center", padding: "8px 10px" }}>
                <button onClick={() => onRemover(i)}
                  style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#dc2626", fontSize: 13 }}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
          <tr style={{ borderTop: "2px solid #eaeef5", fontWeight: 700 }}>
            <td colSpan="3" style={{ padding: "8px 10px", textAlign: "right" }}>Total:</td>
            <td style={{ padding: "8px 10px", textAlign: "right" }}>R$ {total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de Nova Venda (produtos do estoque)
// ─────────────────────────────────────────────────────────────
function ModalVenda({ onClose, onSalvar }) {
  const [clientes,    setClientes]    = useState([]);
  const [clienteId,   setClienteId]   = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [observacao,  setObservacao]  = useState("");
  const [itens,       setItens]       = useState([]);
  const [salvando,    setSalvando]    = useState(false);

  useEffect(() => {
    listarClientesFinanceiro()
      .then(setClientes)
      .catch(() => setClientes([]));
  }, []);

  const adicionarItem = (item) => {
    setItens((prev) => {
      const existe = prev.findIndex((i) => i.produto_id === item.produto_id);
      if (existe >= 0) {
        const novo = [...prev];
        const novaQtd = novo[existe].quantidade + item.quantidade;
        if (novaQtd > item.estoque) {
          alert(`Quantidade total excede o estoque disponível (${item.estoque}).`);
          return prev;
        }
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
            <select
              className="input"
              value={clienteId}
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
            <p style={{ fontSize: 12, color: "#7b8299", marginTop: 4 }}>
              Ou digite manualmente:
            </p>
            <input
              className="input"
              placeholder="Nome do cliente"
              value={clienteNome}
              onChange={(e) => { setClienteNome(e.target.value); setClienteId(""); }}
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <Label>Observação (opcional)</Label>
            <input className="input" value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: pagamento à vista" />
          </div>
        </div>

        <SeletorProduto onAdicionar={adicionarItem} />
        <TabelaItens itens={itens} onRemover={removerItem} />

        <div className="modal-actions">
          <Btn onClick={onClose}>Cancelar</Btn>
          <Btn onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Confirmar Venda"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de Nova OS (serviço + peças do estoque)
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
  const [buscaServico, setBuscaServico] = useState("");
  const [servico,      setServico]      = useState("");
  const [valorServico, setValorServico] = useState("");
  const [pecas,        setPecas]        = useState([]);
  const [salvando,     setSalvando]     = useState(false);

  useEffect(() => {
    listarClientesFinanceiro()
      .then(setClientes)
      .catch(() => setClientes([]));
  }, []);

  // Filtra serviços pelo que o usuário digita
  const servicosFiltrados = SERVICOS.filter((s) =>
    s.toLowerCase().includes(buscaServico.toLowerCase())
  );

  const adicionarPeca = (item) => {
    setPecas((prev) => {
      const existe = prev.findIndex((p) => p.produto_id === item.produto_id);
      if (existe >= 0) {
        const novo = [...prev];
        const novaQtd = novo[existe].quantidade + item.quantidade;
        if (novaQtd > item.estoque) {
          alert(`Quantidade total excede o estoque disponível (${item.estoque}).`);
          return prev;
        }
        novo[existe] = { ...novo[existe], quantidade: novaQtd };
        return novo;
      }
      return [...prev, item];
    });
  };

  const removerPeca = (index) => setPecas((prev) => prev.filter((_, i) => i !== index));

  const handleSalvar = async () => {
    if (!servico)      { alert("Selecione ou digite o serviço executado."); return; }
    if (!valorServico || Number(valorServico) < 0) { alert("Informe o valor do serviço."); return; }
    setSalvando(true);
    try {
      await onSalvar({
        cliente_nome:       clienteNome,
        veiculo_placa:      placa,
        veiculo_marca:      marca,
        veiculo_modelo:     modelo,
        descricao_problema: problema,
        servico,
        valor_servico:      Number(valorServico),
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
            <select
              className="input"
              value={clienteId}
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
                setPlaca("");
                setMarca("");
                setModelo("");
              }
            }}
            >
              <option value="">Selecione um cliente cadastrado</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nome} — {c.cpf ?? "sem CPF"}</option>
              ))}
            </select>
            <p style={{ fontSize: 12, color: "#7b8299", marginTop: 4 }}>
              Ou digite manualmente:
            </p>
            <input
              className="input"
              placeholder="Nome do cliente"
              value={clienteNome}
              onChange={(e) => { setClienteNome(e.target.value); setClienteId(""); }}
              style={{ marginTop: 4 }}
            />
          </div>

          {/* Veículo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
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
              onChange={(e) => setProblema(e.target.value)} placeholder="Ex: Barulho no freio dianteiro" />
          </div>

          {/* Serviço com busca */}
          <div>
            <Label>Serviço executado <span style={{ color: "#ef4444" }}>*</span></Label>
            <input
              className="input"
              value={buscaServico || servico}
              onChange={(e) => { setBuscaServico(e.target.value); setServico(""); }}
              placeholder="Digite para buscar ou descrever o serviço..."
            />
            {buscaServico && !servico && (
              <div style={{ border: "1px solid #d4dae8", borderRadius: 8, background: "#fff", maxHeight: 150, overflowY: "auto", marginTop: 4 }}>
                {servicosFiltrados.map((s) => (
                  <div key={s}
                    onClick={() => { setServico(s); setBuscaServico(""); }}
                    style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #f1f1f1" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f3f5fa"}
                    onMouseLeave={(e) => e.currentTarget.style.background = ""}
                  >
                    {s}
                  </div>
                ))}
                {/* Permite usar o texto digitado diretamente */}
                {buscaServico && (
                  <div
                    onClick={() => { setServico(buscaServico); setBuscaServico(""); }}
                    style={{ padding: "9px 14px", cursor: "pointer", fontSize: 13, color: "#2d7df6", fontWeight: 600 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f3f5fa"}
                    onMouseLeave={(e) => e.currentTarget.style.background = ""}
                  >
                    + Usar "{buscaServico}" como serviço
                  </div>
                )}
              </div>
            )}
            {servico && <p style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>✓ Serviço: <strong>{servico}</strong></p>}
          </div>

          {/* Valor do serviço */}
          <div>
            <Label>Valor do serviço (mão de obra)</Label>
            <div className="input-money">
              <span>R$</span>
              <input type="number" className="input money-field" placeholder="0,00" min="0"
                value={valorServico} onChange={(e) => setValorServico(e.target.value)} />
            </div>
          </div>

        </div>

        {/* Peças */}
        <div style={{ marginTop: 16 }}>
          <Label>Peças utilizadas (opcional)</Label>
          <SeletorProduto onAdicionar={adicionarPeca} />
          <TabelaItens itens={pecas} onRemover={removerPeca} />
        </div>

        {/* Total */}
        {(valorServico || pecas.length > 0) && (
          <div style={{ marginTop: 12, padding: "12px 16px", background: "#d1fae5", borderRadius: 10, fontSize: 15, fontWeight: 700, color: "#065f46" }}>
            Total da OS: R$ {(
              Number(valorServico || 0) +
              pecas.reduce((acc, p) => acc + p.quantidade * p.preco_unitario, 0)
            ).toFixed(2)}
          </div>
        )}

        <div className="modal-actions">
          <Btn onClick={onClose}>Cancelar</Btn>
          <Btn onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Confirmar OS"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de exportação
// ─────────────────────────────────────────────────────────────
function ModalExport({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Exportar Relatório</h2>
        <div className="modal-actions">
          <Btn onClick={() => { alert("Download em PDF realizado!"); onClose(); }}>Exportar PDF</Btn>
          <Btn onClick={() => { alert("Download em Excel realizado!"); onClose(); }}>Exportar Excel</Btn>
        </div>
      </div>
    </div>
  );
}


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
      try { setProdutos(await buscarProdutos(busca)); }
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
    <div style={{ background: "#f8f9fd", borderRadius: 10, padding: 14, marginTop: 10 }}>
      <Label>Buscar produto</Label>
      <input className="input" placeholder="Digite o nome ou código..."
        value={busca} onChange={(e) => { setBusca(e.target.value); setSelecionado(null); }}
        style={{ marginBottom: 8 }} />

      {busca && !selecionado && (
        <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #d4dae8", borderRadius: 8, background: "#fff", marginBottom: 8 }}>
          {carregando && <p style={{ padding: 10, color: "#888", fontSize: 13 }}>Buscando...</p>}
          {!carregando && produtos.length === 0 && <p style={{ padding: 10, color: "#888", fontSize: 13 }}>Nenhum produto encontrado.</p>}
          {!carregando && produtos.map((p) => (
            <div key={p.id}
              onClick={() => { setSelecionado(p); setBusca(p.nome); setPreco(p.preco_compra); }}
              style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #f1f1f1", display: "flex", justifyContent: "space-between" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f3f5fa"}
              onMouseLeave={(e) => e.currentTarget.style.background = ""}
            >
              <span><strong>{p.nome}</strong> {p.codigo ? `(${p.codigo})` : ""}</span>
              <span style={{ color: "#7b8299", fontSize: 12 }}>Compra: R$ {Number(p.preco_compra).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {selecionado && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <Label>Produto selecionado</Label>
            <div style={{ fontSize: 13, background: "#fff", padding: "8px 12px", borderRadius: 8, border: "1px solid #d4dae8" }}>
              ✓ <strong>{selecionado.nome}</strong>
            </div>
          </div>
          <div>
            <Label>Qtd</Label>
            <input type="number" min="1" value={qtd}
              onChange={(e) => setQtd(Number(e.target.value))}
              className="input" style={{ width: 70 }} />
          </div>
          <div>
            <Label>Preço unit. (R$)</Label>
            <input type="number" min="0" step="0.01" value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="input" style={{ width: 100 }} />
          </div>
          <button onClick={handleAdicionar} className="btn" style={{ marginLeft: 0, fontSize: 14, padding: "8px 16px" }}>
            + Adicionar
          </button>
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// Modal de Nova Compra (entrada de mercadoria)
// ─────────────────────────────────────────────────────────────
function ModalCompra({ onClose, onSalvar }) {
  const [fornecedores,   setFornecedores]   = useState([]);
  const [fornecedorId,   setFornecedorId]   = useState("");
  const [fornecedorNome, setFornecedorNome] = useState("");
  const [observacao,     setObservacao]     = useState("");
  const [itens,          setItens]          = useState([]);
  const [salvando,       setSalvando]       = useState(false);

  useEffect(() => {
    listarFornecedoresFinanceiro()
      .then(setFornecedores)
      .catch(() => setFornecedores([]));
  }, []);

  const adicionarItem = (item) => {
    setItens((prev) => {
      const existe = prev.findIndex((i) => i.produto_id === item.produto_id);
      if (existe >= 0) {
        const novo = [...prev];
        novo[existe] = { ...novo[existe], quantidade: novo[existe].quantidade + item.quantidade };
        return novo;
      }
      // Na compra o preço é o de COMPRA, não de venda
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

          {/* Fornecedor — select com os cadastrados */}
          <div>
            <Label>Fornecedor <span style={{ color: "#ef4444" }}>*</span></Label>
            <select
              className="input"
              value={fornecedorId}
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
            <p style={{ fontSize: 12, color: "#7b8299", marginTop: 4 }}>
              Ou digite o nome manualmente:
            </p>
            <input
              className="input"
              placeholder="Nome do fornecedor"
              value={fornecedorNome}
              onChange={(e) => { setFornecedorNome(e.target.value); setFornecedorId(""); }}
              style={{ marginTop: 4 }}
            />
          </div>

          <div>
            <Label>Observação (opcional)</Label>
            <input className="input" value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Compra mensal de filtros" />
          </div>
        </div>

        {/* Seletor de produtos — na compra usa preço de compra */}
        <SeletorProdutoCompra onAdicionar={adicionarItem} />
        <TabelaItens itens={itens} onRemover={removerItem} />

        <div className="modal-actions">
          <Btn onClick={onClose}>Cancelar</Btn>
          <Btn onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Confirmar Compra"}
          </Btn>
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
  const [showVenda, setShowVenda] = useState(false);
  const [showOS,    setShowOS]    = useState(false);

  const ultimasOS = movimentacoes
    .filter((m) => m.referencia_tipo === 'os')
    .slice(0, 5);

  const maxVal = Math.max(totais.total_entradas, totais.total_saidas, 1);

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
          {carregando ? <p style={{ marginTop: 20, color: "#888" }}>Carregando...</p> : (
            <div className="modern-bars">
              {[
                { label: "Gastos",   val: totais.total_saidas,   cls: "fill-entrada" },
                { label: "Receitas", val: totais.total_entradas, cls: "fill-venda" },
                { label: "Saldo",    val: Math.max(totais.saldo, 0), cls: "fill-lucro" },
              ].map(({ label, val, cls }) => (
                <div key={label} className="bar-card">
                  <div className="bar-top">
                    <span>{label}</span>
                    <strong>R$ {val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="bar-bg">
                    <div className={`bar-fill ${cls}`} style={{ width: `${Math.min((val / maxVal) * 100, 100)}%` }} />
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
                    <td>{os.descricao}</td>
                    <td><span className="valor-pill">R$ {Number(os.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></td>
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
      {showVenda && <ModalVenda onClose={() => setShowVenda(false)} onSalvar={onVenda} />}
      {showOS    && <ModalOS    onClose={() => setShowOS(false)}    onSalvar={onOS}   />}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Tela de Receita
// ─────────────────────────────────────────────────────────────
function Receita({ onVoltar, movimentacoes, totais }) {
  const [filtro,     setFiltro]     = useState("Mensal");
  const [showExport, setShowExport] = useState(false);

  const receitas = movimentacoes.filter((m) => m.tipo === 'entrada');
  const gastos   = movimentacoes.filter((m) => m.tipo === 'saida');

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

      <div className="receita-top">
        <div className="receita-total">
          <div className="mini-title">Saldo do período</div>
          <div className="receita-value">
            R$ {totais.saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="receita-filter">
          <div className="pill-group">
            {["Mensal","Trimestral","Anual"].map((f) => (
              <Pill key={f} active={filtro === f} onClick={() => setFiltro(f)}>{f}</Pill>
            ))}
          </div>
          <div className="date-range">📅 Dados em tempo real do banco</div>
        </div>
      </div>

      <div className="receita-grid">
        <div className="table-box">
          <h3 className="table-title">Receitas</h3>
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Valor</th></tr></thead>
            <tbody>
              {receitas.length > 0 ? receitas.map((r) => (
                <tr key={r.id}>
                  <td>{r.data}</td>
                  <td>{r.descricao}</td>
                  <td><span className="valor-pill">R$ {Number(r.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></td>
                </tr>
              )) : <tr><td colSpan="3" className="sem-dados">Nenhuma receita registrada.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h3 className="table-title">Gastos / Compras</h3>
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Valor</th></tr></thead>
            <tbody>
              {gastos.length > 0 ? gastos.map((g) => (
                <tr key={g.id}>
                  <td>{g.data}</td>
                  <td>{g.descricao}</td>
                  <td><span className="valor-pill">R$ {Number(g.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span></td>
                </tr>
              )) : <tr><td colSpan="3" className="sem-dados">Nenhum gasto registrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showExport && <ModalExport onClose={() => setShowExport(false)} />}
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
    await criarVenda(dados);
    await carregar();
  };

  const handleOS = async (dados) => {
    await criarOS(dados);
    await carregar();
  };

  const handleCompra = async (dados) => {
  await criarCompra(dados);
  await carregar();
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