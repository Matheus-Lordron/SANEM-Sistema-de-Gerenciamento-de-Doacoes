"use client";

import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import { mockEstoque as mockEstoqueOrig } from "../../mocks/mockEstoque";
import styles from "./estoque.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const STORAGE_KEY = "mockEstoque";

function getEstoqueStatus(quantidade) {
  if (quantidade <= 2) {
    return {
      label: "Crítico",
      color: "#f87171",
      border: "#ef4444",
      bg: "rgba(239, 68, 68, 0.10)",
      emoji: "🔴",
    };
  }

  if (quantidade <= 4) {
    return {
      label: "Alerta",
      color: "#fbbf24",
      border: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.12)",
      emoji: "🟠",
    };
  }

  if (quantidade <= 7) {
    return {
      label: "Atenção",
      color: "#fde047",
      border: "#eab308",
      bg: "rgba(234, 179, 8, 0.12)",
      emoji: "🟡",
    };
  }

  return {
    label: "OK",
    color: "#86efac",
    border: "#22c55e",
    bg: "rgba(34, 197, 94, 0.12)",
    emoji: "🟢",
  };
}

export default function EstoquePage() {
  const [mockEstoque, setMockEstoque] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoria: "",
    tamanho: "",
    quantidade: "",
  });
  const [editId, setEditId] = useState(null);
  const [editProduto, setEditProduto] = useState({
    nome: "",
    categoria: "",
    tamanho: "",
    quantidade: "",
  });
  const [filtroCritico, setFiltroCritico] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const hasNotification = false;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setMockEstoque(parsed);

          const criticos = parsed.filter((i) => i.quantidade <= 2);

          if (criticos.length > 0) {
            toast.error(`⚠️ ${criticos.length} produto(s) com estoque crítico!`, {
              duration: 5000,
            });
          }

          return;
        }
      }
    } catch (e) {
      console.error("Erro lendo estoque do localStorage:", e);
    }

    setMockEstoque(mockEstoqueOrig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockEstoqueOrig));
  }, []);

  function salvarNoStorage(updated) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function handleAddProduto(e) {
    e.preventDefault();

    const novo = {
      id: mockEstoque.length ? Math.max(...mockEstoque.map((i) => i.id)) + 1 : 1,
      ...novoProduto,
      quantidade: Number(novoProduto.quantidade),
    };

    const updated = [...mockEstoque, novo];

    setMockEstoque(updated);
    salvarNoStorage(updated);
    setNovoProduto({ nome: "", categoria: "", tamanho: "", quantidade: "" });
    setShowAddModal(false);

    toast.success("Produto adicionado com sucesso!");

    const status = getEstoqueStatus(novo.quantidade);

    if (status.label !== "OK") {
      toast(`${status.emoji} Produto adicionado com estoque ${status.label.toLowerCase()}!`, {
        duration: 4000,
      });
    }
  }

  function handleDeleteProduto() {
    const updated = mockEstoque.filter((item) => item.id !== itemToDelete.id);

    setMockEstoque(updated);
    salvarNoStorage(updated);
    setShowDeleteModal(false);
    setItemToDelete(null);

    toast.success("Produto excluído com sucesso!");
  }

  function openDeleteModal(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  function startEditProduto(item) {
    setEditId(item.id);
    setEditProduto({
      nome: item.nome,
      categoria: item.categoria,
      tamanho: item.tamanho,
      quantidade: item.quantidade,
    });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditProduto((prev) => ({
      ...prev,
      [name]: name === "quantidade" ? Number(value) : value,
    }));
  }

  function saveEditProduto(id) {
    const updated = mockEstoque.map((item) =>
      item.id === id ? { ...item, ...editProduto } : item
    );

    setMockEstoque(updated);
    salvarNoStorage(updated);
    setEditId(null);
    setEditProduto({ nome: "", categoria: "", tamanho: "", quantidade: "" });

    toast.success("Produto atualizado com sucesso!");

    const status = getEstoqueStatus(editProduto.quantidade);

    if (status.label !== "OK") {
      toast(`${status.emoji} Estoque ${status.label.toLowerCase()} após atualização!`, {
        duration: 4000,
      });
    }
  }

  function cancelEditProduto() {
    setEditId(null);
    setEditProduto({ nome: "", categoria: "", tamanho: "", quantidade: "" });
  }

  const listaExibida = mockEstoque.filter((item) => {
    const matchCritico = filtroCritico ? item.quantidade <= 4 : true;
    const searchLower = searchTerm.toLowerCase();

    const matchSearch =
      item.nome.toLowerCase().includes(searchLower) ||
      item.categoria.toLowerCase().includes(searchLower);

    return matchCritico && matchSearch;
  });

  const totalCriticos = mockEstoque.filter((i) => i.quantidade <= 2).length;
  const totalAlerta = mockEstoque.filter(
    (i) => i.quantidade > 2 && i.quantidade <= 4
  ).length;

  return (
    <>
      <Navigation />

      <div className={styles.container}>
        <MenuBar hasNotification={hasNotification} />

        <main className={styles.main}>
          <h1 className={styles.titulo}>Controle de Estoque</h1>

          <div
            style={{
              width: "100%",
              maxWidth: "1100px",
              margin: "0 auto 24px auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {totalCriticos > 0 && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.10)",
                    border: "1.5px solid #ef4444",
                    borderRadius: 10,
                    padding: "8px 16px",
                    color: "#f87171",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  🔴 {totalCriticos} produto(s) com estoque crítico
                </div>
              )}

              {totalAlerta > 0 && (
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.12)",
                    border: "1.5px solid #f59e0b",
                    borderRadius: 10,
                    padding: "8px 16px",
                    color: "#fbbf24",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  🟠 {totalAlerta} produto(s) em alerta
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />

              <button
                className={styles.btn}
                onClick={() => setFiltroCritico((v) => !v)}
                style={{
                  background: filtroCritico
                    ? "#c0392b"
                    : "rgba(239, 68, 68, 0.10)",
                  color: filtroCritico ? "#fff" : "#f87171",
                  border: "1.5px solid #ef4444",
                  fontWeight: 700,
                  padding: "10px 20px",
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                {filtroCritico ? "Ver Todos" : "🔴 Ver Críticos"}
              </button>

              <button
                className={`${styles.btn} ${styles.btnAdicionar}`}
                onClick={() => setShowAddModal(true)}
                style={{ margin: 0 }}
              >
                + Adicionar Produto
              </button>
            </div>
          </div>

          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Tamanho</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {listaExibida.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "30px",
                      color: "#9ca3af",
                      fontStyle: "italic",
                    }}
                  >
                    Nenhum produto encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                listaExibida.map((item) => {
                  const status = getEstoqueStatus(item.quantidade);

                  return (
                    <tr
                      key={item.id}
                      className={item.quantidade <= 2 ? styles.linhaCritica : ""}
                    >
                      <td>{item.id}</td>

                      {editId === item.id ? (
                        <>
                          <td>
                            <input
                              className={styles.formInput}
                              name="nome"
                              value={editProduto.nome}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>
                            <input
                              className={styles.formInput}
                              name="categoria"
                              value={editProduto.categoria}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>
                            <input
                              className={styles.formInput}
                              name="tamanho"
                              value={editProduto.tamanho}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>
                            <input
                              className={styles.formInput}
                              name="quantidade"
                              type="number"
                              min={0}
                              value={editProduto.quantidade}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>—</td>

                          <td>
                            <button
                              className={`${styles.btn} ${styles.btnAdicionar}`}
                              onClick={() => saveEditProduto(item.id)}
                            >
                              Salvar
                            </button>

                            <button
                              className={`${styles.btn} ${styles.btnExcluir}`}
                              onClick={cancelEditProduto}
                            >
                              Cancelar
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.nome}</td>
                          <td>{item.categoria}</td>
                          <td>{item.tamanho}</td>
                          <td>{item.quantidade}</td>

                          <td>
                            <span
                              style={{
                                background: status.bg,
                                color: status.color,
                                border: `1.5px solid ${status.border}`,
                                borderRadius: 20,
                                padding: "4px 12px",
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {status.emoji} {status.label}
                            </span>
                          </td>

                          <td>
                            <button
                              className={`${styles.btn} ${styles.btnEditar}`}
                              onClick={() => startEditProduto(item)}
                            >
                              Editar
                            </button>

                            <button
                              className={`${styles.btn} ${styles.btnExcluir}`}
                              onClick={() => openDeleteModal(item)}
                            >
                              Excluir
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {showAddModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2
                  className={styles.titulo}
                  style={{ fontSize: "1.3rem", marginBottom: 20 }}
                >
                  Adicionar Produto
                </h2>

                <form className={styles.formulario} onSubmit={handleAddProduto}>
                  <label className={styles.formLabel}>
                    Nome
                    <input
                      className={styles.formInput}
                      required
                      value={novoProduto.nome}
                      onChange={(e) =>
                        setNovoProduto({ ...novoProduto, nome: e.target.value })
                      }
                    />
                  </label>

                  <label className={styles.formLabel}>
                    Categoria
                    <input
                      className={styles.formInput}
                      required
                      value={novoProduto.categoria}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          categoria: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label className={styles.formLabel}>
                    Tamanho
                    <input
                      className={styles.formInput}
                      required
                      value={novoProduto.tamanho}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          tamanho: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label className={styles.formLabel}>
                    Quantidade
                    <input
                      className={styles.formInput}
                      required
                      type="number"
                      min={0}
                      value={novoProduto.quantidade}
                      onChange={(e) =>
                        setNovoProduto({
                          ...novoProduto,
                          quantidade: e.target.value,
                        })
                      }
                    />
                  </label>

                  <div className={styles.modalBotoes}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnExcluir}`}
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className={`${styles.btn} ${styles.btnAdicionar}`}
                    >
                      Adicionar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2
                  className={styles.titulo}
                  style={{ fontSize: "1.3rem", marginBottom: 16 }}
                >
                  Confirmar Exclusão
                </h2>

                <p style={{ textAlign: "center", marginBottom: "20px" }}>
                  Tem certeza que deseja excluir o produto <br />
                  <b>{itemToDelete?.nome}</b>?
                </p>

                <div className={styles.modalBotoes}>
                  <button
                    className={`${styles.btn} ${styles.btnExcluir}`}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Não
                  </button>

                  <button
                    className={`${styles.btn} ${styles.btnAdicionar}`}
                    onClick={handleDeleteProduto}
                  >
                    Sim, excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}