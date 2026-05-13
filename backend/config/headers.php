<?php

// ============================================================
// CodeMec — Headers globais (CORS + JSON)
// Inclua este arquivo no topo de todos os endpoints da API
// ============================================================

// Permite requisições vindas do React em desenvolvimento
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Preflight request do navegador (OPTIONS) — responde vazio e encerra
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}