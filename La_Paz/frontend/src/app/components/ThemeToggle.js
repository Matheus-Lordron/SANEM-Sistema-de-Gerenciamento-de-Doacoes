"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita erro de hidratação garantindo que o componente só renderize no cliente
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "55px",
        height: "55px",
        borderRadius: "50%",
        background: "var(--color-primary)",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 9999, // Garante que fique por cima de tudo
        transition: "transform 0.2s ease, background 0.2s ease"
      }}
      title="Alternar Tema"
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      {/* Troca o ícone dependendo do tema ativo */}
      {theme === "dark" ? <FaSun color="#fff" /> : <FaMoon color="#fff" />}
    </button>
  );
}