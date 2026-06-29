import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast'; 
import { ThemeProvider } from "./components/ThemeProvider"; 
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ✅ adicionado
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // ✅ adicionado
});

export const metadata = {
  title: "Sanem",
  description: "Doações Podem Mudar Vidas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning> 
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster position="top-right" /> 
          <ThemeToggle /> 
        </ThemeProvider>
        
      </body>
    </html>
  );
}