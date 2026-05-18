import { useState } from "react";

export function NovoProduto({ open, onClose, onAdd }) {
  const [form, setForm] = useState({
    fornecedor: "",
    codigo: "",
    quantidade: "",
    peca: "",
    valor: "",
    data: "",
    observacao: "",
  });

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit() {
    if (!form.peca || !form.codigo) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    onAdd(form);

    setForm({
      fornecedor: "",
      codigo: "",
      quantidade: "",
      peca: "",
      valor: "",
      data: "",
      observacao: "",
    });

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Novo produto</h2>

        <div className="form-grid">
          <input name="fornecedor" placeholder="Fornecedor" onChange={handleChange} />
          <input name="codigo" placeholder="Código" onChange={handleChange} />
          <input name="quantidade" placeholder="Quantidade" onChange={handleChange} />
          <input name="peca" placeholder="Peça" onChange={handleChange} />
          <input name="valor" placeholder="Valor" onChange={handleChange} />
          <input type="date" name="data" onChange={handleChange} />
          <input className="full" name="observacao" placeholder="Observação" onChange={handleChange} />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-add" onClick={handleSubmit}>Adicionar</button>
        </div>
      </div>
    </div>
  );
}