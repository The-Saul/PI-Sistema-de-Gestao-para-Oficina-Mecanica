import { useState } from "react";

const LIMITE_ESTOQUE = 5;

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
            produtosFiltrados.map((p) => {
              const baixo = Number(p.quantidade) <= LIMITE_ESTOQUE;

              return (
                <div
                  key={p.id}
                  className={`form-listproduto ${
                    baixo ? "estoque-baixo" : ""
                  }`}
                >
                  {/* 🔥 NOME + ALERTA */}
                  <p>
                    <strong>{p.peca}</strong>
                    {baixo && (
                      <span className="alerta"> ⚠ Estoque baixo</span>
                    )}
                  </p>

                  {/* 🔥 TODAS AS INFORMAÇÕES */}
                  <p><strong>Fornecedor:</strong> {p.fornecedor}</p>
                  <p><strong>Código:</strong> {p.codigo}</p>
                  <p><strong>Quantidade:</strong> {p.quantidade}</p>
                  <p><strong>Valor:</strong> R$ {p.valor}</p>
                  <p><strong>Data:</strong> {p.data}</p>
                  <p><strong>Observação:</strong> {p.observacao}</p>

                  {/* 🔥 BOTÃO */}
                  <button
                    className="btn-listExcluir"
                    onClick={() => {
                      if (window.confirm("Deseja excluir?")) {
                        onDelete(p.id);
                      }
                    }}
                  >
                    Excluir
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}