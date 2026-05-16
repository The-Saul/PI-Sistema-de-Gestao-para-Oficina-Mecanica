import { useState } from "react";

const LIMITE_ESTOQUE = 5;

export function ListProduto({
  open,
  onClose,
  produtos,
  onDelete,
  onUpdateQuantidade,
}) {

  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);

  const [novaQtd, setNovaQtd] = useState("");

  if (!open) return null;

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    (p.fornecedor || "")
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  function salvarEdicao(id) {

    if (novaQtd === "" || Number(novaQtd) < 0) {
      alert("Digite uma quantidade válida");
      return;
    }

    onUpdateQuantidade(id, Number(novaQtd));

    setEditandoId(null);

    setNovaQtd("");
  }

  return (
    <div className="modal-overlay">

      <div className="modal-listpro">

        <h2>Estoque</h2>

        <div className="modal-header">

          <input
            className="full-list"
            placeholder="Pesquisar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <button
            className="btn-voltar"
            onClick={onClose}
          >
            Voltar
          </button>

        </div>

        <div className="form-header">

          {produtosFiltrados.length === 0 ? (
            <p>Nenhum produto encontrado</p>
          ) : (
            produtosFiltrados.map((p) => {

              const baixo =
                Number(p.quantidade_atual) <= LIMITE_ESTOQUE;

              const editando =
                editandoId === p.id;

              return (
                <div
                  key={p.id}
                  className={`form-listproduto ${
                    baixo ? "estoque-baixo" : ""
                  }`}
                >

                  <div className="list-produto">

                    <p>
                      {p.nome}

                      {baixo && (
                        <span className="alerta">
                          {" "}
                          ⚠ Estoque baixo
                        </span>
                      )}
                    </p>

                    <p>
                      Fornecedor: {p.fornecedor}
                    </p>

                    <p>
                      Cod: {p.codigo}
                    </p>

                    <div className="qtd-container">

                      {!editando ? (
                        <p>
                          Qtd: {p.quantidade_atual}
                        </p>
                      ) : (
                        <input
                          type="number"
                          value={novaQtd}
                          onChange={(e) =>
                            setNovaQtd(e.target.value)
                          }
                        />
                      )}

                    </div>

                    <p>
                      R$: {p.preco_venda}
                    </p>

                    <p>
                      OBS.: {p.observacao}
                    </p>

                  </div>

                  <div className="acoes-botoes">

                    {!editando ? (
                      <>
                        <button
                          className="btn-listeditar"
                          onClick={() => {
                            setEditandoId(p.id);
                            setNovaQtd(
                              p.quantidade_atual
                            );
                          }}
                        >
                          Editar
                        </button>

                        <button
                          className="btn-listExcluir"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Deseja excluir?"
                              )
                            ) {
                              onDelete(p.id);
                            }
                          }}
                        >
                          Excluir
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-listeditar"
                          onClick={() =>
                            salvarEdicao(p.id)
                          }
                        >
                          Salvar
                        </button>

                        <button
                          className="btn-listExcluir"
                          onClick={() =>
                            setEditandoId(null)
                          }
                        >
                          Cancelar
                        </button>
                      </>
                    )}

                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>

    </div>
  );
}