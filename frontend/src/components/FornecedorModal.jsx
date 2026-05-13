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

// modo: "novo" | "visualizar" | "editar"
function FornecedorModal({ aberto, onFechar, onSalvar, fornecedorSelecionado, modoInicial }) {
  const [form, setForm]           = useState(FORM_VAZIO);
  const [editando, setEditando]   = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep]     = useState("");

  useEffect(() => {
    if (!aberto) return;
    if (fornecedorSelecionado) {
      setForm(fornecedorSelecionado);
      setEditando(false); // abre sempre em visualização
    } else {
      setForm(FORM_VAZIO);
      setEditando(true);  // novo cadastro já começa editável
    }
    setErroCep("");
  }, [fornecedorSelecionado, aberto]);

  if (!aberto) return null;

  const somenteLeitura = !editando;
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const buscarCep = async () => {
    const cepLimpo = form.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) { setErroCep("CEP deve ter 8 dígitos."); return; }
    setBuscandoCep(true);
    setErroCep("");
    try {
      const res   = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
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

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await onSalvar(form);
      setEditando(false);
    } catch {
      // mantém editável se der erro
    }
  };

  const titulo = fornecedorSelecionado
    ? (editando ? "Editar Fornecedor" : "Detalhes do Fornecedor")
    : "Novo Fornecedor";

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Cabeçalho */}
        <div className="modal__header">
          <h2 className="modal__titulo">{titulo}</h2>
          <button className="modal__fechar" onClick={onFechar}>×</button>
        </div>

        <form onSubmit={handleSalvar}>

          {/* Linha 1: Nome + CNPJ */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Nome da empresa <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Nome da empresa"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                readOnly={somenteLeitura}
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
                readOnly={somenteLeitura}
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
                readOnly={somenteLeitura}
              />
            </div>
            <div className="modal__field">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                readOnly={somenteLeitura}
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
                  readOnly={somenteLeitura}
                />
                {!somenteLeitura && (
                  <button
                    type="button"
                    className="btn-buscar-cep"
                    onClick={buscarCep}
                    disabled={buscandoCep}
                  >
                    {buscandoCep ? "..." : "Buscar"}
                  </button>
                )}
              </div>
              {erroCep && <span className="erro-cep">{erroCep}</span>}
            </div>
            <div className="modal__field">
              <label>Estado</label>
              {somenteLeitura ? (
                <input type="text" value={form.estado} readOnly />
              ) : (
                <select value={form.estado} onChange={(e) => set("estado", e.target.value)}>
                  <option value="">UF</option>
                  {ESTADOS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="modal__field">
              <label>Complemento</label>
              <input
                type="text"
                placeholder="Apto, Sala, etc..."
                value={form.complemento}
                onChange={(e) => set("complemento", e.target.value)}
                readOnly={somenteLeitura}
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
                readOnly={somenteLeitura}
              />
            </div>
            <div className="modal__field">
              <label>Número</label>
              <input
                type="text"
                placeholder="Ex: 123"
                value={form.numero}
                onChange={(e) => set("numero", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
            <div className="modal__field">
              <label>Bairro</label>
              <input
                type="text"
                placeholder="Nome do Bairro"
                value={form.bairro}
                onChange={(e) => set("bairro", e.target.value)}
                readOnly={somenteLeitura}
              />
            </div>
          </div>

          {/* Rodapé */}
          <div className="modal__footer">
            <button type="button" className="btn-cancelar" onClick={onFechar}>
              Cancelar
            </button>

            {/* Novo cadastro: só botão Cadastrar */}
            {!fornecedorSelecionado && (
              <button type="submit" className="btn-salvar">
                Cadastrar
              </button>
            )}

            {/* Visualizando: botão Editar */}
            {fornecedorSelecionado && !editando && (
              <button
                type="button"
                className="btn-editar-modal"
                onClick={() => setEditando(true)}
              >
                <img src="./icons/pencil-svgrepo-com.svg" alt="" className="icon icon-btn-editar" />
                Editar
              </button>
            )}

            {/* Editando registro existente: botão Salvar */}
            {fornecedorSelecionado && editando && (
              <button type="submit" className="btn-salvar">
                Salvar alterações
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default FornecedorModal;