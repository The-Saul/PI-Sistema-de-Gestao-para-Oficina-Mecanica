function ClienteCard({ cliente, onEditar, onExcluir }) {
  return (
    <div className="cliente-card">
      <div className="cliente-card__info">
        <div className="cliente-card__principal">
          <span className="cliente-card__nome">{cliente.nome}</span>
          <span className="cliente-card__cpf">{cliente.cpf}</span>
          <span className="cliente-card__veiculo">
            {cliente.marcaCarro} {cliente.modeloCarro} - {cliente.placaCarro}
          </span>
        </div>
        <div className="cliente-card__contato">
          <span>
            <img src="./icons/phone-svgrepo-com.svg" alt="" className="icon" />
            {cliente.telefone}
          </span>
          <span>
            <img src="./icons/mail-svgrepo-com.svg" alt="" className="icon" />
            {cliente.email}
          </span>
        </div>
      </div>

      <div className="cliente-card__acoes">
        <button className="btn-editar" onClick={() => onEditar(cliente)}>
          <img src="./icons/pencil-svgrepo-com.svg" alt="" className="icon" />
          Editar
        </button>
        <button className="btn-excluir" onClick={() => onExcluir(cliente.id)}>
          <img src="./icons/trash-svgrepo-com.svg" alt="" className="icon icon-trash" />
        </button>
      </div>
    </div>
  );
}

export default ClienteCard;