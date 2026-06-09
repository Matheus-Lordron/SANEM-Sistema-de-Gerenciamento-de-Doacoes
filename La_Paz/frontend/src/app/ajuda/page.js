"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";

const duvidas = [
  {
    pergunta: "Onde posso realizar cadastros?",
    resposta:
      "Você pode realizar cadastros acessando o menu principal e selecionando a opção de cadastro desejada.",
  },
  {
    pergunta: "Errei um dado e o cadastrei no sistema, o que fazer?",
    resposta:
      "Procure a opção de edição ou exclusão do cadastro na tela correspondente. Caso não encontre, entre em contato com o suporte.",
  },
];

export default function AjudaPage() {
  const [abertas, setAbertas] = useState(Array(duvidas.length).fill(false));
  const [novaDuvida, setNovaDuvida] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [showMensagem, setShowMensagem] = useState(false);

  const router = useRouter();

  const toggleDuvida = (idx) => {
    setAbertas((prev) =>
      prev.map((open, i) => (i === idx ? !open : open))
    );
  };

  const handleEnviar = () => {
    if (novaDuvida.trim() !== "") {
      setMensagem("Dúvida registrada, logo responderemos.");
      setNovaDuvida("");
      setShowMensagem(true);
      setTimeout(() => setShowMensagem(false), 4000);
    }
  };

  const handleCloseMensagem = () => {
    setShowMensagem(false);
  };

  const handleAcompanhar = () => {
    router.push("/acompanheduvidas");
  };

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
            justifyContent: "center",
            minHeight: "calc(100vh - 56px)",
            background: "var(--color-bg)",
            color: "var(--color-text)",
            padding: "40px 20px",
          }}
        >
          <h1
            style={{
              marginBottom: 32,
              textAlign: "center",
              width: "100%",
              color: "var(--color-text)",
            }}
          >
            Qual a sua dúvida?
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: 500,
            }}
          >
            <h2
              style={{
                marginBottom: 12,
                textAlign: "left",
                color: "var(--color-text)",
              }}
            >
              Dúvidas frequentes
            </h2>

            <ul
              style={{
                textAlign: "left",
                marginBottom: 32,
                width: "100%",
                padding: 0,
                listStyle: "none",
              }}
            >
              {duvidas.map((duvida, idx) => (
                <li
                  key={duvida.pergunta}
                  style={{
                    marginBottom: 16,
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: 8,
                  }}
                >
                  <button
                    onClick={() => toggleDuvida(idx)}
                    style={{
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      width: "100%",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      fontSize: 16,
                      cursor: "pointer",
                      padding: 0,
                      outline: "none",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        color: "var(--color-text)",
                        fontWeight: 600,
                      }}
                    >
                      {duvida.pergunta}
                    </span>

                    <span
                      style={{
                        marginLeft: 8,
                        color: "var(--color-text)",
                        transition: "transform 0.2s",
                        transform: abertas[idx]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </span>
                  </button>

                  {abertas[idx] && (
                    <div
                      style={{
                        marginTop: 8,
                        color: "var(--color-text-light)",
                        fontSize: 15,
                        lineHeight: 1.5,
                      }}
                    >
                      {duvida.resposta}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div style={{ width: "100%", marginTop: 20 }}>
              <h2
                style={{
                  fontSize: 20,
                  marginBottom: 12,
                  color: "var(--color-text)",
                }}
              >
                Nos mande a sua dúvida
              </h2>

              <textarea
                placeholder="Digite aqui a sua dúvida"
                value={novaDuvida}
                onChange={(e) => setNovaDuvida(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: 80,
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  padding: 12,
                  fontSize: 16,
                  resize: "vertical",
                  background: "var(--color-bg-alt)",
                  color: "var(--color-text)",
                  opacity: 0.95,
                  outline: "none",
                }}
              />

              <button
                onClick={handleEnviar}
                style={{
                  marginTop: 12,
                  padding: "10px 24px",
                  borderRadius: 6,
                  border: "none",
                  background: "var(--color-primary-dark)",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Enviar
              </button>
            </div>

            <div style={{ width: "100%", margin: "32px 0 0 0" }}>
              <button
                onClick={handleAcompanhar}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 6,
                  border: "1px solid var(--color-primary)",
                  background: "rgba(78, 161, 255, 0.10)",
                  color: "var(--color-primary)",
                  fontSize: 16,
                  cursor: "pointer",
                  fontWeight: 500,
                  marginBottom: 12,
                }}
              >
                Acompanhe suas dúvidas
              </button>
            </div>
          </div>

          {showMensagem && (
            <div
              style={{
                position: "fixed",
                top: 40,
                left: 0,
                right: 0,
                margin: "0 auto",
                width: 320,
                background: "var(--color-bg-alt)",
                border: "1px solid var(--color-primary)",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                padding: "20px 32px 20px 20px",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "var(--color-primary)",
                  fontSize: 16,
                }}
              >
                {mensagem}
              </span>

              <button
                onClick={handleCloseMensagem}
                style={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  fontSize: 18,
                  color: "var(--color-primary)",
                  cursor: "pointer",
                  marginLeft: 16,
                  fontWeight: "bold",
                  lineHeight: 1,
                  padding: 0,
                }}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}