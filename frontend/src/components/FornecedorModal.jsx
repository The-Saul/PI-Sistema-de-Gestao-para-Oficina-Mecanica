import { useState, useEffect } from "react";

const FORM_VAZIO = {
  nome: "",
  cnpj: "",
  telefone: "",
  email: "",
  cep: "",
  estado: "",
  complemento: "",
  rua: "",
  numero: "",
  bairro: "",
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

function FornecedorModal({ aberto, onFechar, onSalvar, fornecedorEditando }) {
  const [form, setForm] = useState(FORM_VAZIO);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");

  // Preenche o form quando estiver editando
  useEffect(() => {
    if (fornecedorEditando) {
      setForm(fornecedorEditando);
    } else {
      setForm(FORM_VAZIO);
    }
    setErroCep("");
  }, [fornecedorEditando, aberto]);

  if (!aberto) return null;

  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const buscarCep = async () => {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setErroCep("CEP deve ter 8 dígitos.");
      return;
    }
    setBuscandoCep(true);
    setErroCep("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await res.json();
      if (dados.erro) {
        setErroCep("CEP não encontrado.");
      } else {
        setForm((f) => ({
          ...f,
          rua: dados.logradouro || "",
          bairro: dados.bairro || "",
          estado: dados.uf || "",
          complemento: dados.complemento || "",
        }));
      }
    } catch {
      setErroCep("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(form);
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Cabeçalho */}
        <div className="modal__header">
          <h2 className="modal__titulo">
            {fornecedorEditando ? "Editar Fornecedor" : "Novo Fornecedor"}
          </h2>
          <button className="modal__fechar" onClick={onFechar}>×</button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Linha 1: Nome + CNPJ */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Nome da empresa <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Nome da empresa"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                required
              />
            </div>
            <div className="modal__field">
              <label>CNPJ <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                value={form.cnpj}
                onChange={(e) => set("cnpj", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Linha 2: Telefone + Email */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={(e) => set("telefone", e.target.value)}
              />
            </div>
            <div className="modal__field">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
          </div>

          {/* Separador endereço */}
          <p className="modal__secao">Endereço</p>

          {/* Linha 3: CEP + Estado + Complemento */}
          <div className="modal__row modal__row--3">
            <div className="modal__field">
              <label>CEP</label>
              <div className="input-cep">
                <input
                  type="text"
                  placeholder="000000-000"
                  value={form.cep}
                  maxLength={9}
                  onChange={(e) => set("cep", e.target.value)}
                />
                <button
                  type="button"
                  className="btn-buscar-cep"
                  onClick={buscarCep}
                  disabled={buscandoCep}
                >
                  {buscandoCep ? "..." : "Buscar"}
                </button>
              </div>
              {erroCep && <span className="erro-cep">{erroCep}</span>}
            </div>
            <div className="modal__field">
              <label>Estado</label>
              <select
                value={form.estado}
                onChange={(e) => set("estado", e.target.value)}
              >
                <option value="">UF</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            <div className="modal__field">
              <label>Complemento</label>
              <input
                type="text"
                placeholder="Apto, Sala, etc..."
                value={form.complemento}
                onChange={(e) => set("complemento", e.target.value)}
              />
            </div>
          </div>

          {/* Linha 4: Rua + Número + Bairro */}
          <div className="modal__row modal__row--3">
            <div className="modal__field">
              <label>Rua / Logradouro</label>
              <input
                type="text"
                placeholder="Nome da rua"
                value={form.rua}
                onChange={(e) => set("rua", e.target.value)}
              />
            </div>
            <div className="modal__field">
              <label>Número</label>
              <input
                type="text"
                placeholder="Ex: 123"
                value={form.numero}
                onChange={(e) => set("numero", e.target.value)}
              />
            </div>
            <div className="modal__field">
              <label>Bairro</label>
              <input
                type="text"
                placeholder="Nome do Bairro"
                value={form.bairro}
                onChange={(e) => set("bairro", e.target.value)}
              />
            </div>
          </div>

          {/* Rodapé */}
          <div className="modal__footer">
            <button type="button" className="btn-cancelar" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              {fornecedorEditando ? "Salvar alterações" : "Cadastrar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default FornecedorModal;
