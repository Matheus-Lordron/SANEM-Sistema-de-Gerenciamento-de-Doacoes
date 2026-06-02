"use client";

import Image from "next/image";
import { useState } from "react"; // 💡 Removi o useEffect daqui
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { login } from "../lib/api"; // 💡 Se não for usar o getStoredToken aqui, pode remover o import dele

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ❌ O bloco do "useEffect" que estava aqui foi removido!
  // Agora o Next.js nunca vai pular essa tela sozinho.

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    if (error) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(form);
      const token = response?.token;

      if (!token) {
        setError("Credenciais inválidas. Não foi possível gerar o acesso.");
        setIsSubmitting(false);
        return;
      }

      router.push("/home");
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) {
        setError("Usuário ou senha incorretos.");
      } else if (requestError.status === 404) {
        setError("Endpoint de login não encontrado em /api/auth/login.");
      } else {
        setError(requestError.message || "Servidor indisponível no momento.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <Image src="/logo-sanem.svg" alt="Logo SANEM" width={120} height={120} className={styles.logo} />
        </div>
        <h2 className={styles.loginTitle}>Login</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="E-mail"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={isSubmitting}
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Senha"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={isSubmitting}
          />
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Login"}
          </button>
        </form>
        
        {error && <div className={styles.errorMsg}>{error}</div>}
        
        <a href="#" className={styles.forgot}>Esqueci minha senha</a>
      </div>
    </div>
  );
}
