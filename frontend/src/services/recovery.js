const API = "http://localhost/PI/backend/api/cadastrar";

async function request(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data;
}

// 🔐 envia código
export function enviarCodigo(email) {
  return request(`${API}/enviar-codigo.php`, { email });
}

// 🔐 redefine senha
export function redefinirSenha(email, codigo, senha) {
  return request(`${API}/redefinir-senha.php`, {
    email,
    codigo,
    senha,
  });
}