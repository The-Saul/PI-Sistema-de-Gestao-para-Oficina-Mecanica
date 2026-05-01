import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";





/* ── Design Tokens ── */
const T = {
  bg:         "#f3f5fa",
  surface:    "#ffffff",
  surfaceUp:  "#f8f9fd",
  border:     "#eaeef5",
  borderHi:   "#d4dae8",
  accent:     "#4f7cff",   /* blue */
  accentDim:  "#3b6bef",
  accentGlow: "rgba(79,124,255,0.10)",
  red:        "#e53e3e",
  redDim:     "#fc8181",
  redGlow:    "rgba(229,62,62,0.08)",
  amber:      "#d97706",
  amberGlow:  "rgba(217,119,6,0.08)",
  textHi:     "#1a1d2e",
  textMid:    "#4a5568",
  textLo:     "#7b8299",
  blue:       "#4f7cff",
  purple:     "#7c3aed",
  green:      "#1db863",
  greenGlow:  "rgba(29,184,99,0.10)",
  font:       "'DM Sans', 'Sora', sans-serif",
};

/* ── Dados ── */
const DADOS_FILTRO = {
  Mensal: {
    dateRange: "01/10/2023 – 31/10/2023",
    total: "R$ 29.500",
    servicos: 6,
    variacao: "+12,5%",
    variacaoLabel: "vs Set",
    ultimaAtt: "31/10/2023 – 17:45",
    rows: [
      { data: "01/10", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "10.000", spark: "0,14 11,8 22,10 33,4 44,6"  },
      { data: "01/10", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "3.000",  spark: "0,10 11,12 22,6 33,9 44,5"  },
      { data: "15/10", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "4.500",  spark: "0,12 11,7 22,9 33,5 44,8"   },
      { data: "15/10", avatar: "B", cliente: "João",    servico: "🔑 Licenciamento",  valor: "1.500",  spark: "0,8 11,13 22,7 33,10 44,6"  },
      { data: "15/10", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "1.000",  spark: "0,14 11,9 22,11 33,7 44,9"  },
      { data: "30/10", avatar: "G", cliente: "António", servico: "</> Desenvolvimento",valor: "9.500",  spark: "0,13 11,8 22,5 33,7 44,4"   },
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
      { data: "05/08", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "12.000", spark: "0,12 11,6 22,8 33,3 44,5"   },
      { data: "20/08", avatar: "G", cliente: "António", servico: "</> Desenvolvimento",valor: "15.000", spark: "0,14 11,9 22,6 33,4 44,3"   },
      { data: "10/09", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "2.200",  spark: "0,11 11,14 22,9 33,12 44,7"  },
      { data: "18/09", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "5.000",  spark: "0,13 11,8 22,11 33,6 44,8"   },
      { data: "01/10", avatar: "B", cliente: "João",    servico: "🔑 Licenciamento",  valor: "1.500",  spark: "0,8 11,13 22,7 33,10 44,6"   },
      { data: "15/10", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "4.500",  spark: "0,12 11,7 22,9 33,5 44,8"    },
      { data: "30/10", avatar: "G", cliente: "António", servico: "</> Desenvolvimento",valor: "9.500",  spark: "0,13 11,8 22,5 33,7 44,4"   },
      { data: "30/10", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "34.500", spark: "0,10 11,5 22,7 33,2 44,4"    },
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
      { data: "Jan", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "18.000", spark: "0,14 11,10 22,7 33,5 44,3"  },
      { data: "Fev", avatar: "G", cliente: "António", servico: "</> Desenvolvimento",valor: "22.500", spark: "0,13 11,9 22,6 33,4 44,2"   },
      { data: "Mar", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "9.000",  spark: "0,11 11,8 22,10 33,6 44,7"  },
      { data: "Abr", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "14.500", spark: "0,12 11,7 22,9 33,5 44,4"   },
      { data: "Mai", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "6.200",  spark: "0,10 11,13 22,8 33,11 44,7" },
      { data: "Jun", avatar: "G", cliente: "António", servico: "🔑 Licenciamento",  valor: "28.000", spark: "0,9 11,6 22,4 33,3 44,2"    },
      { data: "Jul", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "31.000", spark: "0,13 11,8 22,5 33,3 44,2"   },
      { data: "Ago", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "11.050", spark: "0,12 11,9 22,7 33,5 44,6"   },
      { data: "Set", avatar: "G", cliente: "António", servico: "</> Desenvolvimento",valor: "42.000", spark: "0,14 11,10 22,7 33,4 44,3"  },
      { data: "Out", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "29.500", spark: "0,11 11,7 22,9 33,5 44,4"   },
      { data: "Nov", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "52.000", spark: "0,13 11,8 22,6 33,4 44,3"   },
      { data: "Dez", avatar: "G", cliente: "António", servico: "🔑 Licenciamento",  valor: "49.000", spark: "0,12 11,7 22,5 33,3 44,2"   },
    ],
  },
};

const AVATAR_META = {
  A: { color: T.blue,   initials: "A" },
  B: { color: T.accent, initials: "B" },
  G: { color: T.purple, initials: "G" },
};

/* ════════════════════════════════
   GLOBAL STYLES
════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f3f5fa; color: #1a1d2e; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d4dae8; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  .fade-up { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.10s; }
  .fade-up-3 { animation-delay: 0.15s; }
  .fade-up-4 { animation-delay: 0.20s; }
`;

/* ════════════════════════════════
   ÍCONES
════════════════════════════════ */
const Ico = {
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity=".7"/>
      <rect x="9.5" y="1" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity=".7"/>
      <rect x="1" y="9.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity=".7"/>
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.2" fill="currentColor" opacity=".7"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" opacity=".8"/>
      <path d="M2 14c0-3 2.7-5.2 6-5.2s6 2.2 6 5.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".8"/>
    </svg>
  ),
  Box: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1L15 4.5v7L8 15 1 11.5v-7L8 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity=".8"/>
      <path d="M8 1v7M1 4.5l7 3.5 7-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity=".8"/>
    </svg>
  ),
  Truck: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" opacity=".8"/>
      <path d="M11 7h2.5L15 10v2h-4V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" opacity=".8"/>
      <circle cx="4" cy="13" r="1.2" fill="currentColor" opacity=".8"/>
      <circle cx="12" cy="13" r="1.2" fill="currentColor" opacity=".8"/>
    </svg>
  ),
  Finance: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" opacity=".9"/>
      <path d="M8 3.5v1M8 11.5v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M8 5.5c1 0 1.8.8 1.8 1.8S9 9.1 8 9.1s-1.8-.8-1.8-1.8.8-1.8 1.8-1.8" fill="currentColor" opacity=".9"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".7"/>
      <path d="M10.5 11L14 8l-3.5-3M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".7"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 10.5L9 7 5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v7M4 6.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 10.5L5 7l4-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};






/* ════════════════════════════════
   BOTÕES
════════════════════════════════ */
function BtnAccent({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        background: hov ? T.accentDim : T.accent,
        color: "#0d1a14", border: "none",
        borderRadius: 10, padding: "10px 20px",
        font: `600 13.5px ${T.font}`,
        cursor: "pointer", transition: "background 0.15s",
        letterSpacing: "0.01em",
      }}>{children}</button>
  );
}

function BtnGhost({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: hov ? T.surfaceUp : "transparent",
        color: hov ? T.textHi : T.textMid,
        border: `1px solid ${hov ? T.borderHi : T.border}`,
        borderRadius: 9, padding: "8px 14px",
        font: `500 12.5px ${T.font}`,
        cursor: "pointer", transition: "all 0.15s",
      }}>{children}</button>
  );
}

function PillBtn({ children, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 13px", borderRadius: 20, border: "none",
        font: `500 12px ${T.font}`, cursor: "pointer",
        background: active ? T.accent : hov ? T.surfaceUp : T.border,
        color: active ? "#0d1a14" : hov ? T.textHi : T.textMid,
        transition: "all 0.15s",
      }}>{children}</button>
  );
}

/* ════════════════════════════════
   PAINEL (HOME)
════════════════════════════════ */
const CARDS_DATA = [
  {
    label: "Entradas (Gastos)",
    value: "R$ 20,00",
    icon: "↘",
    color: "#B91C1C",
    glow: "#FEE2E2",
    trend: "-2,4%",
    trendDown: true,
  },
  {
    label: "Vendas (Saída)",
    value: "R$ 20,00",
    icon: "↗",
    color: "#16A34A",
    glow: "#D1FAE5",
    trend: "+8,1%",
    trendDown: false,
  },
  {
    label: "Saldo Atual",
    value: "R$ -20,00",
    icon: "$",
    color: "#D97706",
    glow: "#FDE688",
    trend: "0,0%",
    trendDown: false,
  },
];

function StatCard({ card, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={`fade-up fade-up-${delay}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, borderRadius: 16,
        background: hov ? `${card.color}22` : `${card.color}14`,
        border: `1px solid ${hov ? T.borderHi : T.border}`,
        padding: "22px 24px",
        transition: "all 0.22s",
        cursor: "default",
        boxShadow: hov ? `0 0 0 1px ${card.color}22` : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: T.textLo,
          textTransform: "uppercase", letterSpacing: "0.07em" }}>{card.label}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: card.glow, color: card.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700,
        }}>{card.icon}</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: card.color, lineHeight: 1, marginBottom: 10 }}>
        {card.value}
      </div>
      <div style={{
        fontSize: 11, fontWeight: 500,
        color: card.trendDown ? T.red : T.accent,
        background: card.trendDown ? T.redGlow : T.accentGlow,
        display: "inline-block", padding: "2px 8px", borderRadius: 20,
      }}>
        {card.trend} este mês
      </div>
    </div>
  );
}

const BAR_DATA = [
  { label: "Entradas", pct: 62.5, color: T.red   },
  { label: "Vendas",   pct: 62.5, color: T.green },
  { label: "Lucro",    pct: 62.5, color: T.amber  },
];

function BarChart() {
  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-end", height: 180 }}>
      {/* Y axis */}
      <div style={{
        display: "flex", flexDirection: "column-reverse", justifyContent: "space-between",
        height: "100%", paddingBottom: 26,
      }}>
        {["0", "4k", "8k", "12k", "16k"].map(v => (
          <span key={v} style={{ fontSize: 10, color: T.textLo, textAlign: "right", minWidth: 28 }}>{v}</span>
        ))}
      </div>
      {/* Bars area */}
      <div style={{ flex: 1, height: "100%", position: "relative" }}>
        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, paddingBottom: 26,
          display: "flex", flexDirection: "column-reverse", justifyContent: "space-between", pointerEvents: "none" }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width: "100%", height: 1,
              background: `linear-gradient(90deg, ${T.border} 0%, transparent 100%)` }}/>
          ))}
        </div>
        {/* Columns */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around",
          height: "calc(100% - 26px)", position: "relative", zIndex: 1 }}>
          {BAR_DATA.map(b => <BarItem key={b.label} bar={b} />)}
        </div>
      </div>
    </div>
  );
}

function BarItem({ bar }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1, height: "100%", justifyContent: "flex-end" }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          width: 52, height: `${bar.pct}%`,
          borderRadius: "6px 6px 0 0",
          background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.color}88 100%)`,
          boxShadow: hov ? `0 0 20px ${bar.color}55` : "none",
          transition: "all 0.2s", cursor: "default",
          opacity: hov ? 1 : 0.8,
        }}
      />
      <span style={{ fontSize: 11, color: T.textLo }}>{bar.label}</span>
    </div>
  );
}

function Painel({ onVerReceita }) {
  const [showNovaVenda, setShowNovaVenda] = useState(false);
  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "36px 44px", background: T.bg }}>
      <style>{GLOBAL_CSS}</style>

      {/* Header */}
      <Header
  title="Painel"
  subtitle="20 vendas hoje"
  action={
    <div style={{ display: "flex", gap: 10 }}>
      <BtnGhost onClick={onVerReceita}>
        📊 Ver Receita <Ico.Arrow />
      </BtnGhost>

      <BtnAccent onClick={() => setShowNovaVenda(true)}>
        <Ico.Plus /> Nova Venda
      </BtnAccent>
    </div>
  }
/>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
        {CARDS_DATA.map((c, i) => <StatCard key={c.label} card={c} delay={i + 1} />)}
      </div>

      {/* Chart card */}
      <div className="fade-up fade-up-4"
        style={{ background: T.surface, borderRadius: 16,
          border: `1px solid ${T.border}`, padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: T.textHi }}>Resumo do Mês</h2>
          <div style={{ display: "flex", gap: 16 }}>
            {BAR_DATA.map(b => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: T.textMid }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: b.color }}/>
                {b.label}
              </div>
            ))}
          </div>
        </div>
        <BarChart />
      </div>

      {showNovaVenda && <NovaVendaModal onClose={() => setShowNovaVenda(false)} />}
    </main>
  );
}

/* ════════════════════════════════
   MODAL NOVA VENDA
════════════════════════════════ */
function NovaVendaModal({ onClose }) {
  const [form, setForm] = useState({ cliente: "", servico: "", valor: "", data: "", obs: "" });
  const [saved, setSaved] = useState(false);

  const SERVICOS = [
    "🔍 Consultoria",
    "👥 Treinamento",
    "🔧 Manutenção",
    "🔑 Licenciamento",
    "🛠️ Suporte",
    "</> Desenvolvimento",
  ];

  function handleSalvar() {
    if (!form.cliente || !form.servico || !form.valor) return;
    setSaved(true);
    setTimeout(onClose, 1600);
  }

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    borderRadius: 9, border: `1px solid ${T.border}`,
    font: `400 13px ${T.font}`, color: T.textHi,
    background: T.surfaceUp, outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.surface, borderRadius: 20,
        border: `1px solid ${T.borderHi}`,
        padding: "32px 34px", width: 460,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        fontFamily: T.font,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.textHi }}>Nova Venda</div>
            <div style={{ fontSize: 12, color: T.textLo, marginTop: 4 }}>Preencha os dados da venda</div>
          </div>
          <button onClick={onClose} style={{
            background: T.surfaceUp, border: `1px solid ${T.border}`,
            borderRadius: 8, width: 32, height: 32, cursor: "pointer",
            color: T.textMid, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Cliente */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: T.textLo,
              textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
              Cliente
            </label>
            <input
              style={inputStyle}
              placeholder="Nome do cliente"
              value={form.cliente}
              onChange={e => setForm(f => ({ ...f, cliente: e.target.value }))}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>

          {/* Serviço */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: T.textLo,
              textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
              Serviço
            </label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={form.servico}
              onChange={e => setForm(f => ({ ...f, servico: e.target.value }))}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = T.border}
            >
              <option value="">Selecione um serviço</option>
              {SERVICOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Valor + Data lado a lado */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textLo,
                textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                Valor (R$)
              </label>
              <input
                style={inputStyle}
                placeholder="0,00"
                value={form.valor}
                onChange={e => setForm(f => ({ ...f, valor: e.target.value }))}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: T.textLo,
                textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
                Data
              </label>
              <input
                type="date"
                style={inputStyle}
                value={form.data}
                onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
                onFocus={e => e.target.style.borderColor = T.accent}
                onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: T.textLo,
              textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>
              Observações <span style={{ fontWeight: 400, color: T.textLo }}>(opcional)</span>
            </label>
            <textarea
              style={{ ...inputStyle, resize: "none", height: 72 }}
              placeholder="Detalhes adicionais..."
              value={form.obs}
              onChange={e => setForm(f => ({ ...f, obs: e.target.value }))}
              onFocus={e => e.target.style.borderColor = T.accent}
              onBlur={e => e.target.style.borderColor = T.border}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <BtnGhost onClick={onClose}>Cancelar</BtnGhost>
          {saved ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: T.greenGlow, border: `1px solid ${T.green}44`,
              color: T.green, borderRadius: 10, padding: "10px 20px",
              font: `600 13.5px ${T.font}`,
            }}>✅ Venda registrada!</div>
          ) : (
            <BtnAccent onClick={handleSalvar}><Ico.Plus /> Salvar Venda</BtnAccent>
          )}
        </div>
      </div>
    </div>
  );
}


function ExportModal({ filtro, onClose }) {
  const [downloading, setDownloading] = useState(null);
  const [done, setDone] = useState(null);
  const dados = DADOS_FILTRO[filtro];

  function simularDownload(tipo) {
    setDownloading(tipo); setDone(null);
    setTimeout(() => { setDownloading(null); setDone(tipo); }, 1800);
  }

  const tipos = [
    { key: "pdf",   label: "PDF",   desc: "Relatório formatado para impressão", color: T.red,   glow: T.redGlow   },
    { key: "excel", label: "Excel", desc: "Planilha editável (.xlsx)",           color: T.accent, glow: T.accentGlow },
  ];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.surface, borderRadius: 20,
        border: `1px solid ${T.borderHi}`,
        padding: "32px 34px", width: 420,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        fontFamily: T.font,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.textHi }}>Exportar Relatório</div>
            <div style={{ fontSize: 12, color: T.textLo, marginTop: 4 }}>
              {filtro} · {dados.dateRange}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: T.surfaceUp, border: `1px solid ${T.border}`,
            borderRadius: 8, width: 32, height: 32, cursor: "pointer",
            color: T.textMid, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Resumo */}
        <div style={{ background: T.surfaceUp, borderRadius: 12,
          border: `1px solid ${T.border}`,
          padding: "14px 16px", margin: "18px 0", lineHeight: 1.8 }}>
          <div style={{ fontSize: 12, color: T.textMid }}>
            <span style={{ color: T.textHi, fontWeight: 600 }}>{dados.servicos} serviços</span>
            <span style={{ color: T.textLo }}> · </span>
            Total: <span style={{ color: T.accent, fontWeight: 600 }}>{dados.total}</span>
            <span style={{ color: T.textLo }}> · </span>
            <span style={{ color: T.accent }}>{dados.variacao}</span> {dados.variacaoLabel}
          </div>
        </div>

        <div style={{ fontSize: 11, color: T.textLo, fontWeight: 600,
          letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>Formato</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tipos.map(t => {
            const isLoading = downloading === t.key;
            const isDone = done === t.key;
            return (
              <ExportOption key={t.key} tipo={t} isLoading={isLoading} isDone={isDone}
                onClick={() => !isLoading && !isDone && simularDownload(t.key)} />
            );
          })}
        </div>

        {done && (
          <div style={{ marginTop: 16, padding: "11px 15px", borderRadius: 10,
            background: T.accentGlow, border: `1px solid ${T.accent}44`,
            color: T.accent, fontSize: 12.5, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8 }}>
            ✅ Arquivo {done.toUpperCase()} gerado! Verifique os downloads.
          </div>
        )}
      </div>
    </div>
  );
}

function ExportOption({ tipo, isLoading, isDone, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px", borderRadius: 12,
        background: isDone ? tipo.glow : hov ? T.surfaceUp : "transparent",
        border: `1px solid ${isDone || hov ? tipo.color + "55" : T.border}`,
        cursor: isLoading || isDone ? "default" : "pointer",
        transition: "all 0.18s",
      }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 10,
        background: tipo.glow, color: tipo.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800, letterSpacing: "-0.02em" }}>
        {tipo.key === "pdf" ? "PDF" : "XLS"}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.textHi }}>{tipo.label}</div>
        <div style={{ fontSize: 11.5, color: T.textLo, marginTop: 1 }}>{tipo.desc}</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: isDone ? tipo.color : isLoading ? T.textLo : tipo.color,
        display: "flex", alignItems: "center", gap: 5 }}>
        {isDone ? "✓ Baixado" : isLoading ? "Gerando…" : <><Ico.Download /> Baixar</>}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   RECEITA
════════════════════════════════ */
function TableRow({ row }) {
  const [hov, setHov] = useState(false);
  const av = AVATAR_META[row.avatar];
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${T.border}`,
        background: hov ? T.surfaceUp : "transparent",
        transition: "background 0.14s",
      }}
    >
      <td style={{ padding: "12px 16px", fontSize: 12.5, color: T.textMid, whiteSpace: "nowrap" }}>
        {row.data}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: `${av.color}22`, color: av.color, border: `1px solid ${av.color}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>{av.initials}</div>
          <span style={{ fontSize: 13, color: T.textHi, fontWeight: 500 }}>{row.cliente}</span>
        </div>
      </td>
      <td style={{ padding: "12px 16px", fontSize: 13, color: T.textMid }}>{row.servico}</td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          fontSize: 13, fontWeight: 600, color: T.accent,
          background: T.accentGlow, borderRadius: 6, padding: "3px 10px",
          whiteSpace: "nowrap",
        }}>R$ {row.valor}</span>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <svg width="48" height="18" viewBox="0 0 44 18" style={{ display: "block" }}>
          <polyline points={row.spark} fill="none" stroke={T.accent} strokeWidth="1.8"
            strokeLinejoin="round" opacity="0.6"/>
        </svg>
      </td>
    </tr>
  );
}

function Receita({ onVoltar }) {
  const [filtro, setFiltro] = useState("Mensal");
  const [showExport, setShowExport] = useState(false);
  const dados = DADOS_FILTRO[filtro];

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto",
      padding: "36px 44px", background: T.bg, fontFamily: T.font }}>
      <style>{GLOBAL_CSS}</style>

      {/* Header */}
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: T.textHi }}>Receita</h1>
          <p style={{ fontSize: 13, color: T.textLo, marginTop: 6 }}>
            Detalhamento de entradas por período
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowExport(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: `1px solid ${T.border}`,
              borderRadius: 9, padding: "8px 14px",
              font: `500 12.5px ${T.font}`, color: T.textMid,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}
          >
            <Ico.Download /> Exportar PDF/Excel
          </button>
          <BtnGhost onClick={onVoltar}><Ico.ChevronLeft /> Voltar ao Painel</BtnGhost>
        </div>
      </div>

      {/* KPI strip */}
      <div className="fade-up fade-up-1" style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        {/* Total */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: "18px 22px", flex: 1 }}>
          <div style={{ fontSize: 10.5, color: T.textLo, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Total de Receitas</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.textHi, lineHeight: 1 }}>{dados.total}</div>
          <div style={{ fontSize: 11.5, color: T.textLo, marginTop: 6 }}>
            {dados.servicos} serviços &nbsp;
            <span style={{ color: T.accent, fontWeight: 600 }}>{dados.variacao}</span>
            {" "}<span style={{ color: T.textLo }}>{dados.variacaoLabel}</span>
          </div>
        </div>
        {/* Filters + date */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between",
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: "18px 22px", minWidth: 260 }}>
          <div style={{ fontSize: 10.5, color: T.textLo, fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Período</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {["Mensal", "Trimestral", "Anual"].map(f => (
              <PillBtn key={f} active={filtro === f} onClick={() => setFiltro(f)}>{f}</PillBtn>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: T.textLo }}>
            📅 {dados.dateRange}
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="fade-up fade-up-2"
        style={{ background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 16, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.borderHi}`, background: T.surfaceUp }}>
              {["Data", "Cliente", "Serviço", "Valor", ""].map((h, i) => (
                <th key={i} style={{ padding: "12px 16px", fontSize: 11, color: T.textLo,
                  fontWeight: 600, textAlign: "left", textTransform: "uppercase",
                  letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.rows.map((row, i) => (
              <TableRow key={`${filtro}-${i}`} row={row} />
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "14px 16px",
          borderTop: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 11, color: T.textLo }}>
            Última atualização: {dados.ultimaAtt}
          </span>
          <button onClick={() => setShowExport(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "7px 14px",
              font: `500 12px ${T.font}`, color: T.textMid,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}
          >
            <Ico.Download /> Exportar
          </button>
        </div>
      </div>

      {showExport && <ExportModal filtro={filtro} onClose={() => setShowExport(false)} />}
    </main>
  );
}

/* ════════════════════════════════
   APP ROOT
════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("painel");
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: T.font }}>
      <Sidebar />
      {page === "painel"
        ? <Painel  onVerReceita={() => setPage("receita")} />
        : <Receita onVoltar={()    => setPage("painel")}   />
      }
    </div>
  );
}
