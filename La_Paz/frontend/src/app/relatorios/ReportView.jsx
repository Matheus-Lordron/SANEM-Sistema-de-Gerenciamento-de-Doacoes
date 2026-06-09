"use client";

import React from "react";
import PieChartBeneficiarios from "./PieChartBeneficiarios";

const thStyle = {
  border: "1px solid var(--color-border)",
  padding: 8,
  background: "var(--color-primary-dark)",
  color: "#ffffff",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid var(--color-border-light)",
  padding: 8,
  color: "var(--color-text)",
};

const ReportView = React.forwardRef(({ data = [] }, ref) => {
  const total = data.reduce((s, d) => s + (d.amount || 0), 0);

  const receivers = new Map();

  data.forEach((d) => {
    const r = (d.receiver || "—").trim();

    if (!receivers.has(r)) {
      receivers.set(r, { collected: false });
    }

    if (d.collected) {
      receivers.set(r, { collected: true });
    }
  });

  const totalReceivers = receivers.size;
  let collectedCount = 0;

  receivers.forEach((v) => {
    if (v.collected) {
      collectedCount++;
    }
  });

  const notCollectedCount = totalReceivers - collectedCount;

  return (
    <div
      ref={ref}
      style={{
        background: "var(--color-bg-alt)",
        color: "var(--color-text)",
        padding: 18,
        borderRadius: 10,
        border: "1px solid var(--color-border-light)",
        boxShadow: "0 8px 28px rgba(0, 0, 0, 0.12)",
        overflowX: "auto",
      }}
    >
      <h2
        style={{
          color: "var(--color-text)",
          marginBottom: 12,
        }}
      >
        Resumo
      </h2>

      <p
        style={{
          color: "var(--color-text-light)",
          marginBottom: 16,
        }}
      >
        Total de registros: {data.length} — Soma: R$ {total.toFixed(2)}
      </p>

      <div
        style={{
          marginBottom: 18,
          background: "var(--color-bg)",
          borderRadius: 10,
          padding: 12,
          border: "1px solid var(--color-border-light)",
        }}
      >
        <PieChartBeneficiarios
          collectedCount={collectedCount}
          notCollectedCount={notCollectedCount}
        />
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "var(--color-bg-alt)",
          color: "var(--color-text)",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Data</th>
            <th style={thStyle}>Doador</th>
            <th style={thStyle}>Beneficiário</th>
            <th style={thStyle}>Tipo</th>
            <th style={thStyle}>Valor</th>
            <th style={thStyle}>Retirado</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                style={{
                  ...tdStyle,
                  textAlign: "center",
                  color: "var(--color-text-light)",
                  padding: 24,
                  background: "var(--color-bg-alt)",
                }}
              >
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((d, i) => (
              <tr
                key={i}
                style={{
                  background:
                    i % 2 === 0
                      ? "var(--color-bg-alt)"
                      : "var(--color-bg)",
                }}
              >
                <td style={tdStyle}>{d.date || "-"}</td>
                <td style={tdStyle}>{d.donor || "-"}</td>
                <td style={tdStyle}>{d.receiver || "-"}</td>
                <td style={tdStyle}>{d.type || "-"}</td>
                <td style={tdStyle}>R$ {(d.amount || 0).toFixed(2)}</td>
                <td style={tdStyle}>{d.collected ? "Sim" : "Não"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

ReportView.displayName = "ReportView";

export default ReportView;