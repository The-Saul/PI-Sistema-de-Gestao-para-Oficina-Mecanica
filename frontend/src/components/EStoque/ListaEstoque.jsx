import React from "react";

function Box({ title, children, alert }) {
  return (
    <div className={`box ${alert ? "alert" : ""}`}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

const LIMITE_ESTOQUE = 5;

export default function ListaEstoque({ produtos, historico }) {
  // 🔴 últimas retiradas (3)
  const saidasRecentes = historico.slice(0, 3);

  // 🟢 últimos produtos adicionados (3)
  const entradasRecentes = [...produtos].slice(-3).reverse();

  // ⚠️ produtos com estoque baixo
  const estoqueBaixo = produtos.filter(
    (p) => Number(p.quantidade) <= LIMITE_ESTOQUE
  );

  return (
    <section className="list">
      
      {/* 🔴 SAÍDA RECENTE */}
      <Box title="Saída recente">
        {saidasRecentes.length === 0 ? (
          <p>Nenhuma saída registrada</p>
        ) : (
          saidasRecentes.map((h) => (
            <p key={h.id}>
              QTD: {h.quantidade} | FUNC: {h.funcionario || "-"}
            </p>
          ))
        )}
      </Box>

      {/* 🟢 ENTRADA RECENTE */}
      <Box title="Entrada recente">
        {entradasRecentes.length === 0 ? (
          <p>Nenhuma entrada registrada</p>
        ) : (
          entradasRecentes.map((p) => (
            <p key={p.id}>
              QTD: {p.quantidade} | FORN: {p.fornecedor || "-"}
            </p>
          ))
        )}
      </Box>

      {/* ⚠️ ESTOQUE BAIXO */}
      <Box title="Estoque Baixo" alert>
        {estoqueBaixo.length === 0 ? (
          <p>Sem produtos críticos</p>
        ) : (
          estoqueBaixo.map((p) => (
            <p key={p.id}>
              {p.peca} | QTD: {p.quantidade}
            </p>
          ))
        )}
      </Box>
    </section>
  );
}