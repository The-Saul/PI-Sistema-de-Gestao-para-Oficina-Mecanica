function ProdutoCard({ produto, onVisualizar, onExcluir }) {
  const estoqueBaixo = Number(produto.quantidade_atual) <= Number(produto.quantidade_minima);

  return (
    <div className={`cliente-card ${estoqueBaixo ? "produto-card--alerta" : ""}`}>

      <div className="cliente-card__info">
        <div className="cliente-card__principal">
          <span className="cliente-card__nome">
            {produto.nome}
            {estoqueBaixo && (
              <span className="produto-alerta-badge">⚠ Estoque baixo</span>
            )}
          </span>
          <span className="cliente-card__cpf">
            {produto.codigo ? `Cód: ${produto.codigo}` : "Sem código"} · {produto.unidade}
          </span>
        </div>

        <div className="cliente-card__contato">
          <span>
            <img src="./icons/box-svgrepo-com.svg" alt="" className="icon" />
            Qtd: {produto.quantidade_atual} {produto.unidade}
          </span>
          <span>
            Mín: {produto.quantidade_minima} {produto.unidade}
          </span>
          <span>
            Compra: R$ {Number(produto.preco_compra).toFixed(2)}
          </span>
          <span>
            Venda: R$ {Number(produto.preco_venda).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="cliente-card__acoes">
        <button className="btn-visualizar" onClick={() => onVisualizar(produto)}>
          <img src="./icons/eye-svgrepo-com.svg" alt="" className="icon-eye" />
          Ver detalhes
        </button>
        <button className="btn-excluir" onClick={() => onExcluir(produto.id)}>
          <img src="./icons/trash-svgrepo-com.svg" alt="" className="icon-trash" />
        </button>
      </div>

    </div>
  );
}

export default ProdutoCard;