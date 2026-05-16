<?php

// ============================================================
// CodeMec — Headers globais (CORS + JSON)
// Inclua este arquivo no topo de todos os endpoints da API
// ============================================================

// Permite acesso do frontend React
header("Access-Control-Allow-Origin: http://localhost:3000");

// Métodos permitidos
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Headers permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Tipo de resposta
header("Content-Type: application/json; charset=UTF-8");

// Responde requisições OPTIONS (preflight do navegador)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(204);

    exit();
}