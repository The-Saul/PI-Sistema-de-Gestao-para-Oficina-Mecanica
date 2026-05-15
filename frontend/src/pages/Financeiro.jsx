// Financeiro.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../Financeiro.css";

const DADOS = {
  Mensal: {
    dateRange: "01/10/2023 – 31/10/2023",
    total: "R$ 29.500",

    rows: [],
  },

  Trimestral: {
    dateRange: "01/08/2023 – 31/10/2023",
    total: "R$ 84.200",

    rows: [],
  },

  Anual: {
    dateRange: "01/01/2023 – 31/12/2023",
    total: "R$ 312.750",

    rows: [],
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
  <option disabled value="">
    Selecione o serviço
  </option>

  <option>
    Troca de óleo
  </option>

  <option>
    Alinhamento
  </option>

  <option>
    Balanceamento
  </option>

  <option>
    Revisão completa
  </option>

  <option>
    Troca de pneus
  </option>

  <option>
    Suspensão
  </option>

  <option>
    Freios
  </option>

  <option>
    Motor
  </option>

  <option>
    Injeção eletrônica
  </option>

  <option>
    Embreagem
  </option>

  <option>
    Ar-condicionado
  </option>

  <option>
    Diagnóstico eletrônico
  </option>

  <option>
    Bateria
  </option>

  <option>
    Lanternagem
  </option>

  <option>
    Pintura
  </option>

  <option>
    Venda de peças
  </option>

  <option>
    Acessórios automotivos
  </option>
</select>
          </div>

          <div>
  <Label>Valor</Label>

  <div className="input-money">
    <span>R$</span>

    <input
      type="number"
      className="input money-field"
      placeholder="0,00"
      min="0"
      value={valor}
      onChange={(e) =>
        setValor(
          e.target.value
        )
      }
    />
  </div>
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

        <div className="observacoes-box">
  <Label>Observações</Label>

  <textarea
    className="input textarea"
    placeholder="Digite observações sobre a venda..."
  />
</div>

        <div className="modal-actions">
          <Btn onClick={onClose}>
            Cancelar
          </Btn>

          <Btn
  onClick={() => {

    if (
      !cliente ||
      !servico ||
      !valor ||
      !data
    ) {
      alert(
        "Preencha todos os campos."
      );

      return;
    }

    if (valor <= 0) {
      alert(
        "O valor deve ser maior que 0."
      );

      return;
    }

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

  Trimestral: {
    ...prev.Trimestral,

    rows: [
      ...prev.Trimestral.rows,
      novaVenda,
    ],
  },

  Anual: {
    ...prev.Anual,

    rows: [
      ...prev.Anual.rows,
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

function ModalOS({
  onClose,
  setDados,
}) {

  const [cliente, setCliente] =
    useState("");

  const [marca, setMarca] =
    useState("");

  const [modelo, setModelo] =
    useState("");

  const [placa, setPlaca] =
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
        <h2>
          Nova Ordem de Serviço
        </h2>

        <div className="modal-form">

          <div>
            <Label>Cliente</Label>

            <input
              type="text"
              className="input"
              placeholder="Nome do cliente"
              value={cliente}
              onChange={(e) =>
                setCliente(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <Label>Marca</Label>

            <input
              type="text"
              className="input"
              placeholder="Ex: BMW"
              value={marca}
              onChange={(e) =>
                setMarca(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <Label>Modelo</Label>

            <input
              type="text"
              className="input"
              placeholder="Ex: BMW 320i"
              value={modelo}
              onChange={(e) =>
                setModelo(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <Label>Placa</Label>

            <input
              type="text"
              className="input"
              placeholder="ABC-1234"
              maxLength={8}
              value={placa}
              onChange={(e) =>
                setPlaca(
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
              <option
                disabled
                value=""
              >
                Selecione o serviço
              </option>

              <option>
                Troca de óleo
              </option>

              <option>
                Alinhamento
              </option>

              <option>
                Balanceamento
              </option>

              <option>
                Revisão completa
              </option>

              <option>
                Troca de pneus
              </option>

              <option>
                Suspensão
              </option>

              <option>
                Freios
              </option>

              <option>
                Motor
              </option>

              <option>
                Injeção eletrônica
              </option>

              <option>
                Embreagem
              </option>

              <option>
                Ar-condicionado
              </option>

              <option>
                Diagnóstico eletrônico
              </option>

              <option>
                Bateria
              </option>

              <option>
                Lanternagem
              </option>

              <option>
                Pintura
              </option>
            </select>
          </div>

          <div>
            <Label>Valor</Label>

            <div className="input-money">
              <span>R$</span>

              <input
                type="number"
                className="input money-field"
                placeholder="0,00"
                min="0"
                value={valor}
                onChange={(e) =>
                  setValor(
                    e.target.value
                  )
                }
              />
            </div>
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

          <Btn
  onClick={() => {

    if (
      !cliente ||
      !marca ||
      !modelo ||
      !placa ||
      !servico ||
      !valor ||
      !data
    ) {
      alert(
        "Preencha todos os campos."
      );

      return;
    }

    if (valor <= 0) {
      alert(
        "O valor deve ser maior que 0."
      );

      return;
    }

    if (placa.length < 7) {
      alert(
        "Digite uma placa válida."
      );

      return;
    }

    const novaOS = {
      data,

      av:
        cliente.charAt(0) ||
        "C",

      cliente,

      servico:
        `${servico} - ${marca} ${modelo}`,

      valor,
    };

    setDados((prev) => ({
      ...prev,

      Mensal: {
        ...prev.Mensal,

        rows: [
          ...prev.Mensal.rows,

          novaOS,
        ],
      },
    }));

    onClose();
  }}
>
  Salvar OS
</Btn>

        </div>
      </div>
    </div>
  );
}

function ModalEntrada({
  onClose,
  setDados,
}) {

  const [fornecedor, setFornecedor] =
  useState("");

const [produto, setProduto] =
  useState("");

const [quantidade, setQuantidade] =
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
        <h2>Nova Entrada</h2>

        <div>
  <Label>Fornecedor</Label>

  <input
    className="input"
    value={fornecedor}
    onChange={(e) =>
      setFornecedor(
        e.target.value
      )
    }
  />
</div>

<div>
  <Label>Produto</Label>

  <select
    className="input"
    value={produto}
    onChange={(e) =>
      setProduto(
        e.target.value
      )
    }
  >
    <option
      disabled
      value=""
    >
      Selecione o produto
    </option>

    <option>
      Óleo de motor
    </option>

    <option>
      Filtro de óleo
    </option>

    <option>
      Filtro de ar
    </option>

    <option>
      Pastilha de freio
    </option>

    <option>
      Disco de freio
    </option>

    <option>
      Pneu
    </option>

    <option>
      Bateria
    </option>

    <option>
      Velas de ignição
    </option>

    <option>
      Correia dentada
    </option>

    <option>
      Amortecedor
    </option>

    <option>
      Radiador
    </option>

    <option>
      Fluido de freio
    </option>

    <option>
      Aditivo de radiador
    </option>

    <option>
      Palheta limpador
    </option>

    <option>
      Lâmpada automotiva
    </option>

    <option>
      Rolamento
    </option>

    <option>
      Embreagem
    </option>

    <option>
      Escapamento
    </option>

    <option>
      Sensor automotivo
    </option>
  </select>
</div>

<div>
  <Label>Quantidade</Label>

  <input
    type="number"
    className="input"
    value={quantidade}
    onChange={(e) =>
      setQuantidade(
        e.target.value
      )
    }
  />
</div>

<div>
  <Label>Valor</Label>

  <div className="input-money">
    <span>R$</span>

    <input
      type="number"
      className="input money-field"
      placeholder="0,00"
      min="0"
      value={valor}
      onChange={(e) =>
        setValor(
          e.target.value
        )
      }
    />
  </div>
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

        <div className="modal-actions">
          <Btn onClick={onClose}>
            Cancelar
          </Btn>

          <Btn
  onClick={() => {

    if (
      !fornecedor ||
      !produto ||
      !quantidade ||
      !valor ||
      !data
    ) {
      alert(
        "Preencha todos os campos."
      );

      return;
    }

    if (quantidade <= 0) {
      alert(
        "A quantidade deve ser maior que 0."
      );

      return;
    }

    if (valor <= 0) {
      alert(
        "O valor deve ser maior que 0."
      );

      return;
    }

    const novaEntrada = {
      data,

      av:
        fornecedor.charAt(0) ||
        "F",

      cliente:
        fornecedor,

      servico:
        `${produto} (${quantidade}x)`,

      valor,
    };

    setDados((prev) => ({
      ...prev,

      Mensal: {
        ...prev.Mensal,

        rows: [
          ...prev.Mensal.rows,

          novaEntrada,
        ],
      },
    }));

    onClose();
  }}
>
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
  setDados={setDados}
  onClose={() =>
    setShowOS(false)
  }
/>
      )}

      {showEntrada && (
  <ModalEntrada
    setDados={setDados}
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
  {row.cliente}
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
