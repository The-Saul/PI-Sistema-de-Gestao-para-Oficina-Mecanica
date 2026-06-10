<?php
require_once "../../config/cors.php";
require_once "../../config/database.php";

$conn = getConnection();

$sql = "
    SELECT
        id,
        nome,
        usuario,
        cargo,
        ativo,
        criado_em
    FROM usuarios
    ORDER BY id DESC
";

$stmt = $conn->prepare($sql);
$stmt->execute();

$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($usuarios);