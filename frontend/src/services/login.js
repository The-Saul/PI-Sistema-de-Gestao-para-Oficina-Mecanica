
// ============================================================
// CodeMec - Serviço de Autenticação
// ============================================================

const API_BASE_URL =
  "http://localhost/backend/api";

export async function login(
  usuario,
  senha
) {

  const response = await fetch(
    `${API_BASE_URL}/login/login.php`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        usuario,
        senha,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Erro ao realizar login"
    );

  }

  return data;
}

export async function logout() {

  const response = await fetch(
    `${API_BASE_URL}/login/logout.php`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  return response.json();
}

export async function verificarLogin() {

  const response = await fetch(
    `${API_BASE_URL}/login/check.php`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return response.json();
}