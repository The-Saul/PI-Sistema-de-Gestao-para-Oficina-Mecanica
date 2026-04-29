export function ListProduto({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-ListProduto">
      <div className="modal-List">
        <h2>estoque</h2>
        <div className="modal-actions-ListProduto">
          <button className="btn-Voltar" onClick={onClose}>
            Voltar
          </button>
        </div>
        <div className="form-ListProduto">
          <input className="full-List" placeholder="Pesquisar" />
        </div>
      </div>
    </div>
  );
}