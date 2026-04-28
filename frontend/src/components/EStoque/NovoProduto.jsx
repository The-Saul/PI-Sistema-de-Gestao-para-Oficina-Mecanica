export function ModalNovoProduto({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Novo produto</h2>

        <div className="form-grid">
          <input placeholder="Fornecedor" />
          <input placeholder="Código" />
          <input placeholder="Quantidade" />

          <input placeholder="Peça" />
          <input placeholder="Valor" />
          <input type="date" />

          <input className="full" placeholder="Observação" />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-add">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}