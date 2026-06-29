"use client";

import MenuBar from "../components/menubar/menubar";
import Navigation from "../components/navegation/navegation";
import styles from "./estoque.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../lib/api";

function getEstoqueStatus(quantidade) {
  if (quantidade <= 2) {
    return { label: "Crítico", color: "#f87171", border: "#ef4444", bg: "rgba(239, 68, 68, 0.10)", emoji: "🔴" };
  }
  if (quantidade <= 4) {
    return { label: "Alerta", color: "#fbbf24", border: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", emoji: "🟠" };
  }
  if (quantidade <= 7) {
    return { label: "Atenção", color: "#fde047", border: "#eab308", bg: "rgba(234, 179, 8, 0.12)", emoji: "🟡" };
  }
  return { label: "OK", color: "#86efac", border: "#22c55e", bg: "rgba(34, 197, 94, 0.12)", emoji: "🟢" };
}

export default function EstoquePage() {
  const [estoque, setEstoque] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // ✅ Listas de categorias e tamanhos vindas do backend
  const [categorias, setCategorias] = useState([]);
  const [tamanhos, setTamanhos] = useState([]);

  // ✅ Estado com categoryId, sizeId e sex
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    categoryId: "",
    sizeId: "",
    sex: "U",
    quantidade: "",
  });

  const [editId, setEditId] = useState(null);
  const [editProduto, setEditProduto] = useState({
    nome: "",
    categoryId: "",
    sizeId: "",
    sex: "U",
    quantidade: "",
  });

  const [filtroCritico, setFiltroCritico] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const hasNotification = false;

  // ✅ Carrega tudo na montagem
  useEffect(() => {
    carregarEstoque();
    carregarCategorias();
    carregarTamanhos();
  }, []);

  async function carregarEstoque() {
    try {
      const response = await api.get("/api/items");

      const dadosFormatados = response.data.map(item => ({
        id: item.id,
        nome: item.name || item.nome,
        categoria: item.category?.name || item.categoria || "Geral",
        tamanho: item.size?.name || item.tamanho || "Único",
        sex: item.sex ? String(item.sex).toUpperCase() : "U",
        categoryId: item.category?.id || "",
        sizeId: item.size?.id || "",
        quantidade: item.quantity || item.quantidade,
      }));

      setEstoque(dadosFormatados);

      const criticos = dadosFormatados.filter((i) => i.quantidade <= 2);
      if (criticos.length > 0) {
        toast.error(`⚠️ ${criticos.length} produto(s) com estoque crítico!`, { duration: 5000 });
      }
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
      toast.error("Erro ao carregar os dados do servidor.");
    }
  }

  // ✅ Busca categorias do backend
  async function carregarCategorias() {
    try {
      const response = await api.get("/api/categories");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      toast.error("Erro ao carregar categorias.");
    }
  }

  // ✅ Busca tamanhos do backend
  async function carregarTamanhos() {
    try {
      const response = await api.get("/api/sizes");
      setTamanhos(response.data);
    } catch (error) {
      console.error("Erro ao carregar tamanhos:", error);
      toast.error("Erro ao carregar tamanhos.");
    }
  }

  // ✅ CREATE: payload correto com UUIDs
  async function handleAddProduto(e) {
    e.preventDefault();
    try {
      const payload = {
        name: novoProduto.nome,
        quantity: Number(novoProduto.quantidade),
        sex: novoProduto.sex,
        categoryId: novoProduto.categoryId,
        sizeId: novoProduto.sizeId,
      };

      await api.post("/api/items", payload);
      toast.success("Produto adicionado com sucesso!");
      setNovoProduto({ nome: "", categoryId: "", sizeId: "", sex: "U", quantidade: "" });
      setShowAddModal(false);
      carregarEstoque();
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      toast.error("Erro ao salvar o produto no servidor.");
    }
  }

  // ✅ DELETE
  async function handleDeleteProduto() {
    try {
      await api.delete(`/api/items/${itemToDelete.id}`);
      toast.success("Produto excluído com sucesso!");
      setShowDeleteModal(false);
      setItemToDelete(null);
      carregarEstoque();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir o produto do servidor.");
    }
  }

  function openDeleteModal(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  function startEditProduto(item) {
    setEditId(item.id);
    setEditProduto({
      nome: item.nome,
      categoryId: item.categoryId,
      sizeId: item.sizeId,
      sex: item.sex || "U",
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

  // ✅ UPDATE: payload correto com UUIDs
  async function saveEditProduto(id) {
    try {
      const payload = {
        name: editProduto.nome,
        quantity: Number(editProduto.quantidade),
        sex: editProduto.sex,
        categoryId: editProduto.categoryId,
        sizeId: editProduto.sizeId,
      };

      await api.patch(`/api/items/${id}`, payload);
      toast.success("Produto atualizado com sucesso!");
      setEditId(null);
      setEditProduto({ nome: "", categoryId: "", sizeId: "", sex: "U", quantidade: "" });
      carregarEstoque();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error("Erro ao atualizar o produto no servidor.");
    }
  }

  function cancelEditProduto() {
    setEditId(null);
    setEditProduto({ nome: "", categoryId: "", sizeId: "", sex: "U", quantidade: "" });
  }

  const listaExibida = estoque.filter((item) => {
    const matchCritico = filtroCritico ? item.quantidade <= 4 : true;
    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      item.nome.toLowerCase().includes(searchLower) ||
      item.categoria.toLowerCase().includes(searchLower);
    return matchCritico && matchSearch;
  });

  const totalCriticos = estoque.filter((i) => i.quantidade <= 2).length;
  const totalAlerta = estoque.filter((i) => i.quantidade > 2 && i.quantidade <= 4).length;

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

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
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
                  background: filtroCritico ? "#c0392b" : "rgba(239, 68, 68, 0.10)",
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
                <th>Sexo</th>
                <th>Quantidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {listaExibida.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: "30px", color: "#9ca3af", fontStyle: "italic" }}>
                    Nenhum produto encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                listaExibida.map((item) => {
                  const status = getEstoqueStatus(item.quantidade);

                  return (
                    <tr key={item.id} className={item.quantidade <= 2 ? styles.linhaCritica : ""}>
                      <td title={item.id}>{item.id.substring(0, 8)}...</td>

                      {editId === item.id ? (
                        <>
                          <td>
                            <input
                              className={styles.formInput}
                              style={{ minWidth: "120px", padding: "8px", fontSize: "0.9rem", margin: 0 }}
                              name="nome"
                              value={editProduto.nome}
                              onChange={handleEditChange}
                            />
                          </td>

                          {/* Select de categoria */}
                          <td>
                            <select
                              className={styles.formInput}
                              style={{ minWidth: "160px", padding: "8px", fontSize: "0.9rem", margin: 0 }}
                              name="categoryId"
                              value={editProduto.categoryId}
                              onChange={handleEditChange}
                            >
                              <option value="">Selecione</option>
                              {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </td>

                          {/* Select de tamanho */}
                          <td>
                            <select
                              className={styles.formInput}
                              style={{ minWidth: "100px", padding: "8px", fontSize: "0.9rem", margin: 0 }}
                              name="sizeId"
                              value={editProduto.sizeId}
                              onChange={handleEditChange}
                            >
                              <option value="">Selecione</option>
                              {tamanhos.map((tam) => (
                                <option key={tam.id} value={tam.id}>{tam.name}</option>
                              ))}
                            </select>
                          </td>

                          {/* Select de sexo */}
                          <td>
                            <select
                              className={styles.formInput}
                              style={{ minWidth: "130px", padding: "8px", fontSize: "0.9rem", margin: 0 }}
                              name="sex"
                              value={editProduto.sex}
                              onChange={handleEditChange}
                            >
                              <option value="U">Unissex</option>
                              <option value="M">Masculino</option>
                              <option value="F">Feminino</option>
                            </select>
                          </td>

                          {/* Input de quantidade */}
                          <td>
                            <input
                              className={styles.formInput}
                              style={{ minWidth: "80px", padding: "8px", fontSize: "0.9rem", margin: 0 }}
                              name="quantidade"
                              type="number"
                              min={0}
                              value={editProduto.quantidade}
                              onChange={handleEditChange}
                            />
                          </td>

                          <td>—</td>

                          {/* Botões */}
                          <td style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                            <button
                              className={`${styles.btn} ${styles.btnAdicionar}`}
                              style={{ margin: 0, padding: "6px 12px", fontSize: "0.85rem" }}
                              onClick={() => saveEditProduto(item.id)}
                            >
                              Salvar
                            </button>
                            <button
                              className={`${styles.btn} ${styles.btnExcluir}`}
                              style={{ margin: 0, padding: "6px 12px", fontSize: "0.85rem" }}
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
                          <td>
                            {item.sex === "M" ? "Masculino" : item.sex === "F" ? "Feminino" : "Unissex"}
                          </td>
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

          {/* ✅ Modal de adicionar produto com selects corretos */}
          {showAddModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.titulo} style={{ fontSize: "1.3rem", marginBottom: 20 }}>
                  Adicionar Produto
                </h2>

                <form className={styles.formulario} onSubmit={handleAddProduto}>
                  <label className={styles.formLabel}>
                    Nome
                    <input
                      className={styles.formInput}
                      required
                      value={novoProduto.nome}
                      onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })}
                    />
                  </label>

                  {/* ✅ Sexo */}
                  <label className={styles.formLabel}>
                    Sexo
                    <select
                      className={styles.formInput}
                      value={novoProduto.sex}
                      onChange={(e) => setNovoProduto({ ...novoProduto, sex: e.target.value })}
                    >
                      <option value="U">Unissex</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </label>

                  {/* ✅ Categoria como select com UUIDs */}
                  <label className={styles.formLabel}>
                    Categoria
                    <select
                      className={styles.formInput}
                      required
                      value={novoProduto.categoryId}
                      onChange={(e) => setNovoProduto({ ...novoProduto, categoryId: e.target.value })}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </label>

                  {/* ✅ Tamanho como select com UUIDs */}
                  <label className={styles.formLabel}>
                    Tamanho
                    <select
                      className={styles.formInput}
                      required
                      value={novoProduto.sizeId}
                      onChange={(e) => setNovoProduto({ ...novoProduto, sizeId: e.target.value })}
                    >
                      <option value="">Selecione um tamanho</option>
                      {tamanhos.map((tam) => (
                        <option key={tam.id} value={tam.id}>{tam.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.formLabel}>
                    Quantidade
                    <input
                      className={styles.formInput}
                      required
                      type="number"
                      min={0}
                      value={novoProduto.quantidade}
                      onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: e.target.value })}
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
                    <button type="submit" className={`${styles.btn} ${styles.btnAdicionar}`}>
                      Adicionar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de confirmação de exclusão */}
          {showDeleteModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.titulo} style={{ fontSize: "1.3rem", marginBottom: 16 }}>
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