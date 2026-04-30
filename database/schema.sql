-- =========================
-- LIMPAR (opcional)
-- =========================
DROP TABLE IF EXISTS movimentacoes_estoque;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS fornecedores;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS financeiro;
DROP TABLE IF EXISTS ordens_servico;

-- =========================
-- CLIENTES
-- =========================
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    cpf VARCHAR(14),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- FORNECEDORES
-- =========================
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    cnpj VARCHAR(18),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- PRODUTOS
-- =========================
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_compra DECIMAL(10,2),
    preco_venda DECIMAL(10,2),
    quantidade INT DEFAULT 0,
    fornecedor_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

-- =========================
-- MOVIMENTAÇÃO
-- =========================
CREATE TABLE movimentacoes_estoque (
    id SERIAL PRIMARY KEY,
    produto_id INT,
    tipo VARCHAR(10),
    quantidade INT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- =========================
-- FINANCEIRO
-- =========================
CREATE TABLE financeiro (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(10),
    descricao VARCHAR(255),
    valor DECIMAL(10,2),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ORDENS DE SERVIÇO
-- =========================
CREATE TABLE ordens_servico (
    id SERIAL PRIMARY KEY,
    cliente_id INT,
    descricao TEXT,
    status VARCHAR(20),
    valor DECIMAL(10,2),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
----------------------------------
-- Usado posteriormente no PHP: --
----------------------------------
-- DB_NAME=oficina
-- DB_USER=postgres
-- DB_PASSWORD=*****
-- DB_HOST=localhost