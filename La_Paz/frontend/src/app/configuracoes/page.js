"use client";

import { useState } from "react";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import toast from "react-hot-toast";

const pageStyle = {
  minHeight: "100vh",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  marginLeft: 220,
};

const mainStyle = {
  maxWidth: 700,
  margin: "40px auto",
  display: "flex",
  flexDirection: "column",
  gap: 40,
  padding: "0 20px 40px 20px",
  color: "var(--color-text)",
};

const sectionStyle = {
  padding: 20,
  border: "1px solid var(--color-border-light)",
  borderRadius: 8,
  background: "var(--color-bg-alt)",
  color: "var(--color-text)",
  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.18)",
};

const dangerSectionStyle = {
  padding: 20,
  border: "1px solid #ef4444",
  borderRadius: 8,
  background: "rgba(239, 68, 68, 0.10)",
  color: "var(--color-text)",
  boxShadow: "0 8px 28px rgba(0, 0, 0, 0.18)",
};

const labelStyle = {
  fontWeight: "bold",
  color: "var(--color-text)",
  display: "block",
  marginBottom: 6,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 20,
  borderRadius: 6,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  outline: "none",
};

const primaryButtonStyle = {
  padding: "10px 20px",
  background: "var(--color-primary-dark)",
  color: "#fff",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const dangerButtonStyle = {
  padding: "10px 20px",
  background: "#d93025",
  color: "#fff",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

export default function ConfiguracoesPage() {
  const [nome, setNome] = useState("Seu Nome Atual");
  const [descricao, setDescricao] = useState("Sua descrição atual");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  function handleSaveProfile() {
    console.log("Salvar nome + descrição", { nome, descricao });
    toast.success("Perfil atualizado com sucesso!");
  }

  function handleChangePassword() {
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }

    console.log("Alterar senha", { senhaAtual, novaSenha });
    toast.success("Senha atualizada com sucesso!");

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  function handleDeleteAccount() {
    if (
      window.confirm(
        "Tem certeza que deseja excluir sua conta? Esta ação é irreversível!"
      )
    ) {
      console.log("Conta excluída");
      toast.success("Conta excluída com sucesso!");
    }
  }

  return (
    <>
      <Navigation />

      <div style={pageStyle}>
        <MenuBar />

        <main style={mainStyle}>
          <section style={sectionStyle}>
            <h2 style={{ marginBottom: 20, color: "var(--color-text)" }}>
              Editar Perfil
            </h2>

            <label style={labelStyle}>Nome:</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />

            <button onClick={handleSaveProfile} style={primaryButtonStyle}>
              Salvar Alterações
            </button>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ marginBottom: 20, color: "var(--color-text)" }}>
              Alterar Senha
            </h2>

            <label style={labelStyle}>Senha Atual:</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Nova Senha:</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Confirmar Nova Senha:</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              style={inputStyle}
            />

            <button onClick={handleChangePassword} style={primaryButtonStyle}>
              Atualizar Senha
            </button>
          </section>

          <section style={dangerSectionStyle}>
            <h2 style={{ color: "#f87171", marginBottom: 12 }}>
              Excluir Conta
            </h2>

            <p style={{ marginBottom: 20, color: "var(--color-text)" }}>
              Esta ação é permanente e não poderá ser desfeita.
            </p>

            <button onClick={handleDeleteAccount} style={dangerButtonStyle}>
              Excluir Conta
            </button>
          </section>
        </main>
      </div>
    </>
  );
}