// Financeiro.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../Financeiro.css";

const DADOS = {
  Mensal: {
    dateRange: "01/10/2023 – 31/10/2023",
    total: "R$ 29.500",

    rows: [
      {
        data: "01/10",
        av: "A",
        cliente: "Pedro",
        servico: " Consultoria",
        valor: "10.000",
      },

      {
        data: "01/10",
        av: "A",
        cliente: "Pedro",
        servico: " Treinamento",
        valor: "3.000",
      },

      {
        data: "15/10",
        av: "B",
        cliente: "João",
        servico: " Manutenção",
        valor: "4.500",
      },

      {
        data: "30/10",
        av: "G",
        cliente: "António",
        servico: "</> Desenvolvimento",
        valor: "9.500",
      },
    ],
  },

  Trimestral: {
    dateRange: "01/08/2023 – 31/10/2023",
    total: "R$ 84.200",

    rows: [
      {
        data: "05/08",
        av: "A",
        cliente: "Pedro",
        servico: " Consultoria",
        valor: "12.000",
      },

      {
        data: "20/08",
        av: "G",
        cliente: "António",
        servico: "</> Desenvolvimento",
        valor: "15.000",
      },
    ],
  },

  Anual: {
    dateRange: "01/01/2023 – 31/12/2023",
    total: "R$ 312.750",

    rows: [
      {
        data: "Jan",
        av: "A",
        cliente: "Pedro",
        servico: " Consultoria",
        valor: "18.000",
      },

      {
        data: "Fev",
        av: "G",
        cliente: "António",
        servico: "</> Desenvolvimento",
        valor: "22.500",
      },
    ],
  },
};

const BARS = [
  {
    label: "Entradas",
    pctClass: "bar-1",
  },

  {
    label: "Vendas",
    pctClass: "bar-2",
  },

  {
    label: "Lucro",
    pctClass: "bar-3",
  },
];

const CARDS = [
  {
    label: "Entradas (Gastos)",
    value: "R$ 20,00",
    icon: "↘",
    className: "card-red",
  },

  {
    label: "Vendas (Saída)",
    value: "R$ 20,00",
    icon: "↗",
    className: "card-green",
  },

  {
    label: "Saldo Atual",
    value: "R$ -20,00",
    icon: "$",
    className: "card-orange",
  },
];

function Btn({ children, onClick }) {
  return (
    <button onClick={onClick} className="btn">
      {children}
    </button>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`pill ${active ? "active" : ""}`}
    >
      {children}
    </button>
  );
}

function Label({ children }) {
  return <label className="label">{children}</label>;
}

function ModalVenda({
  onClose,
  setDados,
}) {
  const [cliente, setCliente] =
    useState("");

  const [servico, setServico] =
    useState("");

  const [valor, setValor] =
    useState("");

  const [data, setData] =
    useState("");

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-box"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <h2>Nova Venda</h2>

        <div className="modal-form">
          <div>
            <Label>Cliente</Label>

            <input
              className="input"
              value={cliente}
              onChange={(e) =>
                setCliente(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <Label>Serviço</Label>

            <select
              className="input"
              value={servico}
              onChange={(e) =>
                setServico(
                  e.target.value
                )
              }
            >
              <option>
                Orçamento
              </option>

              <option>
                Peças
              </option>

              <option>
                Manutenção
              </option>
            </select>
          </div>

          <div>
            <Label>Valor</Label>

            <input
              className="input"
              value={valor}
              onChange={(e) =>
                setValor(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <Label>Data</Label>

            <input
              type="date"
              className="input"
              value={data}
              onChange={(e) =>
                setData(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div className="modal-actions">
          <Btn onClick={onClose}>
            Cancelar
          </Btn>

          <Btn
            onClick={() => {
              const novaVenda = {
                data,

                av:
                  cliente.charAt(0) ||
                  "C",

                cliente,

                servico,

                valor,
              };

              setDados((prev) => ({
                ...prev,

                Mensal: {
                  ...prev.Mensal,

                  rows: [
                    ...prev.Mensal.rows,

                    novaVenda,
                  ],
                },
              }));

              onClose();
            }}
          >
            Salvar Venda
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ModalOS({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Nova Ordem de Serviço</h2>

        <div className="modal-form">
          <div>
            <Label>Cliente</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Veículo</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Placa</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Serviço</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Valor</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Data</Label>
            <input type="date" className="input" />
          </div>
        </div>

        <div className="modal-actions">
          <Btn onClick={onClose}>
            Cancelar
          </Btn>

          <Btn>
            Salvar OS
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ModalEntrada({ onClose }) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-box"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <h2>Nova Entrada</h2>

        <div className="modal-form">
          <div>
            <Label>Fornecedor</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Produto</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Quantidade</Label>

            <input
              type="number"
              className="input"
            />
          </div>

          <div>
            <Label>Valor</Label>
            <input className="input" />
          </div>

          <div>
            <Label>Data</Label>

            <input
              type="date"
              className="input"
            />
          </div>
        </div>

        <div className="modal-actions">
          <Btn onClick={onClose}>
            Cancelar
          </Btn>

          <Btn>
            Salvar Entrada
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Painel({
  onVerReceita,
  dados,
  setDados,
}) {
  const [showVenda, setShowVenda] =
    useState(false);

  const [showOS, setShowOS] =
    useState(false);

  const [showEntrada, setShowEntrada] =
  useState(false);

  return (
    <main className="main">
      <Header
        title="Financeiro"
        subtitle="Controle financeiro da oficina"
      />

      <div className="tab">
        <span>$</span>
        <p>Visão Geral</p>
      </div>

      <div className="top-actions">
  <Btn onClick={onVerReceita}>
    Ver Receita
  </Btn>

  <Btn onClick={() => setShowOS(true)}>
    Ordem de Serviço
  </Btn>

  <Btn
    onClick={() => setShowVenda(true)}
  >
    Nova Venda
  </Btn>

  <Btn
    onClick={() => setShowEntrada(true)}
  >
    Nova Entrada
  </Btn>
</div>

      <div className="cards-grid">
        {CARDS.map((c) => (
          <div
            key={c.label}
            className={`card-financeiro ${c.className}`}
          >
            <div className="card-icon-financeiro">
              {c.icon}
            </div>

            <h3>{c.value}</h3>

            <p>{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grafico-box">
        <div className="grafico-header">
          <h2>Resumo do Mês</h2>
        </div>

        <div className="grafico-bars">
          {BARS.map((b) => (
            <div
              key={b.label}
              className="bar-item"
            >
              <div
                className={`bar ${b.pctClass}`}
              />

              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {showVenda && (
        <ModalVenda
  setDados={setDados}
  onClose={() =>
    setShowVenda(false)
  }
/>
      )}

      {showOS && (
        <ModalOS
          onClose={() => setShowOS(false)}
        />
      )}

      {showEntrada && (
        <ModalEntrada
          onClose={() =>
            setShowEntrada(false)
          }
        />
      )}
    </main>
  );
}

function ModalExport({
  onClose,
}) {
  function exportar(tipo) {
    alert(
      `Download em ${tipo} realizado com sucesso!`
    );

    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-box"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <h2>Exportar Relatório</h2>

        <div className="modal-actions">
          <Btn
            onClick={() =>
              exportar("PDF")
            }
          >
            Exportar PDF
          </Btn>

          <Btn
            onClick={() =>
              exportar("Excel")
            }
          >
            Exportar Excel
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Receita({
  onVoltar,
  dados,
}) {
  const [filtro, setFiltro] =
    useState("Mensal");

  const [showExport, setShowExport] =
  useState(false);

  const d = dados[filtro];

  return (
    <main className="main">
      <Header
        title="Receitas"
        subtitle="Detalhamento financeiro da oficina"
      />

      <div className="tab">
        <span>$</span>
        <p>Receitas</p>
      </div>

      <div className="top-actions">
        <Btn
  onClick={() =>
    setShowExport(true)
  }
>
  Exportar
</Btn>

        <Btn onClick={onVoltar}>
          Voltar
        </Btn>
      </div>

      <div className="receita-top">
        <div className="receita-total">
          <div className="mini-title">
            Total de Receitas
          </div>

          <div className="receita-value">
            {d.total}
          </div>
        </div>

        <div className="receita-filter">
          <div className="pill-group">
            {[
              "Mensal",
              "Trimestral",
              "Anual",
            ].map((f) => (
              <Pill
                key={f}
                active={filtro === f}
                onClick={() =>
                  setFiltro(f)
                }
              >
                {f}
              </Pill>
            ))}
          </div>

          <div className="date-range">
            📅 {d.dateRange}
          </div>
        </div>
      </div>

      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Valor</th>
            </tr>
          </thead>

          <tbody>
            {d.rows.map((row, i) => (
              <tr key={i}>
                <td>{row.data}</td>

                <td>
                  <div className="cliente-box">
                    <div
                      className={`cliente-avatar avatar-${row.av}`}
                    >
                      {row.av}
                    </div>

                    {row.cliente}
                  </div>
                </td>

                <td>{row.servico}</td>

                <td>
                  <span className="valor-pill">
                    R$ {row.valor}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    {showExport && (
  <ModalExport
    onClose={() =>
      setShowExport(false)
    }
  />
)}
    </main>
  );
}

export default function Financeiro() {
  
  const [page, setPage] =
    useState("painel");

  const [dados, setDados] =
    useState(DADOS);

  return (
    <div className="app">
      <Sidebar />

      {page === "painel" ? (
        <Painel
  dados={dados}
  setDados={setDados}
  onVerReceita={() =>
    setPage("receita")
  }
/>
      ) : (
        <Receita
  dados={dados}
  onVoltar={() =>
    setPage("painel")
  }
/>
      )}
    </div>
  );
}
