"use client";

import { useState } from "react";
import styles from "./menuBar.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function MenuBar({ hasNotification }) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleOpenLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleConfirmLogout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
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
            onClick={handleOpenLogoutConfirm}
            title="Sair do sistema"
            aria-label="Sair do sistema"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {showLogoutConfirm && (
        <div className={styles.logoutConfirmOverlay}>
          <div className={styles.logoutConfirmBox}>
            <h2 className={styles.logoutConfirmTitle}>Confirmar saída</h2>

            <p className={styles.logoutConfirmText}>
              Tem certeza que deseja sair do sistema?
            </p>

            <div className={styles.logoutConfirmActions}>
              <button
                type="button"
                className={styles.logoutCancelButton}
                onClick={handleCancelLogout}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={styles.logoutConfirmButton}
                onClick={handleConfirmLogout}
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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