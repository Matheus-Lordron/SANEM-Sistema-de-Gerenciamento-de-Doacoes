"use client";

import styles from "./menuBar.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function MenuBar({ hasNotification }) {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <header className={styles.menuBar}>
      <div className={styles.rightSection}>
        <div className={styles.userInfo}>
          <UserIcon />
          <span className={styles.userName}>Fulano da Silva</span>
          <span className={styles.arrowDown}>▼</span>
        </div>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
          title="Sair do sistema"
          aria-label="Sair do sistema"
        >
          <FaSignOutAlt />
        </button>
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