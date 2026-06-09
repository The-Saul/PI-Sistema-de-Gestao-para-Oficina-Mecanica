// ============================================================
// CodeMec — components/Header.jsx
// ============================================================
function Header({ title, subtitle, action }) {

  // Lê o usuário logado do localStorage
  const usuarioRaw = localStorage.getItem("usuario");
  const usuario    = usuarioRaw ? JSON.parse(usuarioRaw) : null;

  // Determina o cargo: se o campo "usuario" for um email
  // de admin ou o nome for "Administrador", exibe Admin
  const cargo = usuario
    ? (usuario.nome === "Administrador" || usuario.usuario?.includes("admin")
        ? "Admin"
        : "Funcionário")
    : null;

  return (
    <header className="header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="header-right">
        {action && <div>{action}</div>}

        {usuario && (
          <div className="header-usuario">
            <div className="header-usuario-avatar">
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            <div className="header-usuario-info">
              <span className="header-usuario-nome">
                {usuario.nome}
              </span>
              <span className="header-usuario-cargo">
                {cargo}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;