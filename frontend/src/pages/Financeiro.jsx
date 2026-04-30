import { useState } from "react";

/* ── Logo base64 ── */
const LOGO_SRC =
  "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAdACADASIAAhEBAxEB/8QAGgAAAgIDAAAAAAAAAAAAAAAABgcCBQAECP/EAC0QAAEEAQMBBwIHAAAAAAAAAAECAwQRBQAGIRIHEyIxQUJRcbEjYoGRodHh/8QAFwEAAwEAAAAAAAAAAAAAAAAAAgMFBP/EAB4RAAICAgMBAQAAAAAAAAAAAAECAAMEERITITGx/9oADAMBAAIRAxEAPwDlBkfho+g0Z7Z2JJy+HRlHZ8aEwJPduJetKggVaxfHrXxeh3abCZOdxzDktmGlTiSX3q6EVzZvTk3TLhNvHKZtbLrJpuOy+glPiPLhQPWjSR6JF+Z1bxKFsXk0n3uwOlgPK7P0u5EoxGVZnRlOhDQbWla1j3cjwihZs8aj2j7Rwu2YUcwcjJmPuuFB6+kJAA58vqP31cnMYTD5BnBbbi0qY+hD76XAtSUqUPdVEi+B5fN6EO0JlDG4VttTUyWiO8SkKvuyeCD+agL/AE1ourqSskD38gVly3plr2WZXFwVR4qtvsZOa89anXQOllsJHIBBF3yf90R5OZh8znzPdzbLUuLNCItnqQaSPaD6q6vECNKJkkNIINGh9tS0mjL66whG4xqNsWB1GpnXcbDzczM5CfHk5SKyOhgWlN1QAsk2f4+y3zWQOTyb07uEMF02UI5A/vWkeSSfPWAc6Vdkdg4gaEJKwv32f//Z";

/* ── Paleta ── */
const C = {
  sidebarBg:    "#1a1a2e",
  sidebarText:  "#c9d1e0",
  active:       "#4f7cff",
  bodyBg:       "#f3f5fa",
  textMain:     "#1a1d2e",
  textSub:      "#7b8299",
  white:        "#ffffff",
  surfaceLight: "#f8f9fd",
  surfaceSubtle:"#f0f2f8",
  borderLight:  "#eaeef5",
  borderSubtle: "#f0f2f8",
  cardRed:      { bg: "#fdecea", text: "#c0392b" },
  cardGreen:    { bg: "#e8f8f0", text: "#1e9b5b" },
  cardOrange:   { bg: "#fff3e8", text: "#c95a00" },
  barEntradas:  "#c0392b",
  barVendas:    "#1db863",
  barLucro:     "#e07b2a",
  accentGreen:  "#1db863",
  avatarA:      "#4f7cff",
  avatarB:      "#1db863",
  avatarG:      "#a259ff",
};

/* ════════════════════════════════
   DADOS POR FILTRO
════════════════════════════════ */
const DADOS_FILTRO = {
  Mensal: {
    dateRange: "01/10/2023 – 31/10/2023",
    total: "R$ 29.500",
    servicos: 6,
    variacao: "+12,5% vs Set",
    ultimaAtt: "31/10/2023 – 17:45",
    rows: [
      { data: "01/10/2023", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "10.000", spark: "0,14 11,8 22,10 33,4 44,6"  },
      { data: "01/10/2023", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "3.000",  spark: "0,10 11,12 22,6 33,9 44,5"  },
      { data: "15/10/2023", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "4.500",  spark: "0,12 11,7 22,9 33,5 44,8"   },
      { data: "15/10/2023", avatar: "B", cliente: "João",    servico: "🔑 Licenciamento",  valor: "1.500",  spark: "0,8 11,13 22,7 33,10 44,6"  },
      { data: "15/10/2023", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "1.000",  spark: "0,14 11,9 22,11 33,7 44,9"  },
      { data: "30/10/2023", avatar: "G", cliente: "António", servico: "</> DesenvoMmento", valor: "9.500",  spark: "0,13 11,8 22,5 33,7 44,4"   },
    ],
  },
  Trimestral: {
    dateRange: "01/08/2023 – 31/10/2023",
    total: "R$ 84.200",
    servicos: 14,
    variacao: "+8,3% vs Trim. Ant.",
    ultimaAtt: "31/10/2023 – 18:00",
    rows: [
      { data: "05/08/2023", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "12.000", spark: "0,12 11,6 22,8 33,3 44,5"   },
      { data: "20/08/2023", avatar: "G", cliente: "António", servico: "</> DesenvoMmento", valor: "15.000", spark: "0,14 11,9 22,6 33,4 44,3"   },
      { data: "10/09/2023", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "2.200",  spark: "0,11 11,14 22,9 33,12 44,7" },
      { data: "18/09/2023", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "5.000",  spark: "0,13 11,8 22,11 33,6 44,8"  },
      { data: "01/10/2023", avatar: "B", cliente: "João",    servico: "🔑 Licenciamento",  valor: "1.500",  spark: "0,8 11,13 22,7 33,10 44,6"  },
      { data: "15/10/2023", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "4.500",  spark: "0,12 11,7 22,9 33,5 44,8"   },
      { data: "30/10/2023", avatar: "G", cliente: "António", servico: "</> DesenvoMmento", valor: "9.500",  spark: "0,13 11,8 22,5 33,7 44,4"   },
      { data: "30/10/2023", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "34.500", spark: "0,10 11,5 22,7 33,2 44,4"   },
    ],
  },
  Anual: {
    dateRange: "01/01/2023 – 31/12/2023",
    total: "R$ 312.750",
    servicos: 48,
    variacao: "+21,4% vs 2022",
    ultimaAtt: "31/12/2023 – 23:59",
    rows: [
      { data: "Jan/2023", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "18.000", spark: "0,14 11,10 22,7 33,5 44,3"  },
      { data: "Feb/2023", avatar: "G", cliente: "António", servico: "</> DesenvoMmento", valor: "22.500", spark: "0,13 11,9 22,6 33,4 44,2"   },
      { data: "Mar/2023", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "9.000",  spark: "0,11 11,8 22,10 33,6 44,7"  },
      { data: "Abr/2023", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "14.500", spark: "0,12 11,7 22,9 33,5 44,4"   },
      { data: "Mai/2023", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "6.200",  spark: "0,10 11,13 22,8 33,11 44,7" },
      { data: "Jun/2023", avatar: "G", cliente: "António", servico: "🔑 Licenciamento",  valor: "28.000", spark: "0,9 11,6 22,4 33,3 44,2"    },
      { data: "Jul/2023", avatar: "A", cliente: "Pedro",   servico: "🔍 Consultoria",    valor: "31.000", spark: "0,13 11,8 22,5 33,3 44,2"   },
      { data: "Ago/2023", avatar: "B", cliente: "João",    servico: "🔧 Manutenção",     valor: "11.050", spark: "0,12 11,9 22,7 33,5 44,6"   },
      { data: "Set/2023", avatar: "G", cliente: "António", servico: "</> DesenvoMmento", valor: "42.000", spark: "0,14 11,10 22,7 33,4 44,3"  },
      { data: "Out/2023", avatar: "A", cliente: "Pedro",   servico: "👥 Treinamento",    valor: "29.500", spark: "0,11 11,7 22,9 33,5 44,4"   },
      { data: "Nov/2023", avatar: "B", cliente: "João",    servico: "🛠️ Suporte",        valor: "52.000", spark: "0,13 11,8 22,6 33,4 44,3"   },
      { data: "Dez/2023", avatar: "G", cliente: "António", servico: "🔑 Licenciamento",  valor: "49.000", spark: "0,12 11,7 22,5 33,3 44,2"   },
    ],
  },
};

const AVATAR_COLORS = { A: C.avatarA, B: C.avatarB, G: C.avatarG };

/* ════════════════════════════════
   ÍCONES SVG
════════════════════════════════ */
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill={C.sidebarText}/>
      <rect x="11" y="1" width="6" height="6" rx="1.5" fill={C.sidebarText}/>
      <rect x="1" y="11" width="6" height="6" rx="1.5" fill={C.sidebarText}/>
      <rect x="11" y="11" width="6" height="6" rx="1.5" fill={C.sidebarText}/>
    </svg>
  ),
  Clientes: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3.5" stroke={C.sidebarText} strokeWidth="1.5"/>
      <path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={C.sidebarText} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Fornecedores: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="5" width="16" height="10" rx="2" stroke={C.sidebarText} strokeWidth="1.5"/>
      <path d="M5 5V4a4 4 0 0 1 8 0v1" stroke={C.sidebarText} strokeWidth="1.5"/>
      <circle cx="5" cy="13" r="1.5" fill={C.sidebarText}/>
      <circle cx="13" cy="13" r="1.5" fill={C.sidebarText}/>
    </svg>
  ),
  Estoque: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 1L17 5v8l-8 4-8-4V5l8-4z" stroke={C.sidebarText} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 1v12M1 5l8 4 8-4" stroke={C.sidebarText} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Financeiro: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="white" strokeWidth="1.5"/>
      <path d="M9 4.5v1M9 12.5v1" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M9 6.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2" fill="white"/>
    </svg>
  ),
  Sair: () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M7 3H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4" stroke={C.sidebarText} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13l4-4-4-4M16 9H7" stroke={C.sidebarText} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

/* ════════════════════════════════
   SIDEBAR
════════════════════════════════ */
const NAV_ITEMS = [
  { label: "Dashboard",    icon: "Dashboard"    },
  { label: "Clientes",     icon: "Clientes"     },
  { label: "Fornecedores", icon: "Fornecedores" },
  { label: "Estoque",      icon: "Estoque"      },
  { label: "Financeiro",   icon: "Financeiro",  active: true, arrow: true },
];

function Sidebar() {
  return (
    <aside style={{
      width: 210, minWidth: 210, background: C.sidebarBg,
      display: "flex", flexDirection: "column",
      paddingBottom: 24, fontFamily: "'Sora', sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "22px 20px 28px" }}>
        <img src={LOGO_SRC} alt="Logo" width={38} height={38}
          style={{ borderRadius: 9, display: "block", flexShrink: 0 }}/>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13.5, lineHeight: 1.2 }}>Sistema de Gestão</span>
          <span style={{ color: C.sidebarText, fontSize: 10, opacity: 0.7 }}>Nome da Empresa</span>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, padding: "0 10px" }}>
        {NAV_ITEMS.map(item => {
          const Icon = Icons[item.icon];
          return (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10,
              color: item.active ? "#fff" : C.sidebarText,
              fontSize: 13.5, fontWeight: item.active ? 600 : 500,
              background: item.active ? C.active : "transparent",
              cursor: "default", userSelect: "none",
            }}>
              <span style={{ fontSize: 17, width: 22, textAlign: "center" }}><Icon/></span>
              {item.label}
              {item.arrow && <span style={{ marginLeft: "auto", fontSize: 11, opacity: 0.8 }}>›</span>}
            </div>
          );
        })}

        <div style={{ flex: 1 }}/>

        <div
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
            borderRadius: 10, color: C.sidebarText, fontSize: 13.5, fontWeight: 500,
            cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ fontSize: 17, width: 22, textAlign: "center" }}><Icons.Sair/></span>
          Sair
        </div>
      </nav>
    </aside>
  );
}

/* ════════════════════════════════
   BOTÕES REUTILIZÁVEIS
════════════════════════════════ */
function NavBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: hov ? C.active : "transparent",
        border: `1.5px solid ${C.active}`, color: hov ? "#fff" : C.active,
        borderRadius: 8, padding: "6px 14px",
        fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 600,
        cursor: "pointer", marginBottom: 22, transition: "background 0.15s, color 0.15s",
      }}>{children}</button>
  );
}

function BtnPrimary({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.active, color: "#fff", border: "none",
        borderRadius: 10, padding: "12px 22px",
        fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 600,
        cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
        whiteSpace: "nowrap", opacity: hov ? 0.88 : 1, transition: "opacity 0.15s",
      }}>{children}</button>
  );
}

function FiltroBtn({ children, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "4px 11px", borderRadius: 6, border: "none",
        fontFamily: "'Sora', sans-serif", fontSize: 11.5, fontWeight: 500,
        cursor: "pointer",
        background: active || hov ? C.active : C.surfaceSubtle,
        color: active || hov ? "#fff" : C.textSub,
        transition: "background 0.12s, color 0.12s",
      }}>{children}</button>
  );
}

/* ════════════════════════════════
   MODAL DE EXPORTAÇÃO
════════════════════════════════ */
function ExportModal({ filtro, onClose }) {
  const [downloading, setDownloading] = useState(null);
  const [done, setDone] = useState(null);
  const dados = DADOS_FILTRO[filtro];

  function simularDownload(tipo) {
    setDownloading(tipo);
    setDone(null);
    setTimeout(() => {
      setDownloading(null);
      setDone(tipo);
    }, 1800);
  }

  const tipos = [
    {
      key: "pdf",
      label: "PDF",
      desc: "Relatório formatado para impressão",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="#fdecea"/>
          <path d="M8 6h8l6 6v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="#c0392b" strokeWidth="1.5" fill="none"/>
          <path d="M16 6v6h6" stroke="#c0392b" strokeWidth="1.5" strokeLinejoin="round"/>
          <text x="14" y="20" textAnchor="middle" fontSize="6" fontWeight="700" fill="#c0392b" fontFamily="Sora,sans-serif">PDF</text>
        </svg>
      ),
      color: "#c0392b",
      bgHov: "#fdecea",
    },
    {
      key: "excel",
      label: "Excel",
      desc: "Planilha editável (.xlsx)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="#e8f8f0"/>
          <path d="M8 6h8l6 6v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="#1e9b5b" strokeWidth="1.5" fill="none"/>
          <path d="M16 6v6h6" stroke="#1e9b5b" strokeWidth="1.5" strokeLinejoin="round"/>
          <text x="14" y="20" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#1e9b5b" fontFamily="Sora,sans-serif">XLS</text>
        </svg>
      ),
      color: "#1e9b5b",
      bgHov: "#e8f8f0",
    },
  ];

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(26,26,46,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.white, borderRadius: 18,
        padding: "32px 36px", width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        fontFamily: "'Sora', sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.textMain }}>Exportar Relatório</div>
            <div style={{ fontSize: 12, color: C.textSub, marginTop: 3 }}>
              Período: <strong>{dados.dateRange}</strong> · Filtro: <strong>{filtro}</strong>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: C.surfaceSubtle, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.textSub, flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Resumo */}
        <div style={{
          background: C.surfaceLight, borderRadius: 10,
          padding: "12px 16px", marginBottom: 20,
          fontSize: 12, color: C.textSub, lineHeight: 1.7,
        }}>
          <div>📊 <strong style={{ color: C.textMain }}>{dados.servicos} serviços</strong> no período</div>
          <div>💰 Total: <strong style={{ color: C.textMain }}>{dados.total}</strong></div>
          <div>📈 Variação: <strong style={{ color: C.accentGreen }}>{dados.variacao}</strong></div>
        </div>

        {/* Opções */}
        <div style={{ fontSize: 12, color: C.textSub, fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Escolha o formato
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tipos.map(t => {
            const isLoading = downloading === t.key;
            const isDone    = done === t.key;
            return (
              <ExportOption key={t.key} tipo={t} isLoading={isLoading} isDone={isDone}
                onClick={() => !isLoading && !isDone && simularDownload(t.key)}/>
            );
          })}
        </div>

        {done && (
          <div style={{
            marginTop: 16, padding: "10px 14px", borderRadius: 8,
            background: "#e8f8f0", color: "#1e9b5b", fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            ✅ Arquivo {done.toUpperCase()} gerado com sucesso! Verifique seus downloads.
          </div>
        )}
      </div>
    </div>
  );
}

function ExportOption({ tipo, isLoading, isDone, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px", borderRadius: 10,
        border: `1.5px solid ${isDone ? tipo.color : hov ? tipo.color : C.borderLight}`,
        background: isDone ? tipo.bgHov : hov ? tipo.bgHov + "66" : C.white,
        cursor: isLoading || isDone ? "default" : "pointer",
        transition: "all 0.15s",
      }}
    >
      {tipo.icon}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.textMain }}>{tipo.label}</div>
        <div style={{ fontSize: 11.5, color: C.textSub, marginTop: 1 }}>{tipo.desc}</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: isDone ? tipo.color : isLoading ? C.textSub : tipo.color }}>
        {isDone ? "✓ Baixado" : isLoading ? "Gerando…" : "⬇ Baixar"}
      </div>
    </div>
  );
}

/* ════════════════════════════════
   PAINEL
════════════════════════════════ */
const CARDS = [
  { label: "↘ Gastos (Entradas)", value: "R$ 20,00",  color: "red"    },
  { label: "↗ Vendas (saída)",    value: "R$ 20,00",  color: "green"  },
  { label: "$ Saldo",             value: "R$ -20,00", color: "orange" },
];
const CARD_STYLES = {
  red:    { bg: C.cardRed.bg,    text: C.cardRed.text    },
  green:  { bg: C.cardGreen.bg,  text: C.cardGreen.text  },
  orange: { bg: C.cardOrange.bg, text: C.cardOrange.text },
};
const BARS = [
  { key: "lucro",    label: "Lucro",    color: C.barLucro    },
  { key: "vendas",   label: "Vendas",   color: C.barVendas   },
  { key: "entradas", label: "Entradas", color: C.barEntradas },
];
const LEGEND = [
  { label: "Entradas (Gastos)", color: C.barEntradas },
  { label: "Vendas",            color: C.barVendas   },
  { label: "Lucro",             color: C.barLucro    },
];

function BarCol({ label, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1, height: "100%", justifyContent: "flex-end" }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ width: 64, height: "62.5%", borderRadius: "6px 6px 0 0",
          background: color, opacity: hov ? 0.82 : 1, transition: "opacity 0.15s", cursor: "default" }}/>
      <div style={{ fontSize: 12, color: C.textSub, height: 28, display: "flex", alignItems: "center" }}>{label}</div>
    </div>
  );
}

function Painel({ onVerReceita }) {
  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto",
      padding: "36px 40px", background: C.bodyBg, fontFamily: "'Sora', sans-serif" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: C.textMain, lineHeight: 1 }}>Painel</h1>
          <p style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>20 Vendas Hoje</p>
        </div>
        <BtnPrimary>＋ Nova Venda</BtnPrimary>
      </div>

      <NavBtn onClick={onVerReceita}>📊 Ver Receita →</NavBtn>

      <div style={{ display: "flex", gap: 18, marginBottom: 36 }}>
        {CARDS.map(c => {
          const s = CARD_STYLES[c.color];
          return (
            <div key={c.label} style={{ flex: 1, borderRadius: 14, padding: "18px 22px",
              background: s.bg, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.04em", color: s.text }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.text }}>{c.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.white, borderRadius: 16, padding: "28px 30px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.textMain, marginBottom: 20 }}>Resumo do mês</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24, flexWrap: "wrap" }}>
          {LEGEND.map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textSub }}>
              <div style={{ width: 16, height: 12, borderRadius: 3, background: l.color }}/>{l.label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", height: 240 }}>
          <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "space-between",
            height: "100%", paddingBottom: 28, marginRight: 12, minWidth: 46 }}>
            {["0","4.000","8.000","12.000","16.000"].map(v => (
              <div key={v} style={{ fontSize: 11, color: C.textSub, textAlign: "right" }}>{v}</div>
            ))}
          </div>
          <div style={{ flex: 1, height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "calc(100% - 28px)",
              display: "flex", flexDirection: "column-reverse", justifyContent: "space-between", pointerEvents: "none" }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: "100%", height: 1, background: C.borderLight }}/>)}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around",
              height: "calc(100% - 28px)", position: "relative", zIndex: 1 }}>
              {BARS.map(b => <BarCol key={b.key} label={b.label} color={b.color}/>)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ════════════════════════════════
   RECEITA
════════════════════════════════ */
function TableRow({ row }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: `1px solid ${C.borderSubtle}`,
        background: hov ? C.surfaceLight : "transparent", transition: "background 0.12s" }}>
      <td style={{ padding: "11px 12px", fontSize: 13 }}>{row.data}</td>
      <td style={{ padding: "11px 12px", fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%",
            background: AVATAR_COLORS[row.avatar],
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{row.avatar}</div>
          {row.cliente}
        </div>
      </td>
      <td style={{ padding: "11px 12px", fontSize: 13 }}>{row.servico}</td>
      <td style={{ padding: "11px 12px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
        R$ {row.valor}
      </td>
      <td style={{ padding: "11px 12px" }}>
        <svg width="44" height="18" viewBox="0 0 44 18" style={{ opacity: 0.55, display: "block" }}>
          <polyline points={row.spark} fill="none" stroke={C.accentGreen} strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
      </td>
    </tr>
  );
}

function Receita({ onVoltar }) {
  const [filtro, setFiltro]       = useState("Mensal");
  const [showExport, setShowExport] = useState(false);
  const dados = DADOS_FILTRO[filtro];

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto",
      padding: "36px 40px", background: C.bodyBg, fontFamily: "'Sora', sans-serif" }}>

      <div style={{ marginBottom: 6 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.textMain }}>Receita</h1>
      </div>

      <NavBtn onClick={onVoltar}>← Voltar ao Painel</NavBtn>

      <div style={{ background: C.white, borderRadius: 16, padding: "24px 28px",
        flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 18, flexWrap: "wrap", gap: 12 }}>

          <div style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
            📊 Gráfico de Receitas
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
            <span style={{ color: C.textSub, fontWeight: 600, marginRight: 2 }}>Filtros Rápidos</span>
            {["Mensal","Trimestral","Anual"].map(f => (
              <FiltroBtn key={f} active={filtro === f} onClick={() => setFiltro(f)}>{f}</FiltroBtn>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 5,
              color: C.textSub, fontSize: 11.5,
              background: C.surfaceSubtle, borderRadius: 6, padding: "4px 10px" }}>
              📅 {dados.dateRange}
            </div>
          </div>

          <div style={{ textAlign: "right", background: C.surfaceLight,
            borderRadius: 10, padding: "10px 16px", minWidth: 160 }}>
            <div style={{ fontSize: 10.5, color: C.textSub, fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.04em" }}>Total de Receitas</div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{dados.total}</div>
            <div style={{ fontSize: 10.5, color: C.textSub, marginTop: 2 }}>
              {dados.servicos} Serviços &nbsp;
              <span style={{ color: C.accentGreen, fontWeight: 600 }}>{dados.variacao}</span>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${C.borderLight}` }}>
              {["📅 Data","👤 Cliente – Nome","⚙️ Serviço","💲 Valor (R$)",""].map((h, i) => (
                <th key={i} style={{ padding: "10px 12px", fontSize: 12, color: C.textSub,
                  fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dados.rows.map((row, i) => <TableRow key={`${filtro}-${i}`} row={row}/>)}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.borderSubtle}` }}>
          <div style={{ fontSize: 11, color: C.textSub }}>
            Última atualização: {dados.ultimaAtt}
          </div>
          <ExportBtnSimple onClick={() => setShowExport(true)}/>
        </div>
      </div>

      {showExport && <ExportModal filtro={filtro} onClose={() => setShowExport(false)}/>}
    </main>
  );
}

function ExportBtnSimple({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#e2e6f0" : C.surfaceSubtle, border: "none", borderRadius: 8,
        padding: "7px 14px", fontFamily: "'Sora', sans-serif",
        fontSize: 12, fontWeight: 600, color: C.textMain,
        cursor: "pointer", transition: "background 0.12s",
        display: "flex", alignItems: "center", gap: 6,
      }}>⬇ Exportar PDF/Excel</button>
  );
}

/* ════════════════════════════════
   APP ROOT
════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("painel");
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; }
      `}</style>
      <Sidebar/>
      {page === "painel"
        ? <Painel  onVerReceita={() => setPage("receita")}/>
        : <Receita onVoltar={()   => setPage("painel")}/>
      }
    </div>
  );
}