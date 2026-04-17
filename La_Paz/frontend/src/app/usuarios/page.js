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
          setError("Voce precisa fazer login para visualizar os usuarios.");
        } else {
          setError(requestError.message || "Erro ao buscar usuarios.");
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
      <div style={{ minHeight: "100vh", background: "#fff", marginLeft: 220 }}>
        <MenuBar />
        <main
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "80vh",
            padding: "20px",
            width: "100%",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ color: "#0070f3", marginBottom: "20px" }}>Usuarios</h2>

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
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />

          {loading ? (
            <p>Carregando usuarios...</p>
          ) : error ? (
            <p style={{ color: "#c62828", textAlign: "center" }}>{error}</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <p>Nenhum usuario encontrado.</p>
          )}
        </main>
      </div>
    </>
  );
}
