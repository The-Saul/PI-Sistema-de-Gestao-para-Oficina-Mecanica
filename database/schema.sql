-- ============================================================
-- CodeMec — Schema do Banco de Dados
-- Sistema de Gestão para Oficinas Mecânicas
-- ============================================================
-- Como usar: cole este arquivo no Query Tool do pgAdmin
-- e execute (F5). Certifique-se de estar conectado ao banco
-- correto antes de executar.
-- ============================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================
-- 1. USUÁRIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150)  NOT NULL,
    usuario     VARCHAR(80)   NOT NULL UNIQUE,
    senha_hash  VARCHAR(255)  NOT NULL,
    cargo       VARCHAR(20)   NOT NULL DEFAULT 'funcionario'
                    CHECK (cargo IN ('admin', 'funcionario_admin', 'funcionario')),
    ativo       BOOLEAN       NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. CÓDIGOS DE VERIFICAÇÃO (recuperação de senha)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.codigos_verificacao (
    id          SERIAL PRIMARY KEY,
    usuario_id  INT           NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    email       VARCHAR(150)  NOT NULL,
    codigo      VARCHAR(10)   NOT NULL,
    usado       BOOLEAN       NOT NULL DEFAULT FALSE,
    criado_em   TIMESTAMP     NOT NULL DEFAULT NOW(),
    expira_em   TIMESTAMP     NOT NULL
);

-- ============================================================
-- 3. CLIENTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.clientes (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(150)  NOT NULL,
    cpf             CHAR(11)      UNIQUE,
    telefone        VARCHAR(20),
    email           VARCHAR(150),
    cep             CHAR(8),
    rua             VARCHAR(200),
    numero          VARCHAR(20),
    bairro          VARCHAR(100),
    cidade          VARCHAR(100),
    estado          CHAR(2),
    complemento     VARCHAR(150),
    veiculo_placa   VARCHAR(10),
    veiculo_marca   VARCHAR(80),
    veiculo_modelo  VARCHAR(80),
    criado_em       TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. FORNECEDORES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.fornecedores (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150)  NOT NULL,
    cnpj        CHAR(14)      UNIQUE,
    telefone    VARCHAR(20),
    email       VARCHAR(150),
    cep         CHAR(8),
    rua         VARCHAR(200),
    numero      VARCHAR(20),
    bairro      VARCHAR(100),
    cidade      VARCHAR(100),
    estado      CHAR(2),
    complemento VARCHAR(150),
    criado_em   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. PRODUTOS / ESTOQUE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.produtos (
    id                  SERIAL PRIMARY KEY,
    codigo              VARCHAR(50)     UNIQUE,
    nome                VARCHAR(150)    NOT NULL,
    descricao           TEXT,
    fornecedor_id       INT             REFERENCES public.fornecedores(id) ON DELETE SET NULL,
    unidade             VARCHAR(20)     NOT NULL DEFAULT 'un',
    preco_compra        NUMERIC(12,2)   NOT NULL DEFAULT 0,
    preco_venda         NUMERIC(12,2)   NOT NULL DEFAULT 0,
    quantidade_atual    NUMERIC(12,3)   NOT NULL DEFAULT 0,
    quantidade_minima   NUMERIC(12,3)   NOT NULL DEFAULT 0,
    observacao          TEXT,
    criado_em           TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. MOVIMENTAÇÕES DE ESTOQUE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.movimentacoes_estoque (
    id              SERIAL PRIMARY KEY,
    produto_id      INT             NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
    usuario_id      INT             REFERENCES public.usuarios(id) ON DELETE SET NULL,
    tipo            VARCHAR(10)     NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    motivo          VARCHAR(255),
    referencia_tipo VARCHAR(20),
    referencia_id   INT,
    data_mov        DATE            NOT NULL DEFAULT CURRENT_DATE,
    observacao      TEXT,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. VENDAS (cabeçalho)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vendas (
    id          SERIAL PRIMARY KEY,
    cliente_id  INT             REFERENCES public.clientes(id) ON DELETE SET NULL,
    usuario_id  INT             REFERENCES public.usuarios(id) ON DELETE SET NULL,
    total       NUMERIC(12,2)   NOT NULL DEFAULT 0,
    observacao  TEXT,
    criado_em   TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. ITENS DAS VENDAS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.itens_venda (
    id              SERIAL PRIMARY KEY,
    venda_id        INT             NOT NULL REFERENCES public.vendas(id) ON DELETE CASCADE,
    produto_id      INT             NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    preco_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

-- ============================================================
-- 9. ORDENS DE SERVIÇO (cabeçalho)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ordens_servico (
    id                  SERIAL PRIMARY KEY,
    cliente_id          INT             REFERENCES public.clientes(id) ON DELETE SET NULL,
    usuario_id          INT             REFERENCES public.usuarios(id) ON DELETE SET NULL,
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
-- 9.1. SERVIÇOS DA ORDEM DE SERVIÇO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.itens_servico_os (
    id          SERIAL PRIMARY KEY,
    os_id       INT             NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
    descricao   VARCHAR(255)    NOT NULL,
    valor       NUMERIC(12,2)   NOT NULL CHECK (valor > 0)
);

-- ============================================================
-- 10. PEÇAS USADAS NA ORDEM DE SERVIÇO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.itens_os (
    id              SERIAL PRIMARY KEY,
    os_id           INT             NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
    produto_id      INT             NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    preco_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

-- ============================================================
-- 11. COMPRAS DE ESTOQUE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.compras (
    id              SERIAL PRIMARY KEY,
    fornecedor_id   INT             REFERENCES public.fornecedores(id) ON DELETE SET NULL,
    usuario_id      INT             REFERENCES public.usuarios(id) ON DELETE SET NULL,
    total           NUMERIC(12,2)   NOT NULL DEFAULT 0,
    observacao      TEXT,
    data_compra     DATE            NOT NULL DEFAULT CURRENT_DATE,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.itens_compra (
    id              SERIAL PRIMARY KEY,
    compra_id       INT             NOT NULL REFERENCES public.compras(id) ON DELETE CASCADE,
    produto_id      INT             NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
    quantidade      NUMERIC(12,3)   NOT NULL CHECK (quantidade > 0),
    preco_unitario  NUMERIC(12,2)   NOT NULL,
    subtotal        NUMERIC(12,2)   GENERATED ALWAYS AS (quantidade * preco_unitario) STORED
);

-- ============================================================
-- 12. FINANCEIRO
-- ============================================================
CREATE TABLE IF NOT EXISTS public.financeiro (
    id              SERIAL PRIMARY KEY,
    tipo            VARCHAR(10)     NOT NULL CHECK (tipo IN ('entrada','saida')),
    descricao       VARCHAR(255)    NOT NULL,
    valor           NUMERIC(12,2)   NOT NULL CHECK (valor > 0),
    referencia_tipo VARCHAR(20)     CHECK (referencia_tipo IN ('venda','os','compra','ajuste')),
    referencia_id   INT,
    cliente_id      INT             REFERENCES public.clientes(id) ON DELETE SET NULL,
    fornecedor_id   INT             REFERENCES public.fornecedores(id) ON DELETE SET NULL,
    usuario_id      INT             REFERENCES public.usuarios(id) ON DELETE SET NULL,
    criado_em       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_clientes_cpf          ON public.clientes(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_nome         ON public.clientes(nome);
CREATE INDEX IF NOT EXISTS idx_fornecedores_cnpj     ON public.fornecedores(cnpj);
CREATE INDEX IF NOT EXISTS idx_produtos_codigo       ON public.produtos(codigo);
CREATE INDEX IF NOT EXISTS idx_produtos_fornecedor   ON public.produtos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_movest_produto        ON public.movimentacoes_estoque(produto_id);
CREATE INDEX IF NOT EXISTS idx_movest_referencia     ON public.movimentacoes_estoque(referencia_tipo, referencia_id);
CREATE INDEX IF NOT EXISTS idx_vendas_cliente        ON public.vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_criado_em      ON public.vendas(criado_em);
CREATE INDEX IF NOT EXISTS idx_itens_venda_venda     ON public.itens_venda(venda_id);
CREATE INDEX IF NOT EXISTS idx_itens_venda_produto   ON public.itens_venda(produto_id);
CREATE INDEX IF NOT EXISTS idx_os_cliente            ON public.ordens_servico(cliente_id);
CREATE INDEX IF NOT EXISTS idx_os_status             ON public.ordens_servico(status);
CREATE INDEX IF NOT EXISTS idx_os_criado_em          ON public.ordens_servico(criado_em);
CREATE INDEX IF NOT EXISTS idx_itens_servico_os      ON public.itens_servico_os(os_id);
CREATE INDEX IF NOT EXISTS idx_itens_os_os           ON public.itens_os(os_id);
CREATE INDEX IF NOT EXISTS idx_itens_os_produto      ON public.itens_os(produto_id);
CREATE INDEX IF NOT EXISTS idx_compras_fornecedor    ON public.compras(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_tipo       ON public.financeiro(tipo);
CREATE INDEX IF NOT EXISTS idx_financeiro_referencia ON public.financeiro(referencia_tipo, referencia_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_criado_em  ON public.financeiro(criado_em);
CREATE INDEX IF NOT EXISTS idx_codigos_email         ON public.codigos_verificacao(email);
CREATE INDEX IF NOT EXISTS idx_codigos_codigo        ON public.codigos_verificacao(codigo);
CREATE INDEX IF NOT EXISTS idx_codigos_usuario       ON public.codigos_verificacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_codigos_expiracao     ON public.codigos_verificacao(expira_em);

-- ============================================================
-- VIEWS PARA O DASHBOARD
-- ============================================================
CREATE OR REPLACE VIEW public.vw_estoque_critico AS
SELECT p.id, p.codigo, p.nome, p.quantidade_atual, p.quantidade_minima, p.unidade,
       f.nome AS fornecedor
FROM public.produtos p
LEFT JOIN public.fornecedores f ON f.id = p.fornecedor_id
WHERE p.quantidade_atual <= p.quantidade_minima;

CREATE OR REPLACE VIEW public.vw_financeiro_mes AS
SELECT tipo, SUM(valor) AS total
FROM public.financeiro
WHERE DATE_TRUNC('month', criado_em) = DATE_TRUNC('month', NOW())
GROUP BY tipo;

CREATE OR REPLACE VIEW public.vw_os_por_status AS
SELECT status, COUNT(*) AS quantidade
FROM public.ordens_servico
GROUP BY status;

CREATE OR REPLACE VIEW public.vw_vendas_mes AS
SELECT COUNT(*) AS quantidade_vendas, SUM(total) AS total_vendas
FROM public.vendas
WHERE DATE_TRUNC('month', criado_em) = DATE_TRUNC('month', NOW());

-- ============================================================
-- DADOS INICIAIS - Usuario administrador
-- senha: admin123
-- ============================================================
INSERT INTO public.usuarios (nome, usuario, senha_hash, cargo)
VALUES (
    'Administrador Master',
    'admin@gmail.com',
    '$2y$10$CNYffIiMpZwvs6J6u7AFU.usSJkCZCFWkE1blR1M.tsXvTopiFrym',
    'admin'
) ON CONFLICT (usuario) DO NOTHING;

-- ============================================================
-- DADOS DE EXEMPLO - Fornecedores
-- ============================================================
INSERT INTO public.fornecedores (nome, cnpj, telefone, email, cep, rua, numero, bairro, cidade, estado) VALUES
('Auto Pecas Brasil Ltda',    '12345678000195', '(11) 3333-1111', 'contato@autopecasbrasil.com.br', '01310100', 'Avenida Paulista',  '1000', 'Bela Vista',    'Sao Paulo', 'SP'),
('Distribuidora Norte Pecas', '98765432000188', '(85) 3333-2222', 'vendas@nortepeças.com.br',       '60110001', 'Rua Major Facundo', '500',  'Centro',        'Fortaleza', 'CE'),
('Lubrin Lubrificantes ME',   '11223344000100', '(62) 3333-3333', 'lubrificantes@lubrin.com.br',    '74110010', 'Rua 44',            '200',  'Setor Central', 'Goiania',   'GO')
ON CONFLICT (cnpj) DO NOTHING;

-- ============================================================
-- DADOS DE EXEMPLO - Clientes
-- ============================================================
INSERT INTO public.clientes (nome, cpf, telefone, email, cep, rua, numero, bairro, cidade, estado, veiculo_placa, veiculo_marca, veiculo_modelo) VALUES
('Carlos Eduardo Souza', '12345678901', '(88) 99801-1111', 'carlos.souza@email.com', '63500000', 'Rua Coronel Antonio Filgueira', '123', 'Centro',      'Iguatu', 'CE', 'ABC1D23', 'Chevrolet',  'Onix 1.0'),
('Maria Fernanda Lima',  '98765432100', '(88) 99802-2222', 'maria.lima@email.com',   '63500100', 'Rua Floriano Peixoto',          '456', 'Sao Jose',    'Iguatu', 'CE', 'XYZ2E34', 'Volkswagen', 'Gol 1.6'),
('Joao Pedro Alves',     '11122233344', '(88) 99803-3333', 'joao.alves@email.com',   '63500200', 'Avenida Leao Sampaio',          '789', 'Novo Iguatu', 'Iguatu', 'CE', 'DEF3F45', 'Ford',       'Ka 1.0')
ON CONFLICT (cpf) DO NOTHING;

-- ============================================================
-- DADOS DE EXEMPLO - Produtos
-- ============================================================
INSERT INTO public.produtos (codigo, nome, descricao, fornecedor_id, unidade, preco_compra, preco_venda, quantidade_atual, quantidade_minima) VALUES
('FLO-001', 'Filtro de Oleo Universal',     'Filtro de oleo compativel com motores 1.0 a 2.0', 1, 'un',  18.50,  35.00, 25,  5),
('FLA-002', 'Filtro de Ar Esportivo',        'Alta filtragem, lavavel e reutilizavel',          1, 'un',  32.00,  65.00, 15,  3),
('OLE-003', 'Oleo Motor 5W30 Sintetico 1L', 'Oleo sintetico de alta performance',              3, 'L',   22.00,  45.00, 40, 10),
('VEL-004', 'Vela de Ignicao NGK BKR5E',    'Vela de ignicao para motores gasolina',           1, 'un',   8.50,  18.00, 60, 10),
('PAS-005', 'Pastilha de Freio Dianteira',   'Kit com 4 pastilhas para eixo dianteiro',         2, 'un',  45.00,  90.00,  8,  4),
('LIQ-006', 'Liquido de Arrefecimento 1L',  'Aditivo para radiador, concentrado',              3, 'L',   12.00,  25.00, 20,  5),
('COR-007', 'Correia Dentada Kit',           'Kit correia + tensor + polia',                    2, 'un',  85.00, 170.00,  5,  2),
('BAT-008', 'Bateria 60Ah',                 'Bateria selada livre de manutencao',              2, 'un', 280.00, 480.00,  3,  1)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================