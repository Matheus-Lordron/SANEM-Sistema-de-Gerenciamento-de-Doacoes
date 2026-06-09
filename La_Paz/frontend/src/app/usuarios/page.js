"use client";

import { useEffect, useState } from "react";
import Navigation from "../components/navegation/navegation";
import MenuBar from "../components/menubar/menubar";
import UserCard from "../components/UserCard";
import { apiFetch } from "../../lib/api";

function mapVoluntaryToUser(voluntary) {
  return {
    id: voluntary.id,
    name: voluntary.person?.name || "Sem nome",
    email: voluntary.person?.email || "Sem e-mail",
  };
}

export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch("/api/voluntaries", { auth: true });

        if (isMounted) {
          setUsers(Array.isArray(data) ? data.map(mapVoluntaryToUser) : []);
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        if (requestError.status === 401 || requestError.status === 403) {
          setError("Você precisa fazer login para visualizar os usuários.");
        } else {
          setError(requestError.message || "Erro ao buscar usuários.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

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
            justifyContent: "flex-start",
            minHeight: "calc(100vh - 56px)",
            padding: "32px 20px 40px 20px",
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
            background: "var(--color-bg)",
            color: "var(--color-text)",
          }}
        >
          <h2
            style={{
              color: "var(--color-primary)",
              marginBottom: "20px",
              fontWeight: 800,
            }}
          >
            Usuários
          </h2>

          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "400px",
              marginBottom: "20px",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              background: "var(--color-bg-alt)",
              color: "var(--color-text)",
              outline: "none",
            }}
          />

          {loading ? (
            <p style={{ color: "var(--color-text-light)" }}>
              Carregando usuários...
            </p>
          ) : error ? (
            <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <p style={{ color: "var(--color-text-light)" }}>
              Nenhum usuário encontrado.
            </p>
          )}
        </main>
      </div>
    </>
  );
}