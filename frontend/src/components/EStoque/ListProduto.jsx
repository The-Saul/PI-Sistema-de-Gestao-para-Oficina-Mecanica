import { useState } from "react";

export function ListProduto({ open, onClose, produtos, onDelete }) {
  const [busca, setBusca] = useState("");

  if (!open) return null;

  const produtosFiltrados = produtos.filter((p) =>
    p.peca.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    p.fornecedor.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Estoque</h2>

        <div className="modal-header">
          <input
            className="full-list"
            placeholder="Pesquisar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <button className="btn-voltar" onClick={onClose}>
            Voltar
          </button>
        </div>

        <div className="form-header">
          {produtosFiltrados.length === 0 ? (
            <p>Nenhum produto encontrado</p>
          ) : (
            produtosFiltrados.map((p) => (
              <div key={p.id} className="form-listproduto">
                <p><strong>{p.peca}</strong></p>
                <p><strong>Fcd:</strong> {p.fornecedor}</p>
                <p><strong>Cdg:</strong> {p.codigo}</p>
                <p><strong>Qtd:</strong> {p.quantidade}</p>
                <p><strong>R$:</strong> {p.valor}</p>
                <p><strong>Data:</strong> {p.data}</p>
                <p><strong>Obs.:</strong> {p.observacao}</p>

                <button className="btn-listExcluir"
                  onClick={() => {
                    if (window.confirm("Deseja excluir este produto?")) {
                      onDelete(p.id);
                    }
                  }}
                >
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}