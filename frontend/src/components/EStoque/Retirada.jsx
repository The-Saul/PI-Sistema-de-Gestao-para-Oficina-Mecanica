import { useState } from "react";

export function Retirada({ open, onClose, onRetirar, historico }) {
  const [form, setForm] = useState({
    funcionario: "",
    codigo: "",
    quantidade: "",
    peca: "",
    data: "",
    observacao: "",
  });

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit() {
    if (!form.codigo || !form.quantidade) {
      alert("Informe o código e a quantidade!");
      return;
    }

    onRetirar(form);

    setForm({
      funcionario: "",
      codigo: "",
      quantidade: "",
      peca: "",
      data: "",
      observacao: "",
    });

    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Retirada</h2>

        <div className="form-grid">
          <input name="funcionario" placeholder="Funcionário" value={form.funcionario} onChange={handleChange} />
          <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} />
          <input name="quantidade" placeholder="Quantidade" value={form.quantidade} onChange={handleChange} />
          <input name="peca" placeholder="Peça" value={form.peca} onChange={handleChange} />
          <input type="date" name="data" value={form.data} onChange={handleChange} />
          <input className="full" name="observacao" placeholder="Observação" value={form.observacao} onChange={handleChange} />
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Retirar</button>
        </div>

        {/* 🔥 HISTÓRICO */}
        <div className="historico">
          <h3>Histórico de Retiradas</h3>

          {historico.length === 0 ? (
            <p>Nenhuma retirada registrada</p>
          ) : (
            historico.map((h) => (
              <div key={h.id} className="item-historico">
                <p><strong>{h.peca}</strong></p>
                <p>Funcionário: {h.funcionario}</p>
                <p>Código: {h.codigo}</p>
                <p>Qtd: {h.quantidade}</p>
                <p>Data: {h.data}</p>
                <p>Obs: {h.observacao}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}