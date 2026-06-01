"use client";
import React, { useEffect, useState } from "react";
import MenuBar from "../../components/menubar/menubar";
import Navigation from "../../components/navegation/navegation";
import styles from "./lista.module.css";
import { useRouter } from "next/navigation";
import modalStyles from "./lista.module.css";

export default function ListaVoluntarios() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // 🚀 BUSCA OS DADOS REAIS DO BACKEND (SPRING BOOT)
  const carregarVoluntarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/voluntaries", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor ao buscar dados. Status: ${response.status}`);
      }

      const dados = await response.json();
      setVoluntarios(dados);
    } catch (err) {
      console.error("Erro ao carregar voluntários:", err);
      setError("Não foi possível carregar os voluntários do banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVoluntarios();
  }, []);

  // 🚀 EXCLUSÃO REAL NO BANCO DE DADOS
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este voluntário?")) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:8080/api/voluntaries/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Falha ao deletar. Status: ${response.status}`);
      }

      alert("Voluntário excluído com sucesso!");
      carregarVoluntarios(); // Atualiza a tabela buscando os dados novos do PostgreSQL
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir voluntário do sistema.");
      setLoading(false);
    }
  };

  const openEditModal = (voluntario) => {
    setEditForm({
      id: voluntario.id,
      nomeCompleto: voluntario.person?.name || "",
      email: voluntario.person?.email || "",
      telefoneCelular: voluntario.person?.phone || "",
      cpf: voluntario.person?.cpf || "",
      endereco: voluntario.person?.address?.street || "",
      numero: voluntario.person?.address?.number || "",
      complemento: voluntario.person?.address?.complement || "",
      bairro: voluntario.person?.address?.neighborhood || "",
      pontoReferencia: voluntario.person?.address?.referencePoint || ""
    });
    setEditModalOpen(true);
    setEditError("");
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditForm(null);
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      alert("Edição salva com sucesso.");
      setEditModalOpen(false);
      setEditForm(null);
    } catch (err) {
      setEditError("Erro ao salvar edição");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navigation />
      <div className={styles.contentWrapper}>
        <div className={styles.listContainer}>
          <h1 className={styles.titulo}>Voluntários Cadastrados</h1>
          <div className={styles.decoracao}></div>
          <div className={styles.actionsHeader}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/cadastrovoluntario")}
            >
              + Adicionar Voluntário
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.beneficiariosTable}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className={styles.loadingMessage}>Carregando dados do servidor...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className={styles.errorMessage}>{error}</td>
                  </tr>
                ) : voluntarios.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.noDataMessage}>Nenhum voluntário cadastrado ainda.</td>
                  </tr>
                ) : (
                  voluntarios.map((v) => (
                    <tr key={v.id}>
                      <td>{v.person?.name || "Não informado"}</td>
                      <td>{v.person?.email || "Não informado"}</td>
                      <td>{v.person?.phone || "Não informado"}</td>
                      <td>
                        <span className={v.isActive ? styles.statusAtivo : styles.statusInativo}>
                          {v.isActive ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => openEditModal(v)}
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(v.id)}
                          disabled={loading}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de edição */}
      {editModalOpen && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <h2 className={modalStyles.titulo}>Editar Voluntário</h2>
            <form onSubmit={handleEditSubmit} className={modalStyles.formulario}>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_nomeCompleto"><b>Nome completo*</b></label>
                <input id="edit_nomeCompleto" name="nomeCompleto" value={editForm.nomeCompleto} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_email"><b>E-mail*</b></label>
                <input id="edit_email" name="email" type="email" value={editForm.email} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_telefoneCelular"><b>Telefone*</b></label>
                <input id="edit_telefoneCelular" name="telefoneCelular" value={editForm.telefoneCelular} onChange={handleEditChange} required type="tel" />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_cpf"><b>CPF*</b></label>
                <input id="edit_cpf" name="cpf" type="text" maxLength={11} value={editForm.cpf} disabled style={{ backgroundColor: "#eee", cursor: "not-allowed" }} />
              </div>
              <hr className={modalStyles.separador} />
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_endereco"><b>Endereço*</b></label>
                <input id="edit_endereco" name="endereco" value={editForm.endereco} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_numero"><b>Número*</b></label>
                <input id="edit_numero" name="numero" type="number" value={editForm.numero} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroup}>
                <label htmlFor="edit_complemento"><b>Complemento</b></label>
                <input id="edit_complemento" name="complemento" value={editForm.complemento} onChange={handleEditChange} />
              </div>
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_bairro"><b>Bairro*</b></label>
                <input id="edit_bairro" name="bairro" value={editForm.bairro} onChange={handleEditChange} required />
              </div>
              <div className={modalStyles.formGroupFullWidth}>
                <label htmlFor="edit_pontoReferencia"><b>Ponto de referência</b></label>
                <input id="edit_pontoReferencia" name="pontoReferencia" value={editForm.pontoReferencia} onChange={handleEditChange} />
              </div>
              <div className={modalStyles.modalButtonGroup}>
                <button type="button" onClick={closeEditModal} style={{ background: '#aaa', color: '#fff' }}>Cancelar</button>
                <button type="submit" disabled={editLoading}>{editLoading ? "Salvando..." : "Salvar Alterações"}</button>
              </div>
              {editError && <div className={modalStyles.errorMessage}>{editError}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}