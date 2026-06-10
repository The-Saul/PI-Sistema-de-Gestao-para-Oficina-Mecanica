const API = "http://localhost/PI/backend/api/cadastrar";

export function cadastrar(nome, usuario, senha, cargo) {
  return fetch(`${API}/cadastro.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      usuario,
      senha,
      cargo
    }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  });
}