--
-- PostgreSQL database dump
--

\restrict hTIJjF8vXLc4RoRrip5vECOerom69df9hdUgQjWYoowF4KBCVAF7zQMP8gKE5Oe

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-07 14:26:16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16742)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nome character varying(150) NOT NULL,
    cpf character(11),
    telefone character varying(20),
    email character varying(150),
    cep character(8),
    rua character varying(200),
    numero character varying(20),
    bairro character varying(100),
    cidade character varying(100),
    estado character(2),
    complemento character varying(150),
    veiculo_placa character varying(10),
    veiculo_marca character varying(80),
    veiculo_modelo character varying(80),
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16741)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 221
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 250 (class 1259 OID 17070)
-- Name: codigos_verificacao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.codigos_verificacao (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    email character varying(150) NOT NULL,
    codigo character varying(10) NOT NULL,
    usado boolean DEFAULT false NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    expira_em timestamp without time zone NOT NULL
);


ALTER TABLE public.codigos_verificacao OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 17069)
-- Name: codigos_verificacao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.codigos_verificacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.codigos_verificacao_id_seq OWNER TO postgres;

--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 249
-- Name: codigos_verificacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.codigos_verificacao_id_seq OWNED BY public.codigos_verificacao.id;


--
-- TOC entry 240 (class 1259 OID 16951)
-- Name: compras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compras (
    id integer NOT NULL,
    fornecedor_id integer,
    usuario_id integer,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    observacao text,
    data_compra date DEFAULT CURRENT_DATE NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.compras OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16950)
-- Name: compras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.compras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.compras_id_seq OWNER TO postgres;

--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 239
-- Name: compras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.compras_id_seq OWNED BY public.compras.id;


--
-- TOC entry 244 (class 1259 OID 17001)
-- Name: financeiro; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financeiro (
    id integer NOT NULL,
    tipo character varying(10) NOT NULL,
    descricao character varying(255) NOT NULL,
    valor numeric(12,2) NOT NULL,
    referencia_tipo character varying(20),
    referencia_id integer,
    cliente_id integer,
    fornecedor_id integer,
    usuario_id integer,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT financeiro_referencia_tipo_check CHECK (((referencia_tipo)::text = ANY ((ARRAY['venda'::character varying, 'os'::character varying, 'compra'::character varying, 'ajuste'::character varying])::text[]))),
    CONSTRAINT financeiro_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['entrada'::character varying, 'saida'::character varying])::text[]))),
    CONSTRAINT financeiro_valor_check CHECK ((valor > (0)::numeric))
);


ALTER TABLE public.financeiro OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17000)
-- Name: financeiro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.financeiro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financeiro_id_seq OWNER TO postgres;

--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 243
-- Name: financeiro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.financeiro_id_seq OWNED BY public.financeiro.id;


--
-- TOC entry 224 (class 1259 OID 16757)
-- Name: fornecedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fornecedores (
    id integer NOT NULL,
    nome character varying(150) NOT NULL,
    cnpj character(14),
    telefone character varying(20),
    email character varying(150),
    cep character(8),
    rua character varying(200),
    numero character varying(20),
    bairro character varying(100),
    cidade character varying(100),
    estado character(2),
    complemento character varying(150),
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.fornecedores OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16756)
-- Name: fornecedores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fornecedores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fornecedores_id_seq OWNER TO postgres;

--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 223
-- Name: fornecedores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fornecedores_id_seq OWNED BY public.fornecedores.id;


--
-- TOC entry 242 (class 1259 OID 16977)
-- Name: itens_compra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itens_compra (
    id integer NOT NULL,
    compra_id integer NOT NULL,
    produto_id integer NOT NULL,
    quantidade numeric(12,3) NOT NULL,
    preco_unitario numeric(12,2) NOT NULL,
    subtotal numeric(12,2) GENERATED ALWAYS AS ((quantidade * preco_unitario)) STORED,
    CONSTRAINT itens_compra_quantidade_check CHECK ((quantidade > (0)::numeric))
);


ALTER TABLE public.itens_compra OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16976)
-- Name: itens_compra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.itens_compra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itens_compra_id_seq OWNER TO postgres;

--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 241
-- Name: itens_compra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.itens_compra_id_seq OWNED BY public.itens_compra.id;


--
-- TOC entry 238 (class 1259 OID 16927)
-- Name: itens_os; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itens_os (
    id integer NOT NULL,
    os_id integer NOT NULL,
    produto_id integer NOT NULL,
    quantidade numeric(12,3) NOT NULL,
    preco_unitario numeric(12,2) NOT NULL,
    subtotal numeric(12,2) GENERATED ALWAYS AS ((quantidade * preco_unitario)) STORED,
    CONSTRAINT itens_os_quantidade_check CHECK ((quantidade > (0)::numeric))
);


ALTER TABLE public.itens_os OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16926)
-- Name: itens_os_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.itens_os_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itens_os_id_seq OWNER TO postgres;

--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 237
-- Name: itens_os_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.itens_os_id_seq OWNED BY public.itens_os.id;


--
-- TOC entry 236 (class 1259 OID 16909)
-- Name: itens_servico_os; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itens_servico_os (
    id integer NOT NULL,
    os_id integer NOT NULL,
    descricao character varying(255) NOT NULL,
    valor numeric(12,2) NOT NULL,
    CONSTRAINT itens_servico_os_valor_check CHECK ((valor > (0)::numeric))
);


ALTER TABLE public.itens_servico_os OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16908)
-- Name: itens_servico_os_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.itens_servico_os_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itens_servico_os_id_seq OWNER TO postgres;

--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 235
-- Name: itens_servico_os_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.itens_servico_os_id_seq OWNED BY public.itens_servico_os.id;


--
-- TOC entry 232 (class 1259 OID 16855)
-- Name: itens_venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itens_venda (
    id integer NOT NULL,
    venda_id integer NOT NULL,
    produto_id integer NOT NULL,
    quantidade numeric(12,3) NOT NULL,
    preco_unitario numeric(12,2) NOT NULL,
    subtotal numeric(12,2) GENERATED ALWAYS AS ((quantidade * preco_unitario)) STORED,
    CONSTRAINT itens_venda_quantidade_check CHECK ((quantidade > (0)::numeric))
);


ALTER TABLE public.itens_venda OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16854)
-- Name: itens_venda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.itens_venda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.itens_venda_id_seq OWNER TO postgres;

--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 231
-- Name: itens_venda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.itens_venda_id_seq OWNED BY public.itens_venda.id;


--
-- TOC entry 228 (class 1259 OID 16802)
-- Name: movimentacoes_estoque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimentacoes_estoque (
    id integer NOT NULL,
    produto_id integer NOT NULL,
    usuario_id integer,
    tipo character varying(10) NOT NULL,
    quantidade numeric(12,3) NOT NULL,
    motivo character varying(255),
    referencia_tipo character varying(20),
    referencia_id integer,
    data_mov date DEFAULT CURRENT_DATE NOT NULL,
    observacao text,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT movimentacoes_estoque_quantidade_check CHECK ((quantidade > (0)::numeric)),
    CONSTRAINT movimentacoes_estoque_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['entrada'::character varying, 'saida'::character varying])::text[])))
);


ALTER TABLE public.movimentacoes_estoque OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16801)
-- Name: movimentacoes_estoque_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movimentacoes_estoque_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movimentacoes_estoque_id_seq OWNER TO postgres;

--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 227
-- Name: movimentacoes_estoque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movimentacoes_estoque_id_seq OWNED BY public.movimentacoes_estoque.id;


--
-- TOC entry 234 (class 1259 OID 16879)
-- Name: ordens_servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ordens_servico (
    id integer NOT NULL,
    cliente_id integer,
    usuario_id integer,
    veiculo_placa character varying(10),
    veiculo_marca character varying(80),
    veiculo_modelo character varying(80),
    descricao_problema text,
    servicos_realizados text,
    valor_servico numeric(12,2) DEFAULT 0 NOT NULL,
    valor_pecas numeric(12,2) DEFAULT 0 NOT NULL,
    valor_total numeric(12,2) GENERATED ALWAYS AS ((valor_servico + valor_pecas)) STORED,
    status character varying(20) DEFAULT 'aberta'::character varying NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    concluida_em timestamp without time zone,
    CONSTRAINT ordens_servico_status_check CHECK (((status)::text = ANY ((ARRAY['aberta'::character varying, 'em_andamento'::character varying, 'concluida'::character varying, 'cancelada'::character varying])::text[])))
);


ALTER TABLE public.ordens_servico OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16878)
-- Name: ordens_servico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ordens_servico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ordens_servico_id_seq OWNER TO postgres;

--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 233
-- Name: ordens_servico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ordens_servico_id_seq OWNED BY public.ordens_servico.id;


--
-- TOC entry 226 (class 1259 OID 16772)
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    codigo character varying(50),
    nome character varying(150) NOT NULL,
    descricao text,
    fornecedor_id integer,
    unidade character varying(20) DEFAULT 'un'::character varying NOT NULL,
    preco_compra numeric(12,2) DEFAULT 0 NOT NULL,
    preco_venda numeric(12,2) DEFAULT 0 NOT NULL,
    quantidade_atual numeric(12,3) DEFAULT 0 NOT NULL,
    quantidade_minima numeric(12,3) DEFAULT 0 NOT NULL,
    observacao text,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16771)
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtos_id_seq OWNER TO postgres;

--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 225
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- TOC entry 220 (class 1259 OID 16725)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nome character varying(150) NOT NULL,
    usuario character varying(80) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16724)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 230 (class 1259 OID 16831)
-- Name: vendas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendas (
    id integer NOT NULL,
    cliente_id integer,
    usuario_id integer,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    observacao text,
    criado_em timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vendas OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16830)
-- Name: vendas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendas_id_seq OWNER TO postgres;

--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 229
-- Name: vendas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendas_id_seq OWNED BY public.vendas.id;


--
-- TOC entry 245 (class 1259 OID 17051)
-- Name: vw_estoque_critico; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_estoque_critico AS
 SELECT p.id,
    p.codigo,
    p.nome,
    p.quantidade_atual,
    p.quantidade_minima,
    p.unidade,
    f.nome AS fornecedor
   FROM (public.produtos p
     LEFT JOIN public.fornecedores f ON ((f.id = p.fornecedor_id)))
  WHERE (p.quantidade_atual <= p.quantidade_minima);


ALTER VIEW public.vw_estoque_critico OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 17056)
-- Name: vw_financeiro_mes; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_financeiro_mes AS
 SELECT tipo,
    sum(valor) AS total
   FROM public.financeiro
  WHERE (date_trunc('month'::text, criado_em) = date_trunc('month'::text, now()))
  GROUP BY tipo;


ALTER VIEW public.vw_financeiro_mes OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17060)
-- Name: vw_os_por_status; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_os_por_status AS
 SELECT status,
    count(*) AS quantidade
   FROM public.ordens_servico
  GROUP BY status;


ALTER VIEW public.vw_os_por_status OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 17064)
-- Name: vw_vendas_mes; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vw_vendas_mes AS
 SELECT count(*) AS quantidade_vendas,
    sum(total) AS total_vendas
   FROM public.vendas
  WHERE (date_trunc('month'::text, criado_em) = date_trunc('month'::text, now()));


ALTER VIEW public.vw_vendas_mes OWNER TO postgres;

--
-- TOC entry 4940 (class 2604 OID 16745)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 4976 (class 2604 OID 17073)
-- Name: codigos_verificacao id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.codigos_verificacao ALTER COLUMN id SET DEFAULT nextval('public.codigos_verificacao_id_seq'::regclass);


--
-- TOC entry 4968 (class 2604 OID 16954)
-- Name: compras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras ALTER COLUMN id SET DEFAULT nextval('public.compras_id_seq'::regclass);


--
-- TOC entry 4974 (class 2604 OID 17004)
-- Name: financeiro id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financeiro ALTER COLUMN id SET DEFAULT nextval('public.financeiro_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 16760)
-- Name: fornecedores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores ALTER COLUMN id SET DEFAULT nextval('public.fornecedores_id_seq'::regclass);


--
-- TOC entry 4972 (class 2604 OID 16980)
-- Name: itens_compra id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_compra ALTER COLUMN id SET DEFAULT nextval('public.itens_compra_id_seq'::regclass);


--
-- TOC entry 4966 (class 2604 OID 16930)
-- Name: itens_os id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_os ALTER COLUMN id SET DEFAULT nextval('public.itens_os_id_seq'::regclass);


--
-- TOC entry 4965 (class 2604 OID 16912)
-- Name: itens_servico_os id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_servico_os ALTER COLUMN id SET DEFAULT nextval('public.itens_servico_os_id_seq'::regclass);


--
-- TOC entry 4957 (class 2604 OID 16858)
-- Name: itens_venda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda ALTER COLUMN id SET DEFAULT nextval('public.itens_venda_id_seq'::regclass);


--
-- TOC entry 4951 (class 2604 OID 16805)
-- Name: movimentacoes_estoque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimentacoes_estoque ALTER COLUMN id SET DEFAULT nextval('public.movimentacoes_estoque_id_seq'::regclass);


--
-- TOC entry 4959 (class 2604 OID 16882)
-- Name: ordens_servico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordens_servico ALTER COLUMN id SET DEFAULT nextval('public.ordens_servico_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 16775)
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- TOC entry 4937 (class 2604 OID 16728)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4954 (class 2604 OID 16834)
-- Name: vendas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas ALTER COLUMN id SET DEFAULT nextval('public.vendas_id_seq'::regclass);


--
-- TOC entry 5224 (class 0 OID 16742)
-- Dependencies: 222
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clientes (id, nome, cpf, telefone, email, cep, rua, numero, bairro, cidade, estado, complemento, veiculo_placa, veiculo_marca, veiculo_modelo, criado_em) FROM stdin;
1	Carlos Eduardo Souza	12345678901	(88) 99801-1111	carlos.souza@email.com	63500000	Rua Coronel Antônio Filgueira	123	Centro	Iguatu	CE	\N	ABC1D23	Chevrolet	Onix 1.0	2026-06-03 20:54:02.346584
2	Maria Fernanda Lima	98765432100	(88) 99802-2222	maria.lima@email.com	63500100	Rua Floriano Peixoto	456	São José	Iguatu	CE	\N	XYZ2E34	Volkswagen	Gol 1.6	2026-06-03 20:54:02.346584
3	João Pedro Alves	11122233344	(88) 99803-3333	joao.alves@email.com	63500200	Avenida Leão Sampaio	789	Novo Iguatu	Iguatu	CE	\N	DEF3F45	Ford	Ka 1.0	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5248 (class 0 OID 17070)
-- Dependencies: 250
-- Data for Name: codigos_verificacao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.codigos_verificacao (id, usuario_id, email, codigo, usado, criado_em, expira_em) FROM stdin;
\.


--
-- TOC entry 5242 (class 0 OID 16951)
-- Dependencies: 240
-- Data for Name: compras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compras (id, fornecedor_id, usuario_id, total, observacao, data_compra, criado_em) FROM stdin;
1	1	\N	370.00	Primeira compra de peças para estoque inicial	2026-05-24	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5246 (class 0 OID 17001)
-- Dependencies: 244
-- Data for Name: financeiro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.financeiro (id, tipo, descricao, valor, referencia_tipo, referencia_id, cliente_id, fornecedor_id, usuario_id, criado_em) FROM stdin;
1	saida	Compra de peças — Auto Peças Brasil Ltda	370.00	compra	1	\N	1	\N	2026-06-03 20:54:02.346584
2	entrada	Venda #1 — Carlos Eduardo Souza	143.00	venda	1	1	\N	\N	2026-06-03 20:54:02.346584
3	entrada	OS #1 — Maria Fernanda Lima (Gol 1.6)	276.00	os	1	2	\N	\N	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5226 (class 0 OID 16757)
-- Dependencies: 224
-- Data for Name: fornecedores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fornecedores (id, nome, cnpj, telefone, email, cep, rua, numero, bairro, cidade, estado, complemento, criado_em) FROM stdin;
1	Auto Peças Brasil Ltda	12345678000195	(11) 3333-1111	contato@autopecasbrasil.com.br	01310100	Avenida Paulista	1000	Bela Vista	São Paulo	SP	\N	2026-06-03 20:54:02.346584
2	Distribuidora Norte Peças	98765432000188	(85) 3333-2222	vendas@nortepeças.com.br	60110001	Rua Major Facundo	500	Centro	Fortaleza	CE	\N	2026-06-03 20:54:02.346584
3	Lubrin Lubrificantes ME	11223344000100	(62) 3333-3333	lubrificantes@lubrin.com.br	74110010	Rua 44	200	Setor Central	Goiânia	GO	\N	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5244 (class 0 OID 16977)
-- Dependencies: 242
-- Data for Name: itens_compra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itens_compra (id, compra_id, produto_id, quantidade, preco_unitario) FROM stdin;
1	1	1	10.000	18.50
2	1	2	5.000	32.00
3	1	4	20.000	8.50
\.


--
-- TOC entry 5240 (class 0 OID 16927)
-- Dependencies: 238
-- Data for Name: itens_os; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itens_os (id, os_id, produto_id, quantidade, preco_unitario) FROM stdin;
1	1	5	1.000	90.00
2	1	4	4.000	18.00
\.


--
-- TOC entry 5238 (class 0 OID 16909)
-- Dependencies: 236
-- Data for Name: itens_servico_os; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itens_servico_os (id, os_id, descricao, valor) FROM stdin;
\.


--
-- TOC entry 5234 (class 0 OID 16855)
-- Dependencies: 232
-- Data for Name: itens_venda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itens_venda (id, venda_id, produto_id, quantidade, preco_unitario) FROM stdin;
1	1	3	2.000	45.00
2	1	1	1.000	35.00
3	1	4	1.000	18.00
\.


--
-- TOC entry 5230 (class 0 OID 16802)
-- Dependencies: 228
-- Data for Name: movimentacoes_estoque; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.movimentacoes_estoque (id, produto_id, usuario_id, tipo, quantidade, motivo, referencia_tipo, referencia_id, data_mov, observacao, criado_em) FROM stdin;
1	1	\N	entrada	10.000	Compra fornecedor - Auto Peças Brasil	compra	1	2026-05-24	\N	2026-06-03 20:54:02.346584
2	2	\N	entrada	5.000	Compra fornecedor - Auto Peças Brasil	compra	1	2026-05-24	\N	2026-06-03 20:54:02.346584
3	4	\N	entrada	20.000	Compra fornecedor - Auto Peças Brasil	compra	1	2026-05-24	\N	2026-06-03 20:54:02.346584
4	3	\N	saida	2.000	Venda #1	venda	1	2026-06-03	\N	2026-06-03 20:54:02.346584
5	1	\N	saida	1.000	Venda #1	venda	1	2026-06-03	\N	2026-06-03 20:54:02.346584
6	4	\N	saida	1.000	Venda #1	venda	1	2026-06-03	\N	2026-06-03 20:54:02.346584
7	5	\N	saida	1.000	Peça usada em OS #1	os	1	2026-06-03	\N	2026-06-03 20:54:02.346584
8	4	\N	saida	4.000	Peça usada em OS #1	os	1	2026-06-03	\N	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5236 (class 0 OID 16879)
-- Dependencies: 234
-- Data for Name: ordens_servico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ordens_servico (id, cliente_id, usuario_id, veiculo_placa, veiculo_marca, veiculo_modelo, descricao_problema, servicos_realizados, valor_servico, valor_pecas, status, criado_em, concluida_em) FROM stdin;
1	2	\N	XYZ2E34	Volkswagen	Gol 1.6	Carro fazendo barulho no freio dianteiro e perdendo potência	Substituição de pastilhas dianteiras e troca de velas de ignição	150.00	126.00	concluida	2026-06-03 20:54:02.346584	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5228 (class 0 OID 16772)
-- Dependencies: 226
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id, codigo, nome, descricao, fornecedor_id, unidade, preco_compra, preco_venda, quantidade_atual, quantidade_minima, observacao, criado_em) FROM stdin;
2	FLA-002	Filtro de Ar Esportivo	Alta filtragem, lavável e reutilizável	1	un	32.00	65.00	15.000	3.000	\N	2026-06-03 20:54:02.346584
6	LIQ-006	Líquido de Arrefecimento 1L	Aditivo para radiador, concentrado	3	L	12.00	25.00	20.000	5.000	\N	2026-06-03 20:54:02.346584
7	COR-007	Correia Dentada Kit	Kit correia + tensor + polia	2	un	85.00	170.00	5.000	2.000	\N	2026-06-03 20:54:02.346584
8	BAT-008	Bateria 60Ah	Bateria selada livre de manutenção	2	un	280.00	480.00	3.000	1.000	\N	2026-06-03 20:54:02.346584
3	OLE-003	Óleo Motor 5W30 Sintético 1L	Óleo sintético de alta performance	3	L	22.00	45.00	38.000	10.000	\N	2026-06-03 20:54:02.346584
1	FLO-001	Filtro de Óleo Universal	Filtro de óleo compatível com motores 1.0 a 2.0	1	un	18.50	35.00	24.000	5.000	\N	2026-06-03 20:54:02.346584
5	PAS-005	Pastilha de Freio Dianteira	Kit com 4 pastilhas para eixo dianteiro	2	un	45.00	90.00	7.000	4.000	\N	2026-06-03 20:54:02.346584
4	VEL-004	Vela de Ignição NGK BKR5E	Vela de ignição para motores gasolina	1	un	8.50	18.00	55.000	10.000	\N	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5222 (class 0 OID 16725)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nome, usuario, senha_hash, ativo, criado_em) FROM stdin;
2	Administrador	ciceroantonielg@aluno.unifapce.edu.br	$2y$10$SYVZ4IVPkkk64L5vNg4v4e/3VolswTJIU9TDTcCuyJkngZo4y5IFS	t	2026-06-07 12:37:42.482127
\.


--
-- TOC entry 5232 (class 0 OID 16831)
-- Dependencies: 230
-- Data for Name: vendas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendas (id, cliente_id, usuario_id, total, observacao, criado_em) FROM stdin;
1	1	\N	143.00	Venda de balcão — pagamento à vista	2026-06-03 20:54:02.346584
\.


--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 221
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 3, true);


--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 249
-- Name: codigos_verificacao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.codigos_verificacao_id_seq', 1, false);


--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 239
-- Name: compras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compras_id_seq', 1, true);


--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 243
-- Name: financeiro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.financeiro_id_seq', 3, true);


--
-- TOC entry 5272 (class 0 OID 0)
-- Dependencies: 223
-- Name: fornecedores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fornecedores_id_seq', 3, true);


--
-- TOC entry 5273 (class 0 OID 0)
-- Dependencies: 241
-- Name: itens_compra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.itens_compra_id_seq', 3, true);


--
-- TOC entry 5274 (class 0 OID 0)
-- Dependencies: 237
-- Name: itens_os_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.itens_os_id_seq', 2, true);


--
-- TOC entry 5275 (class 0 OID 0)
-- Dependencies: 235
-- Name: itens_servico_os_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.itens_servico_os_id_seq', 1, false);


--
-- TOC entry 5276 (class 0 OID 0)
-- Dependencies: 231
-- Name: itens_venda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.itens_venda_id_seq', 3, true);


--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 227
-- Name: movimentacoes_estoque_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.movimentacoes_estoque_id_seq', 8, true);


--
-- TOC entry 5278 (class 0 OID 0)
-- Dependencies: 233
-- Name: ordens_servico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ordens_servico_id_seq', 1, true);


--
-- TOC entry 5279 (class 0 OID 0)
-- Dependencies: 225
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtos_id_seq', 8, true);


--
-- TOC entry 5280 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- TOC entry 5281 (class 0 OID 0)
-- Dependencies: 229
-- Name: vendas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendas_id_seq', 1, true);


--
-- TOC entry 4994 (class 2606 OID 16755)
-- Name: clientes clientes_cpf_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_cpf_key UNIQUE (cpf);


--
-- TOC entry 4996 (class 2606 OID 16753)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 5045 (class 2606 OID 17084)
-- Name: codigos_verificacao codigos_verificacao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.codigos_verificacao
    ADD CONSTRAINT codigos_verificacao_pkey PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 16965)
-- Name: compras compras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_pkey PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 17015)
-- Name: financeiro financeiro_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financeiro
    ADD CONSTRAINT financeiro_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 16770)
-- Name: fornecedores fornecedores_cnpj_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_cnpj_key UNIQUE (cnpj);


--
-- TOC entry 5002 (class 2606 OID 16768)
-- Name: fornecedores fornecedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 16989)
-- Name: itens_compra itens_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_compra
    ADD CONSTRAINT itens_compra_pkey PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 16939)
-- Name: itens_os itens_os_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_os
    ADD CONSTRAINT itens_os_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 16919)
-- Name: itens_servico_os itens_servico_os_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_servico_os
    ADD CONSTRAINT itens_servico_os_pkey PRIMARY KEY (id);


--
-- TOC entry 5021 (class 2606 OID 16867)
-- Name: itens_venda itens_venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 16819)
-- Name: movimentacoes_estoque movimentacoes_estoque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimentacoes_estoque
    ADD CONSTRAINT movimentacoes_estoque_pkey PRIMARY KEY (id);


--
-- TOC entry 5026 (class 2606 OID 16897)
-- Name: ordens_servico ordens_servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordens_servico
    ADD CONSTRAINT ordens_servico_pkey PRIMARY KEY (id);


--
-- TOC entry 5007 (class 2606 OID 16795)
-- Name: produtos produtos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_codigo_key UNIQUE (codigo);


--
-- TOC entry 5009 (class 2606 OID 16793)
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 16738)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 16740)
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- TOC entry 5017 (class 2606 OID 16843)
-- Name: vendas vendas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 1259 OID 17031)
-- Name: idx_clientes_cpf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clientes_cpf ON public.clientes USING btree (cpf);


--
-- TOC entry 4998 (class 1259 OID 17032)
-- Name: idx_clientes_nome; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clientes_nome ON public.clientes USING btree (nome);


--
-- TOC entry 5046 (class 1259 OID 17091)
-- Name: idx_codigos_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_codigos_codigo ON public.codigos_verificacao USING btree (codigo);


--
-- TOC entry 5047 (class 1259 OID 17090)
-- Name: idx_codigos_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_codigos_email ON public.codigos_verificacao USING btree (email);


--
-- TOC entry 5048 (class 1259 OID 17093)
-- Name: idx_codigos_expiracao; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_codigos_expiracao ON public.codigos_verificacao USING btree (expira_em);


--
-- TOC entry 5049 (class 1259 OID 17092)
-- Name: idx_codigos_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_codigos_usuario ON public.codigos_verificacao USING btree (usuario_id);


--
-- TOC entry 5036 (class 1259 OID 17047)
-- Name: idx_compras_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_compras_fornecedor ON public.compras USING btree (fornecedor_id);


--
-- TOC entry 5041 (class 1259 OID 17050)
-- Name: idx_financeiro_criado_em; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_financeiro_criado_em ON public.financeiro USING btree (criado_em);


--
-- TOC entry 5042 (class 1259 OID 17049)
-- Name: idx_financeiro_referencia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_financeiro_referencia ON public.financeiro USING btree (referencia_tipo, referencia_id);


--
-- TOC entry 5043 (class 1259 OID 17048)
-- Name: idx_financeiro_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_financeiro_tipo ON public.financeiro USING btree (tipo);


--
-- TOC entry 5003 (class 1259 OID 17033)
-- Name: idx_fornecedores_cnpj; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fornecedores_cnpj ON public.fornecedores USING btree (cnpj);


--
-- TOC entry 5030 (class 1259 OID 17045)
-- Name: idx_itens_os_os; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itens_os_os ON public.itens_os USING btree (os_id);


--
-- TOC entry 5031 (class 1259 OID 17046)
-- Name: idx_itens_os_produto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itens_os_produto ON public.itens_os USING btree (produto_id);


--
-- TOC entry 5027 (class 1259 OID 16925)
-- Name: idx_itens_servico_os; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itens_servico_os ON public.itens_servico_os USING btree (os_id);


--
-- TOC entry 5018 (class 1259 OID 17041)
-- Name: idx_itens_venda_produto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itens_venda_produto ON public.itens_venda USING btree (produto_id);


--
-- TOC entry 5019 (class 1259 OID 17040)
-- Name: idx_itens_venda_venda; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itens_venda_venda ON public.itens_venda USING btree (venda_id);


--
-- TOC entry 5010 (class 1259 OID 17036)
-- Name: idx_movest_produto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movest_produto ON public.movimentacoes_estoque USING btree (produto_id);


--
-- TOC entry 5011 (class 1259 OID 17037)
-- Name: idx_movest_referencia; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movest_referencia ON public.movimentacoes_estoque USING btree (referencia_tipo, referencia_id);


--
-- TOC entry 5022 (class 1259 OID 17042)
-- Name: idx_os_cliente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_os_cliente ON public.ordens_servico USING btree (cliente_id);


--
-- TOC entry 5023 (class 1259 OID 17044)
-- Name: idx_os_criado_em; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_os_criado_em ON public.ordens_servico USING btree (criado_em);


--
-- TOC entry 5024 (class 1259 OID 17043)
-- Name: idx_os_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_os_status ON public.ordens_servico USING btree (status);


--
-- TOC entry 5004 (class 1259 OID 17034)
-- Name: idx_produtos_codigo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_produtos_codigo ON public.produtos USING btree (codigo);


--
-- TOC entry 5005 (class 1259 OID 17035)
-- Name: idx_produtos_fornecedor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_produtos_fornecedor ON public.produtos USING btree (fornecedor_id);


--
-- TOC entry 5014 (class 1259 OID 17038)
-- Name: idx_vendas_cliente; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendas_cliente ON public.vendas USING btree (cliente_id);


--
-- TOC entry 5015 (class 1259 OID 17039)
-- Name: idx_vendas_criado_em; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendas_criado_em ON public.vendas USING btree (criado_em);


--
-- TOC entry 5069 (class 2606 OID 17085)
-- Name: codigos_verificacao codigos_verificacao_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.codigos_verificacao
    ADD CONSTRAINT codigos_verificacao_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5062 (class 2606 OID 16966)
-- Name: compras compras_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE SET NULL;


--
-- TOC entry 5063 (class 2606 OID 16971)
-- Name: compras compras_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compras
    ADD CONSTRAINT compras_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5066 (class 2606 OID 17016)
-- Name: financeiro financeiro_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financeiro
    ADD CONSTRAINT financeiro_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;


--
-- TOC entry 5067 (class 2606 OID 17021)
-- Name: financeiro financeiro_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financeiro
    ADD CONSTRAINT financeiro_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE SET NULL;


--
-- TOC entry 5068 (class 2606 OID 17026)
-- Name: financeiro financeiro_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financeiro
    ADD CONSTRAINT financeiro_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5064 (class 2606 OID 16990)
-- Name: itens_compra itens_compra_compra_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_compra
    ADD CONSTRAINT itens_compra_compra_id_fkey FOREIGN KEY (compra_id) REFERENCES public.compras(id) ON DELETE CASCADE;


--
-- TOC entry 5065 (class 2606 OID 16995)
-- Name: itens_compra itens_compra_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_compra
    ADD CONSTRAINT itens_compra_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE RESTRICT;


--
-- TOC entry 5060 (class 2606 OID 16940)
-- Name: itens_os itens_os_os_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_os
    ADD CONSTRAINT itens_os_os_id_fkey FOREIGN KEY (os_id) REFERENCES public.ordens_servico(id) ON DELETE CASCADE;


--
-- TOC entry 5061 (class 2606 OID 16945)
-- Name: itens_os itens_os_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_os
    ADD CONSTRAINT itens_os_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE RESTRICT;


--
-- TOC entry 5059 (class 2606 OID 16920)
-- Name: itens_servico_os itens_servico_os_os_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_servico_os
    ADD CONSTRAINT itens_servico_os_os_id_fkey FOREIGN KEY (os_id) REFERENCES public.ordens_servico(id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 16873)
-- Name: itens_venda itens_venda_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE RESTRICT;


--
-- TOC entry 5056 (class 2606 OID 16868)
-- Name: itens_venda itens_venda_venda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_venda_id_fkey FOREIGN KEY (venda_id) REFERENCES public.vendas(id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 16820)
-- Name: movimentacoes_estoque movimentacoes_estoque_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimentacoes_estoque
    ADD CONSTRAINT movimentacoes_estoque_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE RESTRICT;


--
-- TOC entry 5052 (class 2606 OID 16825)
-- Name: movimentacoes_estoque movimentacoes_estoque_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimentacoes_estoque
    ADD CONSTRAINT movimentacoes_estoque_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5057 (class 2606 OID 16898)
-- Name: ordens_servico ordens_servico_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordens_servico
    ADD CONSTRAINT ordens_servico_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;


--
-- TOC entry 5058 (class 2606 OID 16903)
-- Name: ordens_servico ordens_servico_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordens_servico
    ADD CONSTRAINT ordens_servico_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5050 (class 2606 OID 16796)
-- Name: produtos produtos_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE SET NULL;


--
-- TOC entry 5053 (class 2606 OID 16844)
-- Name: vendas vendas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;


--
-- TOC entry 5054 (class 2606 OID 16849)
-- Name: vendas vendas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendas
    ADD CONSTRAINT vendas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


-- Completed on 2026-06-07 14:26:17

--
-- PostgreSQL database dump complete
--

\unrestrict hTIJjF8vXLc4RoRrip5vECOerom69df9hdUgQjWYoowF4KBCVAF7zQMP8gKE5Oe

