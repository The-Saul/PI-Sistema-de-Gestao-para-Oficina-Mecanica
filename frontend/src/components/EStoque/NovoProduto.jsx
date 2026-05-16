import { useState } from "react";

export function NovoProduto({
  open,
  onClose,
  onAdd
}) {

  const [form, setForm] = useState({
    fornecedor_id: "",
    codigo: "",
    quantidade_atual: "",
    nome: "",
    preco_venda: "",
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

    if (!form.nome || !form.codigo) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    onAdd(form);

    setForm({
      fornecedor_id: "",
      codigo: "",
      quantidade_atual: "",
      nome: "",
      preco_venda: "",
      observacao: "",
    });
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Novo produto</h2>

        <div className="form-grid">

          <input
            name="fornecedor_id"
            placeholder="Fornecedor ID"
            onChange={handleChange}
          />

          <input
            name="codigo"
            placeholder="Código"
            onChange={handleChange}
          />

          <input
            name="quantidade_atual"
            placeholder="Quantidade"
            onChange={handleChange}
          />

          <input
            name="nome"
            placeholder="Nome"
            onChange={handleChange}
          />

          <input
            name="preco_venda"
            placeholder="Valor"
            onChange={handleChange}
          />

          <input
            className="full"
            name="observacao"
            placeholder="Observação"
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
            Adicionar
          </button>

        </div>

      </div>

    </div>
  );
}