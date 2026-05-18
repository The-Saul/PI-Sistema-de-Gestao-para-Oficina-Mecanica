// ============================================================
// CodeMec — services/validacoes.js
// Máscaras e validações de CPF, CNPJ e Telefone
// ============================================================

// ─────────────────────────────────────────────────────────────
// MÁSCARAS — formatam o valor enquanto o usuário digita
// ─────────────────────────────────────────────────────────────

// (88) 99999-9999
export function mascaraTelefone(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2)  return digits.replace(/(\d{0,2})/, "($1");
  if (digits.length <= 7)  return digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

// 000.000.000-00
export function mascaraCPF(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3)  return digits;
  if (digits.length <= 6)  return digits.replace(/(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9)  return digits.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
}

// 00.000.000/0000-00
export function mascaraCNPJ(valor) {
  const digits = valor.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2)  return digits;
  if (digits.length <= 5)  return digits.replace(/(\d{2})(\d+)/, "$1.$2");
  if (digits.length <= 8)  return digits.replace(/(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
  if (digits.length <= 12) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, "$1.$2.$3/$4-$5");
}

// ─────────────────────────────────────────────────────────────
// VALIDAÇÕES — verificam os dígitos verificadores
// ─────────────────────────────────────────────────────────────

// Valida CPF pelos dois dígitos verificadores (algoritmo oficial da Receita Federal)
export function validarCPF(valor) {
  const cpf = valor.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Cálculo do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  // Cálculo do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

// Valida CNPJ pelos dois dígitos verificadores (algoritmo oficial da Receita Federal)
export function validarCNPJ(valor) {
  const cnpj = valor.replace(/\D/g, "");

  if (cnpj.length !== 14) return false;

  // Rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDigito = (cnpj, tamanho) => {
    let soma  = 0;
    let pos   = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(cnpj.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    const resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado;
  };

  if (calcDigito(cnpj, 12) !== parseInt(cnpj[12])) return false;
  if (calcDigito(cnpj, 13) !== parseInt(cnpj[13])) return false;

  return true;
}