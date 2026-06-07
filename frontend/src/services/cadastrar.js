const API =
  "http://localhost/pi/backend/api/cadastrar";

async function request(url, body) {

  const response = await fetch(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.message ||
      "Erro na requisição"
    );

  }

  return data;

}

export function cadastrar(
  nome,
  email,
  senha
) {

  return request(
    `${API}/cadastro.php`,
    {
      nome,
      email,
      senha,
    }
  );

}

export function enviarCodigo(
  email
) {

  return request(
    `${API}/enviar-codigo.php`,
    {
      email,
    }
  );

}

export function redefinirSenha(
  email,
  codigo,
  senha
) {

  return request(
    `${API}/redefinir-senha.php`,
    {
      email,
      codigo,
      senha,
    }
  );

}