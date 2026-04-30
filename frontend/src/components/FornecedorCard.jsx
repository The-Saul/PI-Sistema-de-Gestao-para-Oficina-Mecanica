function FornecedorCard({ fornecedor, onEditar, onExcluir }) {
  return (
    <div className="fornecedor-card">
      <div className="fornecedor-card__info">
        <div className="fornecedor-card__principal">
          <span className="fornecedor-card__nome">{fornecedor.nome}</span>
          <span className="fornecedor-card__cnpj">{fornecedor.cnpj}</span>
        </div>
        <div className="fornecedor-card__contato">
          <span>
            <img src="./icons/phone-svgrepo-com.svg" alt="" className="icon" />
            {fornecedor.telefone}
          </span>
          <span>
            <img src="./icons/mail-svgrepo-com.svg" alt="" className="icon" />
            {fornecedor.email}
          </span>
        </div>
      </div>

      <div className="fornecedor-card__acoes">
        <button className="btn-editar" onClick={() => onEditar(fornecedor)}>
          <img src="./icons/pencil-svgrepo-com.svg" alt="" className="icon" />
          Editar
        </button>
        <button className="btn-excluir" onClick={() => onExcluir(fornecedor.id)}>
          <img src="./icons/trash-svgrepo-com.svg" alt="" className="icon icon-trash" />
        </button>
      </div>
    </div>
  );
}

export default FornecedorCard;
