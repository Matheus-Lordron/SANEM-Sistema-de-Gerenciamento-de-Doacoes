"use client";

import { useState } from "react";

const inputStyle = {
  marginLeft: 6,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-alt)",
  color: "var(--color-text)",
  outline: "none",
};

const labelStyle = {
  color: "var(--color-text)",
  fontWeight: 600,
};

export default function ReportFilters({ onApply, initial = {} }) {
  const [from, setFrom] = useState(initial.from || "");
  const [to, setTo] = useState(initial.to || "");
  const [donor, setDonor] = useState(initial.donor || "");
  const [receiver, setReceiver] = useState(initial.receiver || "");

  function apply() {
    onApply({ from, to, donor, receiver });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
        background: "var(--color-bg-alt)",
        color: "var(--color-text)",
        border: "1px solid var(--color-border-light)",
        borderRadius: 10,
        padding: 16,
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.18)",
      }}
    >
      <label style={labelStyle}>
        De:
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Até:
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Doador:
        <input
          value={donor}
          onChange={(e) => setDonor(e.target.value)}
          placeholder="nome"
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Beneficiário:
        <input
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="nome"
          style={inputStyle}
        />
      </label>

      <button
        onClick={apply}
        style={{
          background: "var(--color-primary-dark)",
          color: "#ffffff",
          border: "none",
          borderRadius: 8,
          padding: "10px 18px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Aplicar
      </button>
    </div>
  );
}