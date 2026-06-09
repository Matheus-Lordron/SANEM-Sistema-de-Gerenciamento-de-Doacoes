"use client";

export default function UserCard({ user }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        border: "1px solid var(--color-border-light)",
        borderRadius: "8px",
        padding: "14px",
        marginBottom: "12px",
        background: "var(--color-bg-alt)",
        color: "var(--color-text)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.18)",
      }}
    >
      <h3
        style={{
          margin: "0 0 6px 0",
          color: "var(--color-text)",
          fontWeight: 700,
        }}
      >
        {user.name}
      </h3>

      <p
        style={{
          margin: 0,
          color: "var(--color-text-light)",
        }}
      >
        {user.email}
      </p>
    </div>
  );
}