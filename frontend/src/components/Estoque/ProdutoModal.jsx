import { useState, useEffect } from "react";
import { proximoCodigo } from "../../services/produtosService";

const FORM_VAZIO = {
  codigo:            "",
  nome:              "",
  descricao:         "",
  unidade:           "un",
  preco_compra:      "",
  preco_venda:       "",
  quantidade_atual:  "",
  quantidade_minima: "",
  observacao:        "",
};

const UNIDADES = ["un", "kg", "L", "m", "cx", "par"];

function ProdutoModal({ aberto, onFechar, onSalvar, produtoSelecionado }) {
  const [form, setForm]           = useState(FORM_VAZIO);
  const [editando, setEditando]   = useState(false);
  const [buscandoCodigo, setBuscandoCodigo] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    if (produtoSelecionado) {
      // Modo visualização/edição: preenche com dados existentes
      setForm({
        codigo:            produtoSelecionado.codigo            ?? "",
        nome:              produtoSelecionado.nome              ?? "",
        descricao:         produtoSelecionado.descricao         ?? "",
        unidade:           produtoSelecionado.unidade           ?? "un",
        preco_compra:      produtoSelecionado.preco_compra      ?? "",
        preco_venda:       produtoSelecionado.preco_venda       ?? "",
        quantidade_atual:  produtoSelecionado.quantidade_atual  ?? "",
        quantidade_minima: produtoSelecionado.quantidade_minima ?? "",
        observacao:        produtoSelecionado.observacao        ?? "",
      });
      setEditando(false);
    } else {
      // Novo produto: busca o próximo código automaticamente
      setForm(FORM_VAZIO);
      setEditando(true);
      setBuscandoCodigo(true);
      proximoCodigo()
        .then((codigo) => setForm((f) => ({ ...f, codigo })))
        .finally(() => setBuscandoCodigo(false));
    }
  }, [produtoSelecionado, aberto]);

  if (!aberto) return null;

  const somenteLeitura = !editando;
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await onSalvar(form);
      setEditando(false);
    } catch {
      // mantém editável se der erro
    }
  };

  const titulo = produtoSelecionado
    ? (editando ? "Editar Produto" : "Detalhes do Produto")
    : "Novo Produto";

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal__header">
          <h2 className="modal__titulo">{titulo}</h2>
          <button className="modal__fechar" onClick={onFechar}>×</button>
        </div>

        <form onSubmit={handleSalvar}>

          {/* Linha 1: Nome + Código */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Nome do Produto <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Nome do produto"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                readOnly={somenteLeitura}
                required
              />
            </div>
            <div className="modal__field">
              <label>
                Código (SKU)
                <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: 6 }}>
                  — gerado automaticamente
                </span>
              </label>
              <input
                type="text"
                placeholder={buscandoCodigo ? "Gerando..." : "Ex: PRO-001"}
                value={form.codigo}
                onChange={(e) => set("codigo", e.target.value.toUpperCase())}
                readOnly={somenteLeitura || buscandoCodigo}
                style={buscandoCodigo ? { opacity: 0.5 } : {}}
              />
            </div>
          </div>

          {/* Linha 2: Descrição */}
          <div className="modal__row" style={{ gridTemplateColumns: "1fr" }}>
            <div className="modal__field">
              <label>Descrição</label>
              <input
                type="text"
                placeholder="Descrição do produto"
                value={form.descricao}
                onChange={(e) => set("descricao", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
          </div>

          <p className="modal__secao">Preços e Unidade</p>

          {/* Linha 3: Unidade + Preço Compra + Preço Venda */}
          <div className="modal__row modal__row--3">
            <div className="modal__field">
              <label>Unidade</label>
              {somenteLeitura ? (
                <input type="text" value={form.unidade} readOnly />
              ) : (
                <select value={form.unidade} onChange={(e) => set("unidade", e.target.value)}>
                  {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              )}
            </div>
            <div className="modal__field">
              <label>Preço de Compra (R$)</label>
              <input
                type="number" step="0.01" min="0" placeholder="0,00"
                value={form.preco_compra}
                onChange={(e) => set("preco_compra", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
            <div className="modal__field">
              <label>Preço de Venda (R$)</label>
              <input
                type="number" step="0.01" min="0" placeholder="0,00"
                value={form.preco_venda}
                onChange={(e) => set("preco_venda", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
          </div>

          <p className="modal__secao">Estoque</p>

          {/* Linha 4: Quantidade Atual + Mínima */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Quantidade Atual</label>
              <input
                type="number" step="0.001" min="0" placeholder="0"
                value={form.quantidade_atual}
                onChange={(e) => set("quantidade_atual", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
            <div className="modal__field">
              <label>
                Quantidade Mínima
                <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: 6 }}>(alerta)</span>
              </label>
              <input
                type="number" step="0.001" min="0" placeholder="0"
                value={form.quantidade_minima}
                onChange={(e) => set("quantidade_minima", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
          </div>

          {/* Linha 5: Observação */}
          <div className="modal__row" style={{ gridTemplateColumns: "1fr" }}>
            <div className="modal__field">
              <label>Observação</label>
              <input
                type="text"
                placeholder="Observações gerais"
                value={form.observacao}
                onChange={(e) => set("observacao", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
          </div>

          {/* Data de cadastro — só na visualização */}
          {produtoSelecionado && somenteLeitura && (
            <div className="modal__row" style={{ gridTemplateColumns: "1fr" }}>
              <div className="modal__field">
                <label>Cadastrado em</label>
                <input type="text" value={produtoSelecionado.criado_em ?? ""} readOnly />
              </div>
            </div>
          )}

          <div className="modal__footer">
            <button type="button" className="btn-cancelar" onClick={onFechar}>Cancelar</button>

            {!produtoSelecionado && (
              <button type="submit" className="btn-salvar" disabled={buscandoCodigo}>
                Cadastrar
              </button>
            )}
            {produtoSelecionado && !editando && (
              <button type="button" className="btn-editar-modal" onClick={() => setEditando(true)}>
                <img src="./icons/pencil-svgrepo-com.svg" alt="" className="icon icon-btn-editar" />
                Editar
              </button>
            )}
            {produtoSelecionado && editando && (
              <button type="submit" className="btn-salvar">Salvar alterações</button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default ProdutoModal;