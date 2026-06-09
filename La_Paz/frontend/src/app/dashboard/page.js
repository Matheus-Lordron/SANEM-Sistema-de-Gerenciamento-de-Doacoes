"use client";

import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    people: 0,
    donations: 0,
    receivers: 0,
    items: 0,
    volunteers: 0,
    givers: 0,
  });

  const [recentActions, setRecentActions] = useState([]);
  const [chartData, setChartData] = useState([]);

  function getItemQuantity(item) {
    return (
      Number(
        item?.quantity ??
          item?.quantidade ??
          item?.qtd ??
          item?.qtde ??
          item?.unidades ??
          0
      ) || 0
    );
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const voluntarios = JSON.parse(
        localStorage.getItem("mockVoluntarios") || "[]"
      );
      const beneficiarios = JSON.parse(
        localStorage.getItem("mockBeneficiarios") || "[]"
      );
      const doadores = JSON.parse(
        localStorage.getItem("mockDoadores") || "[]"
      );
      const estoque = JSON.parse(localStorage.getItem("mockEstoque") || "[]");

      let doacoesRaw = [];

      try {
        doacoesRaw = JSON.parse(localStorage.getItem("mockDoacoes") || "[]");
      } catch {
        doacoesRaw = [];
      }

      const peopleCount =
        voluntarios.length + beneficiarios.length + doadores.length;

      const itemsUnits = (estoque || []).reduce(
        (acc, item) => acc + getItemQuantity(item),
        0
      );

      setStats({
        people: peopleCount,
        donations: doacoesRaw.length,
        receivers: beneficiarios.length,
        volunteers: voluntarios.length,
        givers: doadores.length,
        items: itemsUnits,
      });

      const doacoesNormalizadas = (doacoesRaw || [])
        .map((d) => ({
          user: d.user ?? d.nomeDoador ?? "Doador",
          action: d.action ?? "Doação registrada",
          date: normalizeDate(d),
        }))
        .sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        });

      setRecentActions(doacoesNormalizadas.slice(0, 3));

      const donationsForChart = doacoesNormalizadas.map((d) => ({
        date: d.date,
      }));

      setChartData(groupByMonth(donationsForChart, 12));
    } catch (err) {
      console.error("Erro ao ler dados do localStorage:", err);
    }
  }, []);

  return (
    <>
      <Navigation />

      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg)",
          color: "var(--color-text)",
          marginLeft: 220,
        }}
      >
        <MenuBar />

        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            background: "var(--color-bg)",
            color: "var(--color-text)",
            minHeight: "calc(100vh - 56px)",
          }}
        >
          <h2
            style={{
              color: "var(--color-text)",
              marginBottom: "30px",
              fontWeight: 800,
            }}
          >
            Dashboard
          </h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <Card title="Pessoas" value={stats.people} color="#0070f3" />
            <Card title="Doações" value={stats.donations} color="#10b981" />
            <Card title="Receptores" value={stats.receivers} color="#f59e0b" />
            <Card title="Voluntários" value={stats.volunteers} color="#ec4899" />
            <Card title="Doadores" value={stats.givers} color="#3b82f6" />
            <Card
              title="Unidades em Estoque"
              value={stats.items}
              color="#6366f1"
            />
          </div>

          <div
            style={{
              background: "var(--color-bg-alt)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border-light)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 8px 28px rgba(0, 0, 0, 0.18)",
              width: "100%",
              maxWidth: "800px",
              marginBottom: "40px",
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                color: "var(--color-text)",
                fontWeight: 700,
              }}
            >
              Gráfico de Doações últimos 12 meses
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="mes"
                  stroke="var(--color-text-light)"
                  tick={{ fill: "var(--color-text-light)" }}
                />
                <YAxis
                  stroke="var(--color-text-light)"
                  tick={{ fill: "var(--color-text-light)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-alt)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{
                    color: "var(--color-text)",
                  }}
                />
                <Bar dataKey="doacoes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              background: "var(--color-bg-alt)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border-light)",
              borderRadius: "12px",
              padding: "20px",
              width: "100%",
              maxWidth: "800px",
              boxShadow: "0 8px 28px rgba(0, 0, 0, 0.18)",
            }}
          >
            <h3
              style={{
                marginBottom: "15px",
                color: "var(--color-text)",
                fontWeight: 700,
              }}
            >
              Últimas Ações
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "var(--color-bg-alt)",
                color: "var(--color-text)",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid var(--color-border)",
                    background: "var(--color-primary-dark)",
                  }}
                >
                  <th style={{ padding: "10px", color: "#ffffff" }}>Usuário</th>
                  <th style={{ padding: "10px", color: "#ffffff" }}>Ação</th>
                  <th style={{ padding: "10px", color: "#ffffff" }}>Data</th>
                </tr>
              </thead>

              <tbody>
                {recentActions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "12px",
                        color: "var(--color-text-light)",
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      Sem registros recentes.
                    </td>
                  </tr>
                ) : (
                  recentActions.map((a, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: "1px solid var(--color-border-light)",
                        background:
                          index % 2 === 0
                            ? "var(--color-bg-alt)"
                            : "var(--color-bg)",
                      }}
                    >
                      <td style={{ padding: "10px", color: "var(--color-text)" }}>
                        {a.user ?? "—"}
                      </td>
                      <td style={{ padding: "10px", color: "var(--color-text)" }}>
                        {a.action ?? "—"}
                      </td>
                      <td style={{ padding: "10px", color: "var(--color-text)" }}>
                        {a.date ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}

function normalizeDate(d) {
  const raw = d?.date ?? d?.data ?? d?.createdAt ?? d?.created_at ?? null;

  if (!raw) return null;

  const dt = new Date(raw);

  if (isNaN(dt.getTime())) return null;

  return dt.toISOString();
}

function groupByMonth(donations, monthsBack = 4) {
  const fmt = new Intl.DateTimeFormat("pt-BR", { month: "short" });
  const now = new Date();
  const buckets = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    buckets.push({
      key,
      label: capitalize(fmt.format(d)),
      count: 0,
    });
  }

  (donations ?? []).forEach((don) => {
    if (!don?.date) return;

    const dt = new Date(don.date);

    if (isNaN(dt.getTime())) return;

    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    const b = buckets.find((x) => x.key === key);

    if (b) {
      b.count += 1;
    }
  });

  return buckets.map((b) => ({
    mes: b.label,
    doacoes: b.count,
  }));
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        borderRadius: "12px",
        padding: "20px 30px",
        minWidth: "200px",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.18)",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1.0)";
      }}
    >
      <h3
        style={{
          color: "#fff",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        {value}
      </p>
    </div>
  );
}