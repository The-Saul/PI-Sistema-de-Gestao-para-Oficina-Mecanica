import { useState, useEffect } from "react";

const FORM_VAZIO = {
  nome:    "",
  usuario: "",
  cargo:   "funcionario",
  senha:   "",
};

function UsuarioModal({ aberto, onFechar, onSalvar, usuarioSelecionado }) {
  const [form,     setForm]     = useState(FORM_VAZIO);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    if (usuarioSelecionado) {
      setForm({
        nome:    usuarioSelecionado.nome    ?? "",
        usuario: usuarioSelecionado.usuario ?? "",
        cargo:   usuarioSelecionado.cargo   ?? "funcionario",
        senha:   "",
      });
      setEditando(false);
    } else {
      setForm(FORM_VAZIO);
      setEditando(true);
    }
  }, [usuarioSelecionado, aberto]);

  if (!aberto) return null;

  const somenteLeitura = !editando;
  const set = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.usuario) { alert("Nome e e-mail são obrigatórios."); return; }
    if (!usuarioSelecionado && !form.senha) { alert("A senha é obrigatória para novo funcionário."); return; }
    if (form.senha && form.senha.length < 6) { alert("A senha deve ter pelo menos 6 caracteres."); return; }
    try {
      await onSalvar(form);
      setEditando(false);
    } catch {
      // mantém editável se der erro
    }
  };

  const labelCargo = {
    admin:             "Admin",
    funcionario_admin: "Funcionário Administrador",
    funcionario:       "Funcionário Comum",
  };

  const titulo = usuarioSelecionado
    ? (editando ? "Editar Funcionário" : "Detalhes do Funcionário")
    : "Novo Funcionário";

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modal__header">
          <h2 className="modal__titulo">{titulo}</h2>
          <button className="modal__fechar" onClick={onFechar}>×</button>
        </div>

        <form onSubmit={handleSalvar}>

          {/* Nome e E-mail */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Nome completo <span className="obrigatorio">*</span></label>
              <input
                type="text"
                placeholder="Nome do funcionário"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                readOnly={somenteLeitura}
                required
              />
            </div>
            <div className="modal__field">
              <label>E-mail (usado para login) <span className="obrigatorio">*</span></label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={form.usuario}
                onChange={(e) => set("usuario", e.target.value)}
                readOnly={somenteLeitura}
                required
              />
            </div>
          </div>

          {/* Cargo */}
          <div className="modal__row">
            <div className="modal__field">
              <label>Cargo</label>
              {somenteLeitura ? (
                <input
                  type="text"
                  value={labelCargo[form.cargo] ?? form.cargo}
                  readOnly
                />
              ) : (
                <select value={form.cargo} onChange={(e) => set("cargo", e.target.value)}>
                  <option value="funcionario">Funcionário Comum</option>
                  <option value="funcionario_admin">Funcionário Administrador</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            </div>

            {/* Senha — só aparece no modo edição */}
            {editando && (
              <div className="modal__field">
                <label>
                  {usuarioSelecionado
                    ? "Nova senha (deixe em branco para não alterar)"
                    : "Senha *"}
                </label>
                <input
                  type="password"
                  placeholder={usuarioSelecionado ? "Digite apenas se quiser alterar" : "Mínimo 6 caracteres"}
                  value={form.senha}
                  onChange={(e) => set("senha", e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="modal__footer">
            <button type="button" className="btn-cancelar" onClick={onFechar}>Cancelar</button>

            {/* Novo funcionário */}
            {!usuarioSelecionado && (
              <button type="submit" className="btn-salvar">Cadastrar</button>
            )}

            {/* Ver detalhes — botão editar com lápis */}
            {usuarioSelecionado && !editando && (
              <button type="button" className="btn-editar-modal" onClick={() => setEditando(true)}>
                <img src="./icons/pencil-svgrepo-com.svg" alt="" className="icon icon-btn-editar" />
                Editar
              </button>
            )}

            {/* Modo edição — salvar */}
            {usuarioSelecionado && editando && (
              <button type="submit" className="btn-salvar">Salvar alterações</button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}

export default UsuarioModal;