-- 1. USUÁRIOS (autenticação do sistema)

CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150)        NOT NULL,
    usuario     VARCHAR(80)         NOT NULL UNIQUE,
    senha_hash  VARCHAR(255)        NOT NULL,   -- bcrypt sempre
    ativo       BOOLEAN             NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. CLIENTES
-- ============================================================
CREATE TABLE clientes (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150)        NOT NULL,
    cpf         CHAR(11)            UNIQUE,                 -- somente dígitos
    telefone    VARCHAR(20),
    email       VARCHAR(150),

    -- Endereço
    cep         CHAR(8),
    rua         VARCHAR(200),
    numero      VARCHAR(20),
    bairro      VARCHAR(100),
    cidade      VARCHAR(100),
    estado      CHAR(2),
    complemento VARCHAR(150),

    -- Veículo vinculado ao cliente
    veiculo_placa  VARCHAR(10),
    veiculo_marca  VARCHAR(80),
    veiculo_modelo VARCHAR(80),

    criado_em   TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. FORNECEDORES
-- ============================================================
CREATE TABLE fornecedores (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150)        NOT NULL,
    cnpj        CHAR(14)            UNIQUE,                 -- somente dígitos
    telefone    VARCHAR(20),
    email       VARCHAR(150),

    -- Endereço
    cep         CHAR(8),
    rua         VARCHAR(200),
    numero      VARCHAR(20),
    bairro      VARCHAR(100),
    cidade      VARCHAR(100),
    estado      CHAR(2),
    complemento VARCHAR(150),

    criado_em   TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. PRODUTOS / ESTOQUE
-- ============================================================
CREATE TABLE produtos (
    id                  SERIAL PRIMARY KEY,
    codigo              VARCHAR(50)         UNIQUE,         -- código interno/SKU
    nome                VARCHAR(150)        NOT NULL,
    descricao           TEXT,
    fornecedor_id       INT                 REFERENCES fornecedores(id) ON DELETE SET NULL,
    unidade             VARCHAR(20)         NOT NULL DEFAULT 'un', -- un, kg, L, m, etc.
    preco_compra        NUMERIC(12,2)       NOT NULL DEFAULT 0,
    preco_venda         NUMERIC(12,2)       NOT NULL DEFAULT 0,
    quantidade_atual    NUMERIC(12,3)       NOT NULL DEFAULT 0,
    quantidade_minima   NUMERIC(12,3)       NOT NULL DEFAULT 0,  -- alerta de estoque baixo
    observacao          TEXT,
    criado_em           TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. MOVIMENTAÇÕES DE ESTOQUE
-- ============================================================
CREATE TABLE movimentacoes_estoque (
    id              SERIAL PRIMARY KEY,
    produto_id      INT             NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    usuario_id      INT             REFERENCES usuarios(id) ON DELETE SET NULL, -- funcionário responsável
    tipo            VARCHAR(10)     NOT NULL CHECK (tipo IN ('entrada','saida')),
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    motivo          VARCHAR(255),                           -- compra, venda, OS, ajuste, etc.
    -- Referência opcional (para rastreabilidade)
    referencia_tipo VARCHAR(20),                            -- 'venda', 'os', 'compra', 'ajuste'
    referencia_id   INT,
    data_mov        DATE            NOT NULL DEFAULT CURRENT_DATE,
    observacao      TEXT,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. VENDAS (cabeçalho)
-- ============================================================
CREATE TABLE vendas (
    id              SERIAL PRIMARY KEY,
    cliente_id      INT             REFERENCES clientes(id) ON DELETE SET NULL,
    usuario_id      INT             REFERENCES usuarios(id) ON DELETE SET NULL, -- funcionário que realizou
    total           NUMERIC(12,2)   NOT NULL DEFAULT 0,
    observacao      TEXT,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. ITENS DAS VENDAS
-- ============================================================
CREATE TABLE itens_venda (
    id              SERIAL PRIMARY KEY,
    venda_id        INT             NOT NULL REFERENCES vendas(id) ON DELETE CASCADE,
    produto_id      INT             NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    preco_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

-- ============================================================
-- 8. ORDENS DE SERVIÇO (cabeçalho)
-- ============================================================
CREATE TABLE ordens_servico (
    id                  SERIAL PRIMARY KEY,
    cliente_id          INT             REFERENCES clientes(id) ON DELETE SET NULL,
    usuario_id          INT             REFERENCES usuarios(id) ON DELETE SET NULL, -- funcionário responsável

    -- Veículo da OS (pode ser diferente do veículo cadastrado no cliente)
    veiculo_placa       VARCHAR(10),
    veiculo_marca       VARCHAR(80),
    veiculo_modelo      VARCHAR(80),

    descricao_problema  TEXT,
    servicos_realizados TEXT,

    valor_servico       NUMERIC(12,2)   NOT NULL DEFAULT 0,
    valor_pecas         NUMERIC(12,2)   NOT NULL DEFAULT 0,
    valor_total         NUMERIC(12,2)   GENERATED ALWAYS AS (valor_servico + valor_pecas) STORED,

    status              VARCHAR(20)     NOT NULL DEFAULT 'aberta'
                            CHECK (status IN ('aberta','em_andamento','concluida','cancelada')),

    criado_em           TIMESTAMP       NOT NULL DEFAULT NOW(),
    concluida_em        TIMESTAMP
);

-- ============================================================
-- 9. PEÇAS USADAS NA ORDEM DE SERVIÇO
-- ============================================================
CREATE TABLE itens_os (
    id              SERIAL PRIMARY KEY,
    os_id           INT             NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
    produto_id      INT             NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    preco_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

-- ============================================================
-- 10. COMPRAS DE ESTOQUE (entrada de mercadoria do fornecedor)
-- ============================================================
CREATE TABLE compras (
    id              SERIAL PRIMARY KEY,
    fornecedor_id   INT             REFERENCES fornecedores(id) ON DELETE SET NULL,
    usuario_id      INT             REFERENCES usuarios(id) ON DELETE SET NULL,
    total           NUMERIC(12,2)   NOT NULL DEFAULT 0,
    observacao      TEXT,
    data_compra     DATE            NOT NULL DEFAULT CURRENT_DATE,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE itens_compra (
    id              SERIAL PRIMARY KEY,
    compra_id       INT             NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
    produto_id      INT             NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    preco_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

-- ============================================================
-- 11. FINANCEIRO (lançamentos de entrada e saída)
-- ============================================================
CREATE TABLE financeiro (
    id                  SERIAL PRIMARY KEY,
    tipo                VARCHAR(10)     NOT NULL CHECK (tipo IN ('entrada','saida')),
    descricao           VARCHAR(255)    NOT NULL,
    valor               NUMERIC(12,2)   NOT NULL CHECK (valor > 0),

    -- Rastreabilidade da origem do lançamento
    referencia_tipo     VARCHAR(20)     CHECK (referencia_tipo IN ('venda','os','compra','ajuste')),
    referencia_id       INT,            -- id da venda, os ou compra correspondente

    -- Partes envolvidas (opcionais, para facilitar relatórios)
    cliente_id          INT             REFERENCES clientes(id) ON DELETE SET NULL,
    fornecedor_id       INT             REFERENCES fornecedores(id) ON DELETE SET NULL,
    usuario_id          INT             REFERENCES usuarios(id) ON DELETE SET NULL,

    criado_em           TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES (para acelerar consultas frequentes)
-- ============================================================
CREATE INDEX idx_clientes_cpf             ON clientes(cpf);
CREATE INDEX idx_clientes_nome            ON clientes(nome);
CREATE INDEX idx_fornecedores_cnpj        ON fornecedores(cnpj);
CREATE INDEX idx_produtos_codigo          ON produtos(codigo);
CREATE INDEX idx_produtos_fornecedor      ON produtos(fornecedor_id);
CREATE INDEX idx_movest_produto           ON movimentacoes_estoque(produto_id);
CREATE INDEX idx_movest_referencia        ON movimentacoes_estoque(referencia_tipo, referencia_id);
CREATE INDEX idx_vendas_cliente           ON vendas(cliente_id);
CREATE INDEX idx_vendas_criado_em         ON vendas(criado_em);
CREATE INDEX idx_itens_venda_venda        ON itens_venda(venda_id);
CREATE INDEX idx_itens_venda_produto      ON itens_venda(produto_id);
CREATE INDEX idx_os_cliente               ON ordens_servico(cliente_id);
CREATE INDEX idx_os_status                ON ordens_servico(status);
CREATE INDEX idx_os_criado_em             ON ordens_servico(criado_em);
CREATE INDEX idx_itens_os_os              ON itens_os(os_id);
CREATE INDEX idx_itens_os_produto         ON itens_os(produto_id);
CREATE INDEX idx_compras_fornecedor       ON compras(fornecedor_id);
CREATE INDEX idx_financeiro_tipo          ON financeiro(tipo);
CREATE INDEX idx_financeiro_referencia    ON financeiro(referencia_tipo, referencia_id);
CREATE INDEX idx_financeiro_criado_em     ON financeiro(criado_em);

-- ============================================================
-- VIEWS PARA O DASHBOARD
-- ============================================================

-- Estoque abaixo do mínimo
CREATE VIEW vw_estoque_critico AS
SELECT
    p.id,
    p.codigo,
    p.nome,
    p.quantidade_atual,
    p.quantidade_minima,
    p.unidade,
    f.nome AS fornecedor
FROM produtos p
LEFT JOIN fornecedores f ON f.id = p.fornecedor_id
WHERE p.quantidade_atual <= p.quantidade_minima;

-- Resumo financeiro do mês atual
CREATE VIEW vw_financeiro_mes AS
SELECT
    tipo,
    SUM(valor) AS total
FROM financeiro
WHERE DATE_TRUNC('month', criado_em) = DATE_TRUNC('month', NOW())
GROUP BY tipo;

-- Resumo de OS por status
CREATE VIEW vw_os_por_status AS
SELECT
    status,
    COUNT(*) AS quantidade
FROM ordens_servico
GROUP BY status;

-- Vendas do mês atual
CREATE VIEW vw_vendas_mes AS
SELECT
    COUNT(*)    AS quantidade_vendas,
    SUM(total)  AS total_vendas
FROM vendas
WHERE DATE_TRUNC('month', criado_em) = DATE_TRUNC('month', NOW());

-- ============================================================
-- DADOS INICIAIS — Usuário administrador
-- (senha: admin123 com hash bcrypt cost=12)
-- ============================================================
INSERT INTO usuarios (nome, usuario, senha_hash) VALUES
(
    'Administrador',
    'admin',
    -- Hash bcrypt de 'admin123' — SUBSTITUA por um hash gerado na aplicação PHP
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- ============================================================
-- DADOS DE EXEMPLO — Fornecedores
-- ============================================================
INSERT INTO fornecedores (nome, cnpj, telefone, email, cep, rua, numero, bairro, cidade, estado) VALUES
('Auto Peças Brasil Ltda',   '12345678000195', '(11) 3333-1111', 'contato@autopecasbrasil.com.br', '01310100', 'Avenida Paulista', '1000', 'Bela Vista',     'São Paulo',     'SP'),
('Distribuidora Norte Peças','98765432000188', '(85) 3333-2222', 'vendas@nortepeças.com.br',       '60110001', 'Rua Major Facundo', '500', 'Centro',         'Fortaleza',     'CE'),
('Lubrin Lubrificantes ME',  '11223344000100', '(62) 3333-3333', 'lubrificantes@lubrin.com.br',    '74110010', 'Rua 44',           '200', 'Setor Central',  'Goiânia',       'GO');

-- ============================================================
-- DADOS DE EXEMPLO — Clientes
-- ============================================================
INSERT INTO clientes (nome, cpf, telefone, email, cep, rua, numero, bairro, cidade, estado, veiculo_placa, veiculo_marca, veiculo_modelo) VALUES
('Carlos Eduardo Souza',  '12345678901', '(88) 99801-1111', 'carlos.souza@email.com',  '63500000', 'Rua Coronel Antônio Filgueira', '123', 'Centro',     'Iguatu',  'CE', 'ABC1D23', 'Chevrolet', 'Onix 1.0'),
('Maria Fernanda Lima',   '98765432100', '(88) 99802-2222', 'maria.lima@email.com',    '63500100', 'Rua Floriano Peixoto',          '456', 'São José',   'Iguatu',  'CE', 'XYZ2E34', 'Volkswagen','Gol 1.6'),
('João Pedro Alves',      '11122233344', '(88) 99803-3333', 'joao.alves@email.com',    '63500200', 'Avenida Leão Sampaio',          '789', 'Novo Iguatu', 'Iguatu', 'CE', 'DEF3F45', 'Ford',      'Ka 1.0');

-- ============================================================
-- DADOS DE EXEMPLO — Produtos
-- ============================================================
INSERT INTO produtos (codigo, nome, descricao, fornecedor_id, unidade, preco_compra, preco_venda, quantidade_atual, quantidade_minima) VALUES
('FLO-001', 'Filtro de Óleo Universal',       'Filtro de óleo compatível com motores 1.0 a 2.0',      1, 'un',  18.50,  35.00, 25,  5),
('FLA-002', 'Filtro de Ar Esportivo',          'Alta filtragem, lavável e reutilizável',               1, 'un',  32.00,  65.00, 15,  3),
('OLE-003', 'Óleo Motor 5W30 Sintético 1L',   'Óleo sintético de alta performance',                   3, 'L',   22.00,  45.00, 40,  10),
('VEL-004', 'Vela de Ignição NGK BKR5E',      'Vela de ignição para motores gasolina',                1, 'un',   8.50,  18.00, 60,  10),
('PAS-005', 'Pastilha de Freio Dianteira',     'Kit com 4 pastilhas para eixo dianteiro',              2, 'un',  45.00,  90.00,  8,   4),
('LIQ-006', 'Líquido de Arrefecimento 1L',    'Aditivo para radiador, concentrado',                   3, 'L',   12.00,  25.00, 20,   5),
('COR-007', 'Correia Dentada Kit',             'Kit correia + tensor + polia',                         2, 'un',  85.00, 170.00,  5,   2),
('BAT-008', 'Bateria 60Ah',                   'Bateria selada livre de manutenção',                   2, 'un', 280.00, 480.00,  3,   1);

-- ============================================================
-- DADOS DE EXEMPLO — Compra de estoque
-- (gera movimentação de entrada e lançamento financeiro)
-- ============================================================
INSERT INTO compras (fornecedor_id, usuario_id, total, observacao, data_compra) VALUES
(1, 1, 370.00, 'Primeira compra de peças para estoque inicial', CURRENT_DATE - INTERVAL '10 days');

INSERT INTO itens_compra (compra_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 10, 18.50),   -- 10x Filtro de Óleo
(1, 2,  5, 32.00),   -- 5x  Filtro de Ar
(1, 4, 20,  8.50);   -- 20x Vela de Ignição

-- Movimentação de entrada correspondente à compra
INSERT INTO movimentacoes_estoque (produto_id, usuario_id, tipo, quantidade, motivo, referencia_tipo, referencia_id, data_mov) VALUES
(1, 1, 'entrada', 10, 'Compra fornecedor - Auto Peças Brasil', 'compra', 1, CURRENT_DATE - INTERVAL '10 days'),
(2, 1, 'entrada',  5, 'Compra fornecedor - Auto Peças Brasil', 'compra', 1, CURRENT_DATE - INTERVAL '10 days'),
(4, 1, 'entrada', 20, 'Compra fornecedor - Auto Peças Brasil', 'compra', 1, CURRENT_DATE - INTERVAL '10 days');

-- Lançamento financeiro de SAÍDA pela compra
INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id, fornecedor_id, usuario_id) VALUES
('saida', 'Compra de peças — Auto Peças Brasil Ltda', 370.00, 'compra', 1, 1, 1);

-- ============================================================
-- DADOS DE EXEMPLO — Venda de balcão
-- ============================================================
INSERT INTO vendas (cliente_id, usuario_id, total, observacao) VALUES
(1, 1, 143.00, 'Venda de balcão — pagamento à vista');

INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES
(1, 3, 2, 45.00),   -- 2x Óleo 5W30
(1, 1, 1, 35.00),   -- 1x Filtro de Óleo
(1, 4, 1, 18.00);   -- 1x Vela de Ignição

-- Baixa no estoque gerada pela venda
INSERT INTO movimentacoes_estoque (produto_id, usuario_id, tipo, quantidade, motivo, referencia_tipo, referencia_id, data_mov) VALUES
(3, 1, 'saida', 2, 'Venda #1', 'venda', 1, CURRENT_DATE),
(1, 1, 'saida', 1, 'Venda #1', 'venda', 1, CURRENT_DATE),
(4, 1, 'saida', 1, 'Venda #1', 'venda', 1, CURRENT_DATE);

-- Atualização de quantidade no estoque (reflete a venda)
UPDATE produtos SET quantidade_atual = quantidade_atual - 2 WHERE id = 3;
UPDATE produtos SET quantidade_atual = quantidade_atual - 1 WHERE id = 1;
UPDATE produtos SET quantidade_atual = quantidade_atual - 1 WHERE id = 4;

-- Lançamento financeiro de ENTRADA pela venda
INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id, cliente_id, usuario_id) VALUES
('entrada', 'Venda #1 — Carlos Eduardo Souza', 143.00, 'venda', 1, 1, 1);

-- ============================================================
-- DADOS DE EXEMPLO — Ordem de Serviço
-- ============================================================
INSERT INTO ordens_servico (cliente_id, usuario_id, veiculo_placa, veiculo_marca, veiculo_modelo,
    descricao_problema, servicos_realizados, valor_servico, valor_pecas, status) VALUES
(2, 1, 'XYZ2E34', 'Volkswagen', 'Gol 1.6',
    'Carro fazendo barulho no freio dianteiro e perdendo potência',
    'Substituição de pastilhas dianteiras e troca de velas de ignição',
    150.00, 126.00, 'concluida');

INSERT INTO itens_os (os_id, produto_id, quantidade, preco_unitario) VALUES
(1, 5, 1, 90.00),   -- 1x Pastilha de Freio
(1, 4, 4, 18.00);   -- 4x Velas de Ignição

-- Atualizar status e data de conclusão
UPDATE ordens_servico SET concluida_em = NOW() WHERE id = 1;

-- Baixa no estoque pelas peças usadas na OS
INSERT INTO movimentacoes_estoque (produto_id, usuario_id, tipo, quantidade, motivo, referencia_tipo, referencia_id, data_mov) VALUES
(5, 1, 'saida', 1, 'Peça usada em OS #1', 'os', 1, CURRENT_DATE),
(4, 1, 'saida', 4, 'Peça usada em OS #1', 'os', 1, CURRENT_DATE);

UPDATE produtos SET quantidade_atual = quantidade_atual - 1 WHERE id = 5;
UPDATE produtos SET quantidade_atual = quantidade_atual - 4 WHERE id = 4;

-- Lançamento financeiro de ENTRADA pela OS concluída
INSERT INTO financeiro (tipo, descricao, valor, referencia_tipo, referencia_id, cliente_id, usuario_id) VALUES
('entrada', 'OS #1 — Maria Fernanda Lima (Gol 1.6)', 276.00, 'os', 1, 2, 1);

-- ============================================================
-- QUERIES DE EXEMPLO PARA O DASHBOARD
-- ============================================================
-- (Execute individualmente para testar)

-- Total de clientes
-- SELECT COUNT(*) AS total_clientes FROM clientes;

-- Total de fornecedores
-- SELECT COUNT(*) AS total_fornecedores FROM fornecedores;

-- Vendas do mês atual
-- SELECT * FROM vw_vendas_mes;

-- OS por status
-- SELECT * FROM vw_os_por_status;

-- Produtos com estoque crítico
-- SELECT * FROM vw_estoque_critico;

-- Resumo financeiro do mês
-- SELECT * FROM vw_financeiro_mes;

-- Saldo financeiro geral
-- SELECT
--     SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) AS total_entradas,
--     SUM(CASE WHEN tipo = 'saida'   THEN valor ELSE 0 END) AS total_saidas,
--     SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END) AS saldo
-- FROM financeiro;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
