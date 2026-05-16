import { useState } from "react";

export function Retirada({
  open,
  onClose,
  onRetirar,
  historico
}) {

  const [form, setForm] = useState({
    codigo: "",
    quantidade: "",
    observacao: "",
  });

  if (!open) return null;

  function handleChange(e) {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  function handleSubmit() {

    if (!form.codigo || !form.quantidade) {
      alert("Informe o código e a quantidade!");
      return;
    }

    onRetirar(form);

    setForm({
      codigo: "",
      quantidade: "",
      observacao: "",
    });
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Retirada</h2>

        <div className="form-grid">

          <input
            name="codigo"
            placeholder="Código"
            value={form.codigo}
            onChange={handleChange}
          />

          <input
            name="quantidade"
            placeholder="Quantidade"
            value={form.quantidade}
            onChange={handleChange}
          />

          <input
            className="full"
            name="observacao"
            placeholder="Observação"
            value={form.observacao}
            onChange={handleChange}
          />

        </div>

        <div className="modal-actions">

          <button
            className="btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="btn-add"
            onClick={handleSubmit}
          >
            Retirar
          </button>

        </div>

        <div className="historico">

          <h3>Histórico de Retiradas</h3>

          {historico.length === 0 ? (
            <p>Nenhuma retirada registrada</p>
          ) : (
            historico.map((h) => (
              <div
                key={h.id}
                className="item-historico"
              >

                <p>
                  <strong>{h.nome}</strong>
                </p>

                <p>
                  Qtd: {h.quantidade}
                </p>

                <p>
                  Data: {h.data_mov}
                </p>

                <p>
                  Obs: {h.observacao}
                </p>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}