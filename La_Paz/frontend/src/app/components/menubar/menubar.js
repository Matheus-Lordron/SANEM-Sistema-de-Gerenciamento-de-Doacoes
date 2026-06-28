"use client";

import { useState, useEffect } from "react";
import styles from "./menuBar.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";

// Importa o cliente do Supabase
import { createClient } from "../../../utils/supabase/client";

// ... (MANTENHA A CONSTANTE searchItems E normalizeText EXATAMENTE COMO ESTAVAM) ...
const searchItems = [
  { title: "Home", description: "Página inicial do sistema", path: "/home", keywords: "inicio inicial principal menu" },
  { title: "Dashboard", description: "Resumo geral, gráficos e indicadores", path: "/dashboard", keywords: "painel graficos indicadores resumo dados" },
  { title: "Estoque", description: "Controle de produtos, itens e quantidades", path: "/estoque", keywords: "produto produtos quantidade item itens critico alimentos roupas" },
  { title: "Cadastro de Doador", description: "Cadastrar uma nova pessoa doadora", path: "/cadastrodoador", keywords: "doador doadores doar doacao doações cadastro pessoa" },
  { title: "Cadastro de Voluntário", description: "Cadastrar uma nova pessoa voluntária", path: "/cadastrovoluntario", keywords: "voluntario voluntários voluntaria voluntárias cadastro ajuda" },
  { title: "Relatórios", description: "Visualizar e exportar relatórios do sistema", path: "/relatorios", keywords: "relatorio relatorios pdf exportar filtros dados" },
  { title: "Usuários", description: "Gerenciamento de usuários do sistema", path: "/usuarios", keywords: "usuario usuarios acesso permissao conta pessoas" },
  { title: "Configurações", description: "Preferências e ajustes do sistema", path: "/configuracoes", keywords: "configuracao configuracoes tema senha perfil ajustes" },
  { title: "Ajuda", description: "Tela de suporte e dúvidas", path: "/ajuda", keywords: "suporte duvida duvidas faq atendimento contato" },
];

function normalizeText(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function MenuBar({ hasNotification }) {
  const router = useRouter();
  const supabase = createClient(); // Instancia o Supabase

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  
  // Estado para armazenar o nome do usuário logado
  const [userName, setUserName] = useState("Carregando...");

  // Busca o usuário logado ao carregar o componente
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const displayName = user.user_metadata?.name || user.email.split('@')[0];
        setUserName(displayName);
      } else {
        setUserName("Usuário");
      }
    }
    loadUser();
  }, []);

  const filteredSearchItems = searchItems
    .filter((item) => {
      const search = normalizeText(searchTerm.trim());
      if (!search) return false;
      const content = normalizeText(`${item.title} ${item.description} ${item.keywords}`);
      return content.includes(search);
    })
    .slice(0, 6);

  const handleOpenLogoutConfirm = () => setShowLogoutConfirm(true);
  const handleCancelLogout = () => setShowLogoutConfirm(false);

  // LOGOUT CORRIGIDO PARA O SUPABASE
  const handleConfirmLogout = async () => {
    await supabase.auth.signOut(); // Desloga do Supabase limpando os cookies
    router.push("/");
  };

  const handleSelectSearchItem = (path) => {
    setSearchTerm("");
    setShowSearchResults(false);
    setSearchMessage("");
    router.push(path);
  };

  const removePageSearchHighlights = () => {
    document.querySelectorAll(`.${styles.pageSearchHighlight}`).forEach((element) => {
      element.classList.remove(styles.pageSearchHighlight);
    });
  };

  const handleSearchCurrentPage = () => {
    const query = searchTerm.trim();
    if (!query) return;

    removePageSearchHighlights();
    const normalizedQuery = normalizeText(query);
    const elements = Array.from(
      document.querySelectorAll(
        "main h1, main h2, main h3, main h4, main p, main span, main li, main label, main td, main th, main button, main div"
      )
    );

    const foundElement = elements.find((element) => {
      if (element.closest("header") || element.closest("nav")) return false;
      const text = normalizeText(element.innerText || element.textContent || "");
      return text.includes(normalizedQuery);
    });

    if (!foundElement) {
      setSearchMessage(`Nenhum resultado encontrado para "${query}".`);
      setShowSearchResults(true);
      return;
    }

    foundElement.scrollIntoView({ behavior: "smooth", block: "center" });
    foundElement.classList.add(styles.pageSearchHighlight);
    setSearchMessage(`Resultado encontrado na página atual.`);
    setShowSearchResults(true);

    setTimeout(() => {
      foundElement.classList.remove(styles.pageSearchHighlight);
    }, 3000);
  };

  const handleSubmitSearch = (event) => {
    event.preventDefault();
    if (filteredSearchItems.length > 0) {
      handleSelectSearchItem(filteredSearchItems[0].path);
      return;
    }
    handleSearchCurrentPage();
  };

  return (
    <>
      <header className={styles.menuBar}>
        <div className={styles.rightSection}>
          <form className={styles.searchContainer} onSubmit={handleSubmitSearch}>
            <div className={styles.searchInputWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Pesquisar no sistema..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSearchMessage("");
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                aria-label="Pesquisar no sistema"
              />
              {searchTerm && (
                <button
                  type="button"
                  className={styles.clearSearchButton}
                  onClick={() => {
                    setSearchTerm("");
                    setSearchMessage("");
                    removePageSearchHighlights();
                  }}
                  aria-label="Limpar pesquisa"
                >
                  ×
                </button>
              )}
            </div>

            {showSearchResults && searchTerm.trim() && (
              <div className={styles.searchDropdown}>
                {filteredSearchItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className={styles.searchResultItem}
                    onClick={() => handleSelectSearchItem(item.path)}
                  >
                    <span className={styles.searchResultTitle}>{item.title}</span>
                    <span className={styles.searchResultDescription}>{item.description}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.searchCurrentPageButton}
                  onClick={handleSearchCurrentPage}
                >
                  Buscar "{searchTerm}" na página atual
                </button>
                {searchMessage && <p className={styles.searchMessage}>{searchMessage}</p>}
              </div>
            )}
          </form>

          <div className={styles.userInfo}>
            <UserIcon />
            {/* O nome do usuário dinâmico entra aqui */}
            <span className={styles.userName}>{userName}</span>
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
            <p className={styles.logoutConfirmText}>Tem certeza que deseja sair do sistema?</p>
            <div className={styles.logoutConfirmActions}>
              <button type="button" className={styles.logoutCancelButton} onClick={handleCancelLogout}>
                Cancelar
              </button>
              <button type="button" className={styles.logoutConfirmButton} onClick={handleConfirmLogout}>
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
    <Image src="/user-icon.png" alt="User" width={24} height={24} style={{ marginRight: 12 }} />
  );
}