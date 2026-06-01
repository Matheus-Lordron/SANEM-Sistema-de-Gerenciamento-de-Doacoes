"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  // Passamos todas as propriedades direto para o provedor oficial sem travar a montagem
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}