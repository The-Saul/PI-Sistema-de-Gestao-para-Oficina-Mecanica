export function Retirada({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Retirada</h2>

        <div className="form-grid">
          <input placeholder="Funcionario" />
          <input placeholder="Código" />
          <input placeholder="Quantidade" />

          <input placeholder="Peça" />
          <input type="date" />

          <input className="full" placeholder="Observação" />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-add">
            Retirar
          </button>
        </div>
      </div>
    </div>
  );
}