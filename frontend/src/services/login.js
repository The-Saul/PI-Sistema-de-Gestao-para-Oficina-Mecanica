export async function login(usuario, senha) {
  const response = await fetch(
    "http://localhost/pi/backend/api/login/login.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario,
        senha,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro ao realizar login");
  }

  return data;
}