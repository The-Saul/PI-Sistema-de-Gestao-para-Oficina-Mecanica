import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const T = {
  bg:"#f3f5fa",
  surface:"#ffffff",
  surfaceUp:"#f8f9fd",
  border:"#eaeef5",
  borderHi:"#d4dae8",
  accent:"#4f7cff",
  accentDim:"#3b6bef",
  accentGlow:"rgba(79,124,255,0.10)",
  red:"#e53e3e",
  redGlow:"rgba(229,62,62,0.08)",
  amber:"#d97706",
  amberGlow:"rgba(217,119,6,0.08)",
  textHi:"#1a1d2e",
  textMid:"#4a5568",
  textLo:"#7b8299",
  blue:"#4f7cff",
  purple:"#7c3aed",
  green:"#3ac295",
  greenGlow:"rgba(29,184,99,0.10)",
  font:"'DM Sans', sans-serif",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  *,*::before,*::after{
    box-sizing:border-box;
    margin:0;
    padding:0;
  }

  body{
    font-family:'DM Sans',sans-serif;
    background:#f3f5fa;
    color:#1a1d2e;
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

  .fu{
    animation:fadeUp .45s cubic-bezier(.22,.68,0,1.2) both;
  }

  .fu1{animation-delay:.05s}
  .fu2{animation-delay:.10s}
  .fu3{animation-delay:.15s}
  .fu4{animation-delay:.20s}
`;

const DADOS = {
  Mensal:{
    dateRange:"01/10/2023 – 31/10/2023",
    total:"R$ 29.500",
    servicos:6,
    variacao:"+12,5%",
    variacaoLabel:"vs Set",
    ultimaAtt:"31/10/2023 – 17:45",

    rows:[
      {
        data:"01/10",
        av:"A",
        cliente:"Pedro",
        servico:"🔍 Consultoria",
        valor:"10.000",
        spark:"0,14 11,8 22,10 33,4 44,6"
      },

      {
        data:"01/10",
        av:"A",
        cliente:"Pedro",
        servico:"👥 Treinamento",
        valor:"3.000",
        spark:"0,10 11,12 22,6 33,9 44,5"
      },

      {
        data:"15/10",
        av:"B",
        cliente:"João",
        servico:"🔧 Manutenção",
        valor:"4.500",
        spark:"0,12 11,7 22,9 33,5 44,8"
      },

      {
        data:"15/10",
        av:"B",
        cliente:"João",
        servico:"🔑 Licenciamento",
        valor:"1.500",
        spark:"0,8 11,13 22,7 33,10 44,6"
      },

      {
        data:"15/10",
        av:"B",
        cliente:"João",
        servico:"🛠️ Suporte",
        valor:"1.000",
        spark:"0,14 11,9 22,11 33,7 44,9"
      },

      {
        data:"30/10",
        av:"G",
        cliente:"António",
        servico:"💻 Desenvolvimento",
        valor:"9.500",
        spark:"0,13 11,8 22,5 33,7 44,4"
      },
    ],
  },

  Trimestral:{
    dateRange:"01/08/2023 – 31/10/2023",
    total:"R$ 84.200",
    servicos:14,
    variacao:"+8,3%",
    variacaoLabel:"vs Trim. Ant.",
    ultimaAtt:"31/10/2023 – 18:00",

    rows:[
      {
        data:"05/08",
        av:"A",
        cliente:"Pedro",
        servico:"🔍 Consultoria",
        valor:"12.000",
        spark:"0,12 11,6 22,8 33,3 44,5"
      },

      {
        data:"20/08",
        av:"G",
        cliente:"António",
        servico:"💻 Desenvolvimento",
        valor:"15.000",
        spark:"0,14 11,9 22,6 33,4 44,3"
      },
    ],
  },

  Anual:{
    dateRange:"01/01/2023 – 31/12/2023",
    total:"R$ 312.750",
    servicos:48,
    variacao:"+21,4%",
    variacaoLabel:"vs 2022",
    ultimaAtt:"31/12/2023 – 23:59",

    rows:[
      {
        data:"Jan",
        av:"A",
        cliente:"Pedro",
        servico:"🔍 Consultoria",
        valor:"18.000",
        spark:"0,14 11,10 22,7 33,5 44,3"
      },

      {
        data:"Fev",
        av:"G",
        cliente:"António",
        servico:"💻 Desenvolvimento",
        valor:"22.500",
        spark:"0,13 11,9 22,6 33,4 44,2"
      },
    ],
  },
};

const AV = {
  A:{color:T.blue,i:"A"},
  B:{color:T.accent,i:"B"},
  G:{color:T.purple,i:"G"},
};

function Btn({children,onClick}){
  return (
    <button
      onClick={onClick}
      style={{
        display:"inline-flex",
        alignItems:"center",
        gap:7,
        background:T.accent,
        color:"#fff",
        border:"none",
        borderRadius:14,
        padding:"12px 18px",
        font:`600 14px ${T.font}`,
        cursor:"pointer",
      }}
    >
      {children}
    </button>
  );
}

function Pill({children,active,onClick}){
  return (
    <button
      onClick={onClick}
      style={{
        padding:"5px 13px",
        borderRadius:20,
        border:"none",
        cursor:"pointer",
        background:active ? T.accent : T.border,
        color:active ? "#fff" : T.textMid,
      }}
    >
      {children}
    </button>
  );
}

function Painel({onVerReceita}){
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
        className="fu"
        style={{
          display:"flex",
          justifyContent:"flex-end",
          marginBottom:28,
        }}
      >
        <Btn onClick={onVerReceita}>
          Ver Receita
        </Btn>
      </div>

      <div
        style={{
          display:"flex",
          gap:16,
        }}
      >
        <div
          style={{
            flex:1,
            background:"#fee2e2",
            padding:22,
            borderRadius:18,
          }}
        >
          <h3>R$ 20,00</h3>
          <p>Entradas</p>
        </div>

        <div
          style={{
            flex:1,
            background:"#d1fae5",
            padding:22,
            borderRadius:18,
          }}
        >
          <h3>R$ 20,00</h3>
          <p>Vendas</p>
        </div>

        <div
          style={{
            flex:1,
            background:"#ffedd5",
            padding:22,
            borderRadius:18,
          }}
        >
          <h3>R$ -20,00</h3>
          <p>Saldo Atual</p>
        </div>
      </div>
    </main>
  );
}

function Receita({onVoltar}){
  const [filtro,setFiltro] = useState("Mensal");

  const d = DADOS[filtro];

  return (
    <main
      className="main"
      style={{
        display:"flex",
        flexDirection:"column",
      }}
    >
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
        className="fu"
        style={{
          display:"flex",
          justifyContent:"flex-end",
          gap:10,
          marginBottom:24,
        }}
      >
        <Btn onClick={onVoltar}>
          Voltar ao Painel
        </Btn>
      </div>

      <div
        style={{
          display:"flex",
          gap:14,
          marginBottom:24,
        }}
      >
        <div
          style={{
            flex:1,
            background:T.surface,
            border:`1px solid ${T.border}`,
            borderRadius:14,
            padding:"18px 22px",
          }}
        >
          <div>Total de Receitas</div>

          <div
            style={{
              fontSize:28,
              fontWeight:700,
            }}
          >
            {d.total}
          </div>

          <div>
            {d.servicos} serviços
          </div>
        </div>

        <div
          style={{
            background:T.surface,
            border:`1px solid ${T.border}`,
            borderRadius:14,
            padding:"18px 22px",
            minWidth:260,
          }}
        >
          <div
            style={{
              marginBottom:12,
            }}
          >
            Período
          </div>

          <div
            style={{
              display:"flex",
              gap:6,
            }}
          >
            {["Mensal","Trimestral","Anual"].map(f=>(
              <Pill
                key={f}
                active={filtro===f}
                onClick={()=>setFiltro(f)}
              >
                {f}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          background:T.surface,
          border:`1px solid ${T.border}`,
          borderRadius:16,
          overflow:"hidden",
        }}
      >
        <table
          style={{
            width:"100%",
            borderCollapse:"collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background:T.surfaceUp,
              }}
            >
              <th style={{padding:16}}>Data</th>
              <th style={{padding:16}}>Cliente</th>
              <th style={{padding:16}}>Serviço</th>
              <th style={{padding:16}}>Valor</th>
            </tr>
          </thead>

          <tbody>
            {d.rows.map((row,i)=>{
              const av = AV[row.av];

              return (
                <tr key={i}>
                  <td style={{padding:16}}>
                    {row.data}
                  </td>

                  <td style={{padding:16}}>
                    <div
                      style={{
                        display:"flex",
                        alignItems:"center",
                        gap:10,
                      }}
                    >
                      <div
                        style={{
                          width:28,
                          height:28,
                          borderRadius:"50%",
                          background:`${av.color}22`,
                          color:av.color,
                          display:"flex",
                          alignItems:"center",
                          justifyContent:"center",
                        }}
                      >
                        {av.i}
                      </div>

                      {row.cliente}
                    </div>
                  </td>

                  <td style={{padding:16}}>
                    {row.servico}
                  </td>

                  <td style={{padding:16}}>
                    R$ {row.valor}
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

export default function App(){
  const [page,setPage] = useState("painel");

  return (
    <div className="app">
      <Sidebar />

      {page === "painel"
        ? (
          <Painel
            onVerReceita={()=>setPage("receita")}
          />
        )
        : (
          <Receita
            onVoltar={()=>setPage("painel")}
          />
        )
      }
    </div>
  );
}