"use client";

import { useEffect, useRef, useState } from "react";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import ReportFilters from "./ReportFilters";
import ReportView from "./ReportView";
import { fetchDonations, exportElementToPdf } from "./reportClient";

export default function RelatoriosPage() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    donor: "",
    receiver: "",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reportRef = useRef();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchDonations(filters);
        setData(res);
      } catch (err) {
        setError(err.message || "Erro ao carregar doações");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [filters]);

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
            padding: "32px 24px 40px 24px",
            minHeight: "calc(100vh - 56px)",
            background: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          <h1
            style={{
              color: "var(--color-primary)",
              marginBottom: 24,
              fontWeight: 800,
            }}
          >
            Relatórios de Doações
          </h1>

          <ReportFilters onApply={(f) => setFilters(f)} initial={filters} />

          <div style={{ marginTop: 16, marginBottom: 16 }}>
            <button
              onClick={() =>
                exportElementToPdf(reportRef.current, "relatorio-doacoes.pdf")
              }
              style={{
                background: "var(--color-primary-dark)",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Exportar para PDF
            </button>
          </div>

          {loading && (
            <p style={{ color: "var(--color-text-light)" }}>Carregando...</p>
          )}

          {error && (
            <p style={{ color: "#f87171", fontWeight: 600 }}>{error}</p>
          )}

          <div style={{ marginTop: 16 }}>
            <ReportView ref={reportRef} data={data} />
          </div>
        </main>
      </div>
    </>
  );
}