"use client"; // 🚀 Necessário no Next.js para usar eventos (onClick) e Hooks (useRouter)

import styles from './menuBar.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 🚀 Importado o roteador do Next.js

export default function MenuBar({ hasNotification }) {
  const router = useRouter(); // 🚀 Inicializa o roteador

  // 🚪 Função para limpar os tokens e sair do sistema
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    router.push("/"); // 🚀 Mude para "/login" se a sua rota de login não for a "/"
  };

  return (
    <header className={styles.menuBar}>
      <div className={styles.rightSection}>
        <div className={styles.userInfo}>
          <UserIcon />
          <span className={styles.userName}>Fulano da Silva</span>
          <span className={styles.arrowDown}>▼</span>
        </div>
        
        <div className={styles.iconWrapper} style={{ position: 'relative' }}>
        </div>
        
        {/* 🚀 Adicionado o onClick e o cursor para mostrar que é clicável */}
        <div 
          className={styles.iconWrapper} 
          onClick={handleLogout} 
          style={{ cursor: 'pointer' }} 
          title="Sair do sistema"
        >
          <LogoutIcon />
        </div>
      </div>
    </header>
  );
}

function UserIcon() {
    return (
        <Image
            src="/user-icon.png"
            alt="User"
            width={24}
            height={24}
            style={{ marginRight: 12 }}
        />
    );
}

function LogoutIcon() {
    return (
        <Image
            src="/logout-icon.png"
            alt="Logout"
            width={24}
            height={24}
            style={{ marginRight: 12 }}
        />
    );
}