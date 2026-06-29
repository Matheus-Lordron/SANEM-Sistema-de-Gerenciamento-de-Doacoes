"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { createClient } from "../utils/supabase/client";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (supabaseError) {
        setError("Usuário ou senha incorretos.");
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        router.push("/home");
        router.refresh(); 
      }
    } catch (err) {
      setError("Servidor indisponível no momento.");
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
        
        {/* Adicionado suppressHydrationWarning para evitar erro com extensões */}
        <form className={styles.loginForm} onSubmit={handleSubmit} suppressHydrationWarning>
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            className={styles.input}
            value={form.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            suppressHydrationWarning
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            className={styles.input}
            value={form.password}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            suppressHydrationWarning
          />
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Login"}
          </button>
        </form>
        {error && <div className={styles.errorMsg}>{error}</div>}
      </div>
    </div>
  );
}