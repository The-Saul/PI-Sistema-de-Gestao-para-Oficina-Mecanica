// ============================================================
// CodeMec — hooks/usePermissao.js
// Retorna as permissões do usuário logado baseadas no cargo
// ============================================================

export function usePermissao() {
  const usuarioRaw = localStorage.getItem("usuario");
  const usuario    = usuarioRaw ? JSON.parse(usuarioRaw) : null;
  const cargo      = usuario?.cargo ?? "funcionario";

  // ── Níveis de acesso ──────────────────────────────────────
  const isAdmin          = cargo === "admin";
  const isFuncionarioAdmin = cargo === "funcionario_admin";

  // ── Permissões específicas ────────────────────────────────
  return {
    cargo,
    usuario,

    // Pode ver tudo — admin e funcionario_admin
    podeVerFinanceiro:     isAdmin || isFuncionarioAdmin,
    podeVerReceita:        isAdmin || isFuncionarioAdmin,
    podeAcessarControle:   isAdmin || isFuncionarioAdmin,

    // Pode excluir registros — admin e funcionario_admin
    podeExcluir:           isAdmin || isFuncionarioAdmin,

    // Pode cadastrar e editar — todos
    podeCadastrar:         true,
    podeEditar:            true,

    // Pode fazer vendas e compras — todos
    podeFazerVenda:        true,
    podeFazerCompra:       true,
  };
}