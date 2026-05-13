import { useState, useEffect } from "react";

const FORM_VAZIO = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  cep: "",
  estado: "",
  complemento: "",
  rua: "",
  numero: "",
  bairro: "",
  placaCarro: "",
  marcaCarro: "",
  modeloCarro: "",
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

function ClienteModal({ aberto, onFechar, onSalvar, clienteSelecionado }) {
  const [form, setForm]               = useState(FORM_VAZIO);
  const [editando, setEditando]       = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep]         = useState("");

  useEffect(() => {
    if (!aberto) return;
    if (clienteSelecionado) {
      setForm(clienteSelecionado);
      setEditando(false); // abre sempre em visualização
    } else {
      setForm(FORM_VAZIO);
      setEditando(true);  // novo cadastro já começa editável
    }
    setErroCep("");
  }, [clienteSelecionado, aberto]);

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
    setEditando(false); // só trava se salvou com sucesso
  } catch {
    // se deu erro, mantém o form editável — o alert já foi
    // disparado pelo Clientes.jsx
  }
};

  const titulo = clienteSelecionado
    ? (editando ? "Editar Cliente" : "Detalhes do Cliente")
    : "Novo Cliente";

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Cabeçalho */}
        <div className="modal__header">
          <h2 className="modal__titulo">{titulo}</h2>
          <button className="modal__fechar" onClick={onFechar}>×</button>
        </div>

        <form onSubmit={handleSalvar}>

          {/* Linha 1: Nome + CPF */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Nome do Cliente <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Nome do cliente"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                readOnly={somenteLeitura}
                required
              />
            </div>
            <div className="modal__field">
              <label>CPF <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => set("cpf", e.target.value)}
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

          {/* Separador carro */}
          <p className="modal__secao">Carro do Cliente</p>

          {/* Linha 5: Placa + Marca + Modelo */}
          <div className="modal__row modal__row--3">
            <div className="modal__field">
              <label>Placa do Carro <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Ex: RIO2A18"
                value={form.placaCarro}
                onChange={(e) => set("placaCarro", e.target.value.toUpperCase())}
                readOnly={somenteLeitura}
                required
              />
            </div>
            <div className="modal__field">
              <label>Marca do Carro <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Ex: Toyota"
                value={form.marcaCarro}
                onChange={(e) => set("marcaCarro", e.target.value)}
                readOnly={somenteLeitura}
                required
              />
            </div>
            <div className="modal__field">
              <label>Modelo do Carro <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Ex: Corolla"
                value={form.modeloCarro}
                onChange={(e) => set("modeloCarro", e.target.value)}
                readOnly={somenteLeitura}
                required
              />
            </div>
          </div>

          {/* Rodapé */}
          <div className="modal__footer">
            <button type="button" className="btn-cancelar" onClick={onFechar}>
              Cancelar
            </button>

            {/* Novo cadastro */}
            {!clienteSelecionado && (
              <button type="submit" className="btn-salvar">
                Cadastrar
              </button>
            )}

            {/* Visualizando: botão Editar */}
            {clienteSelecionado && !editando && (
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
            {clienteSelecionado && editando && (
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

export default ClienteModal;