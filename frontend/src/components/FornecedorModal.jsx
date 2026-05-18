import { useState, useEffect } from "react";
import { mascaraTelefone, mascaraCNPJ, validarCNPJ } from "../services/validacoes";

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
  cidade: "",
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

function FornecedorModal({ aberto, onFechar, onSalvar, fornecedorSelecionado }) {
  const [form, setForm]               = useState(FORM_VAZIO);
  const [editando, setEditando]       = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep]         = useState("");
  const [erroCnpj, setErroCnpj]       = useState("");
  const [erroTelefone, setErroTelefone] = useState("");

  useEffect(() => {
    if (!aberto) return;
    if (fornecedorSelecionado) {
      setForm({
        ...FORM_VAZIO,
        ...fornecedorSelecionado,
        cnpj:     mascaraCNPJ(fornecedorSelecionado.cnpj     ?? ""),
        telefone: mascaraTelefone(fornecedorSelecionado.telefone ?? ""),
      });
      setEditando(false);
    } else {
      setForm(FORM_VAZIO);
      setEditando(true);
    }
    setErroCep("");
    setErroCnpj("");
    setErroTelefone("");
  }, [fornecedorSelecionado, aberto]);

  if (!aberto) return null;

  const somenteLeitura = !editando;
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const handleCnpj = (e) => {
    set("cnpj", mascaraCNPJ(e.target.value));
    if (erroCnpj) setErroCnpj("");
  };

  const handleTelefone = (e) => {
    set("telefone", mascaraTelefone(e.target.value));
    if (erroTelefone) setErroTelefone("");
  };

  const validarCampoCnpj = () => {
    const digits = form.cnpj.replace(/\D/g, "");
    if (digits === "") return;
    if (!validarCNPJ(form.cnpj)) setErroCnpj("CNPJ inválido. Verifique os dígitos.");
  };

  const validarCampoTelefone = () => {
    const digits = form.telefone.replace(/\D/g, "");
    if (digits === "") return;
    if (digits.length < 10) setErroTelefone("Telefone incompleto. Use (00) 00000-0000.");
  };

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
          rua:         dados.logradouro  || "",
          bairro:      dados.bairro      || "",
          cidade:      dados.localidade  || "",
          estado:      dados.uf          || "",
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
    const digits = form.cnpj.replace(/\D/g, "");
    if (digits !== "" && !validarCNPJ(form.cnpj)) {
      setErroCnpj("CNPJ inválido. Verifique os dígitos.");
      return;
    }
    const telDigits = form.telefone.replace(/\D/g, "");
    if (telDigits !== "" && telDigits.length < 10) {
      setErroTelefone("Telefone incompleto. Use (00) 00000-0000.");
      return;
    }
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

        <div className="modal__header">
          <h2 className="modal__titulo">{titulo}</h2>
          <button className="modal__fechar" onClick={onFechar}>×</button>
        </div>

        <form onSubmit={handleSalvar}>

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
              <label>CNPJ</label>
              <input
                type="text"
                placeholder="00.000.000/0000-00"
                value={form.cnpj}
                onChange={handleCnpj}
                onBlur={validarCampoCnpj}
                readOnly={somenteLeitura}
                maxLength={18}
              />
              {erroCnpj && <span className="erro-cep">{erroCnpj}</span>}
            </div>
          </div>

          <div className="modal__row">
            <div className="modal__field">
              <label>Telefone</label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={handleTelefone}
                onBlur={validarCampoTelefone}
                readOnly={somenteLeitura}
                maxLength={15}
              />
              {erroTelefone && <span className="erro-cep">{erroTelefone}</span>}
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

          <p className="modal__secao">Endereço</p>

          <div className="modal__row modal__row--3">
            <div className="modal__field">
              <label>CEP</label>
              <div className="input-cep">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={form.cep}
                  maxLength={9}
                  onChange={(e) => set("cep", e.target.value)}
                  readOnly={somenteLeitura}
                />
                {!somenteLeitura && (
                  <button type="button" className="btn-buscar-cep" onClick={buscarCep} disabled={buscandoCep}>
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
                  {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              )}
            </div>
            <div className="modal__field">
              <label>Complemento</label>
              <input type="text" placeholder="Apto, Sala, etc..." value={form.complemento}
                onChange={(e) => set("complemento", e.target.value)} readOnly={somenteLeitura} />
            </div>
          </div>

          <div className="modal__row modal__row--3">
            <div className="modal__field">
              <label>Rua / Logradouro</label>
              <input type="text" placeholder="Nome da rua" value={form.rua}
                onChange={(e) => set("rua", e.target.value)} readOnly={somenteLeitura} />
            </div>
            <div className="modal__field">
              <label>Número</label>
              <input type="text" placeholder="Ex: 123" value={form.numero}
                onChange={(e) => set("numero", e.target.value)} readOnly={somenteLeitura} />
            </div>
            <div className="modal__field">
              <label>Bairro</label>
              <input type="text" placeholder="Nome do Bairro" value={form.bairro}
                onChange={(e) => set("bairro", e.target.value)} readOnly={somenteLeitura} />
            </div>
          </div>

          <div className="modal__footer">
            <button type="button" className="btn-cancelar" onClick={onFechar}>Cancelar</button>

            {!fornecedorSelecionado && (
              <button type="submit" className="btn-salvar">Cadastrar</button>
            )}
            {fornecedorSelecionado && !editando && (
              <button type="button" className="btn-editar-modal" onClick={() => setEditando(true)}>
                <img src="./icons/pencil-svgrepo-com.svg" alt="" className="icon icon-btn-editar" />
                Editar
              </button>
            )}
            {fornecedorSelecionado && editando && (
              <button type="submit" className="btn-salvar">Salvar alterações</button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default FornecedorModal;