"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { getStoredToken, login } from "../lib/api";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getStoredToken()) {
      router.replace("/home");
    }
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { token } = await login(form);

      if (!token) {
        console.warn("A resposta de login nao trouxe um token reconhecido.");
      }

      router.push("/home");
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) {
        setError("Usuario ou senha incorretos.");
      } else if (requestError.status === 404) {
        setError("Endpoint de login nao encontrado em /api/auth/login.");
      } else {
        setError(requestError.message || "Servidor indisponivel no momento.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.loginBox}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo-sanem.svg"
            alt="Logo SANEM"
            width={120}
            height={120}
            className={styles.logo}
          />
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
        <a href="#" className={styles.forgot}>
          Esqueci minha senha
        </a>
      </div>
    </div>
  );
}
