import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const T = {
  bg: "#f3f5fa",
  surface: "#ffffff",
  surfaceUp: "#f8f9fd",

  border: "#eaeef5",
  borderHi: "#d4dae8",

  accent: "#4f7cff",
  accentDim: "#3b6bef",
  accentGlow: "rgba(79,124,255,0.10)",

  red: "#e53e3e",
  redGlow: "rgba(229,62,62,0.08)",

  amber: "#d97706",
  amberGlow: "rgba(217,119,6,0.08)",

  textHi: "#1a1d2e",
  textMid: "#4a5568",
  textLo: "#7b8299",

  blue: "#4f7cff",
  purple: "#7c3aed",

  green: "#3ac295",
  greenGlow: "rgba(29,184,99,0.10)",

  font: "'DM Sans', sans-serif",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

*,
*::before,
*::after{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

body{
  font-family:'DM Sans',sans-serif;
  background:#f3f5fa;
  color:#1a1d2e;
}

::-webkit-scrollbar{
  width:4px;
}

::-webkit-scrollbar-thumb{
  background:#d4dae8;
  border-radius:4px;
}

@keyframes fadeUp{
  from{
    opacity:0;
    transform:translateY(16px)
  }

  to{
    opacity:1;
    transform:translateY(0)
  }
}

.fade-up{
  animation:fadeUp .45s cubic-bezier(.22,.68,0,1.2) both;
}

.fade-up-1{animation-delay:.05s}
.fade-up-2{animation-delay:.10s}
.fade-up-3{animation-delay:.15s}
.fade-up-4{animation-delay:.20s}
`;

const DADOS = {
  Mensal: {
    dateRange: "01/10/2023 – 31/10/2023",
    total: "R$ 29.500",
    servicos: 6,
    variacao: "+12,5%",
    variacaoLabel: "vs Set",
    ultimaAtt: "31/10/2023 – 17:45",

    rows: [
      {
        data: "01/10",
        av: "A",
        cliente: "Pedro",
        servico: "🔍 Consultoria",
        valor: "10.000",
        spark: "0,14 11,8 22,10 33,4 44,6",
      },

      {
        data: "01/10",
        av: "A",
        cliente: "Pedro",
        servico: "👥 Treinamento",
        valor: "3.000",
        spark: "0,10 11,12 22,6 33,9 44,5",
      },

      {
        data: "15/10",
        av: "B",
        cliente: "João",
        servico: "🔧 Manutenção",
        valor: "4.500",
        spark: "0,12 11,7 22,9 33,5 44,8",
      },

      {
        data: "30/10",
        av: "G",
        cliente: "António",
        servico: "</> Desenvolvimento",
        valor: "9.500",
        spark: "0,13 11,8 22,5 33,7 44,4",
      },
    ],
  },

  Trimestral: {
    dateRange: "01/08/2023 – 31/10/2023",
    total: "R$ 84.200",
    servicos: 14,
    variacao: "+8,3%",
    variacaoLabel: "vs Trim. Ant.",
    ultimaAtt: "31/10/2023 – 18:00",

    rows: [
      {
        data: "05/08",
        av: "A",
        cliente: "Pedro",
        servico: "🔍 Consultoria",
        valor: "12.000",
        spark: "0,12 11,6 22,8 33,3 44,5",
      },

      {
        data: "20/08",
        av: "G",
        cliente: "António",
        servico: "</> Desenvolvimento",
        valor: "15.000",
        spark: "0,14 11,9 22,6 33,4 44,3",
      },
    ],
  },

  Anual: {
    dateRange: "01/01/2023 – 31/12/2023",
    total: "R$ 312.750",
    servicos: 48,
    variacao: "+21,4%",
    variacaoLabel: "vs 2022",
    ultimaAtt: "31/12/2023 – 23:59",

    rows: [
      {
        data: "Jan",
        av: "A",
        cliente: "Pedro",
        servico: "🔍 Consultoria",
        valor: "18.000",
        spark: "0,14 11,10 22,7 33,5 44,3",
      },

      {
        data: "Fev",
        av: "G",
        cliente: "António",
        servico: "</> Desenvolvimento",
        valor: "22.500",
        spark: "0,13 11,9 22,6 33,4 44,2",
      },
    ],
  },
};

const AV = {
  A: {
    color: T.blue,
    i: "A",
  },

  B: {
    color: T.accent,
    i: "B",
  },

  G: {
    color: T.purple,
    i: "G",
  },
};

const BARS = [
  {
    label: "Entradas",
    pct: 62.5,
    color: T.red,
  },

  {
    label: "Vendas",
    pct: 62.5,
    color: T.green,
  },

  {
    label: "Lucro",
    pct: 62.5,
    color: T.amber,
  },
];

const CARDS = [
  {
    label: "Entradas (Gastos)",
    value: "R$ 20,00",
    icon: "↘",
    color: "#dc2626",
    glow: "#fee2e2",
  },

  {
    label: "Vendas (Saída)",
    value: "R$ 20,00",
    icon: "↗",
    color: "#16a34a",
    glow: "#d1fae5",
  },

  {
    label: "Saldo Atual",
    value: "R$ -20,00",
    icon: "$",
    color: "#d97706",
    glow: "#ffedd5",
  },
];

const inp = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 9,
  border: `1px solid ${T.border}`,
  font: `400 13px ${T.font}`,
  color: T.textHi,
  background: T.surfaceUp,
  outline: "none",
};

const Label = ({ children }) => (
  <label
    style={{
      fontSize: 11,
      fontWeight: 600,
      color: T.textLo,
      textTransform: "uppercase",
      letterSpacing: "0.07em",
      display: "block",
      marginBottom: 6,
    }}
  >
    {children}
  </label>
);

function Btn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,

        background: T.accent,
        color: "#fff",

        border: "none",
        borderRadius: 14,

        padding: "12px 18px",

        font: `600 14px ${T.font}`,

        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 13px",
        borderRadius: 20,

        border: "none",

        font: `500 12px ${T.font}`,

        cursor: "pointer",

        background: active ? T.accent : T.border,

        color: active ? "#fff" : T.textMid,
      }}
    >
      {children}
    </button>
  );
}

const IcoArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M5 10.5L9 7 5 3.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IcoDownload = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 2v7M4 6.5l3 3 3-3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M2 11h10"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IcoPlus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 2v10M2 7h10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IcoChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M9 10.5L5 7l4-3.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function ModalVenda({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,

        background: "rgba(0,0,0,.6)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.surface,

          width: 600,
          maxWidth: "90vw",

          borderRadius: 24,

          padding: 30,
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Nova Venda
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <Label>Cliente</Label>
            <input style={inp} placeholder="Nome do cliente" />
          </div>

          <div>
            <Label>Serviço</Label>

            <select style={inp}>
              <option>Consultoria</option>
              <option>Treinamento</option>
              <option>Manutenção</option>
            </select>
          </div>

          <div>
            <Label>Valor</Label>
            <input style={inp} placeholder="0,00" />
          </div>

          <div>
            <Label>Data</Label>
            <input type="date" style={inp} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 24,
          }}
        >
          <Btn onClick={onClose}>Cancelar</Btn>
          <Btn>Salvar Venda</Btn>
        </div>
      </div>
    </div>
  );
}

function Painel({ onVerReceita }) {
  const [showVenda, setShowVenda] = useState(false);

  return (
    <main className="main">
      <style>{CSS}</style>

      <Header
        title="Financeiro"
        subtitle="Controle financeiro da oficina"
      />

      <div className="tab">
        <span>$</span>
        <p>Visão Geral</p>
      </div>

      <div
        className="fade-up"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 28,
          gap: 10,
        }}
      >
        <Btn onClick={onVerReceita}>
          Ver Receita <IcoArrow />
        </Btn>

        <Btn onClick={() => setShowVenda(true)}>
          <IcoPlus /> Nova Venda
        </Btn>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {CARDS.map((c) => (
          <div
            key={c.label}
            style={{
              flex: 1,
              borderRadius: 18,
              background: c.glow,
              padding: 22,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: 14,

                marginBottom: 10,

                color: c.color,

                fontSize: 16,
                fontWeight: 700,
              }}
            >
              {c.icon}
            </div>

            <h3
              style={{
                fontSize: 26,
                marginTop: 10,
                color: c.color,
              }}
            >
              {c.value}
            </h3>

            <p
              style={{
                color: "#6b7280",
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: T.surface,
          borderRadius: 16,

          border: `1px solid ${T.border}`,

          padding: "28px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: T.textHi,
            }}
          >
            Resumo do Mês
          </h2>

          <div
            style={{
              display: "flex",
              gap: 16,
            }}
          >
            {BARS.map((b) => (
              <div
                key={b.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,

                  fontSize: 11.5,
                  color: T.textMid,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,

                    borderRadius: 3,

                    background: b.color,
                  }}
                />

                {b.label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            alignItems: "flex-end",

            height: 180,
          }}
        >
          {BARS.map((b) => (
            <div
              key={b.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                gap: 8,

                flex: 1,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: `${b.pct}%`,

                  borderRadius: "6px 6px 0 0",

                  background: b.color,
                }}
              />

              <span
                style={{
                  fontSize: 11,
                  color: T.textLo,
                }}
              >
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showVenda && <ModalVenda onClose={() => setShowVenda(false)} />}
    </main>
  );
}

function Receita({ onVoltar }) {
  const [filtro, setFiltro] = useState("Mensal");

  const d = DADOS[filtro];

  return (
    <main className="main">
      <style>{CSS}</style>

      <Header
        title="Receitas"
        subtitle="Detalhamento financeiro da oficina"
      />

      <div className="tab">
        <span>$</span>
        <p>Receitas</p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",

          marginBottom: 24,
          gap: 10,
        }}
      >
        <Btn>
          <IcoDownload /> Exportar
        </Btn>

        <Btn onClick={onVoltar}>
          <IcoChevronLeft /> Voltar
        </Btn>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: T.surface,

            border: `1px solid ${T.border}`,

            borderRadius: 14,

            padding: "18px 22px",

            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              color: T.textLo,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Total de Receitas
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {d.total}
          </div>
        </div>

        <div
          style={{
            background: T.surface,

            border: `1px solid ${T.border}`,

            borderRadius: 14,

            padding: "18px 22px",

            minWidth: 260,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 12,
            }}
          >
            {["Mensal", "Trimestral", "Anual"].map((f) => (
              <Pill
                key={f}
                active={filtro === f}
                onClick={() => setFiltro(f)}
              >
                {f}
              </Pill>
            ))}
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: T.textLo,
            }}
          >
            📅 {d.dateRange}
          </div>
        </div>
      </div>

      <div
        style={{
          background: T.surface,

          border: `1px solid ${T.border}`,

          borderRadius: 16,

          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${T.borderHi}`,
                background: T.surfaceUp,
              }}
            >
              {["Data", "Cliente", "Serviço", "Valor"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {d.rows.map((row, i) => {
              const av = AV[row.av];

              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    {row.data}
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,

                          borderRadius: "50%",

                          background: `${av.color}22`,
                          color: av.color,

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {av.i}
                      </div>

                      {row.cliente}
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    {row.servico}
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        background: T.accentGlow,
                        color: T.accent,

                        padding: "3px 10px",

                        borderRadius: 6,
                      }}
                    >
                      R$ {row.valor}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState("painel");

  return (
    <div className="app">
      <Sidebar />

      {page === "painel" ? (
        <Painel
          onVerReceita={() => setPage("receita")}
        />
      ) : (
        <Receita
          onVoltar={() => setPage("painel")}
        />
      )}
    </div>
  );
}