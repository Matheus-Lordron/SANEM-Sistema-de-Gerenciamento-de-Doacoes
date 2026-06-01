"use client";
import React, { useState } from "react";
import MenuBar from "../components/menubar/menubar";
import Navegation from "../components/navegation/navegation";
import { useRouter } from "next/navigation";
import styles from "./cadastrovoluntario.module.css";
import toast from "react-hot-toast"; // 🟢 Importação do toast adicionada

const CadastroVoluntario = () => {
  const [form, setForm] = useState({
    nomeCompleto: "",
    telefoneCelular: "",
    email: "",
    cpf: "",
    endereco: "",
    bairro: "",
    numero: "",
    complemento: "",
    pontoReferencia: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Garante que o CPF só aceite números e trave em 11 dígitos
  const handleCpfChange = (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, "");
    if (apenasNumeros.length <= 11) {
      setForm({ ...form, cpf: apenasNumeros });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validação estrita do CPF antes de enviar ao Java
    if (form.cpf.length !== 11) {
      setError("O CPF deve conter exatamente 11 dígitos numéricos.");
      setLoading(false);
      return;
    }

    const telefoneLimpo = form.telefoneCelular.replace(/\D/g, "");

    try {
      // 1️⃣ PASSO: Cadastrar o Endereço
      const dadosEndereco = {
        street: form.endereco,
        neighborhood: form.bairro,
        number: parseInt(form.numero, 10),
        complement: form.complemento.trim() !== "" ? form.complemento : "Não informado",
        referencePoint: form.pontoReferencia.trim() !== "" ? form.pontoReferencia : "Não informado"
      };

      const enderecoResponse = await fetch("http://localhost:8080/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEndereco),
      });

      if (!enderecoResponse.ok) {
        throw new Error(`Falha ao salvar endereço. Status: ${enderecoResponse.status}`);
      }

      const enderecoCriado = await enderecoResponse.json();
      const idAddressGenerated = enderecoCriado.id;

      // 2️⃣ PASSO: Cadastrar a Pessoa (Enviando o CPF com exatamente 11 dígitos limpos)
      const dadosPessoa = {
        name: form.nomeCompleto,
        phone: telefoneLimpo,
        email: form.email,
        cpf: form.cpf, // Já está estritamente validado com 11 caracteres numéricos
        idAddress: idAddressGenerated
      };

      const pessoaResponse = await fetch("http://localhost:8080/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosPessoa),
      });

      if (!pessoaResponse.ok) {
        throw new Error(`Endereço salvou, mas falha ao cadastrar dados pessoais. Status: ${pessoaResponse.status}`);
      }

      const pessoaCriada = await pessoaResponse.json();
      const personIdGenerated = pessoaCriada.id;

      // 3️⃣ PASSO: Vincular a pessoa como Voluntário
      const novoVoluntarioDto = {
        personId: personIdGenerated,
        password: "1234",
        isActive: true
      };

      const voluntarioResponse = await fetch("http://localhost:8080/api/voluntaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoVoluntarioDto),
      });

      if (!voluntarioResponse.ok) {
        throw new Error(`Dados pessoais salvos, mas falhou ao definir perfil de voluntário. Status: ${voluntarioResponse.status}`);
      }

      // Limpa tudo após o sucesso
      setForm({
        nomeCompleto: "",
        telefoneCelular: "",
        email: "",
        cpf: "",
        endereco: "",
        bairro: "",
        numero: "",
        complemento: "",
        pontoReferencia: ""
      });
      
      // 🟢 Alerta de sucesso no cadastro (Substituindo o alert)
      toast.success("Voluntário cadastrado com sucesso!");
      
      router.push("/cadastrovoluntario/lista");

    } catch (err) {
      console.error(err);
      setError("Erro no cadastro: " + err.message);
      toast.error("Erro no cadastro: " + err.message); // 🔴 Toast de erro com a mensagem da API
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.containerGeral}>
      <MenuBar />
      <Navegation />
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.titulo}>Cadastro de Voluntário</h1>
          <div className={styles.decoracao}></div>
          <form onSubmit={handleSubmit} className={styles.formulario}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeCompleto"><b>Nome completo*</b></label>
              <input id="nomeCompleto" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} required placeholder="Fulano da Silva" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email"><b>E-mail*</b></label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="fulano@gmail.com" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefoneCelular"><b>Telefone*</b></label>
              <input id="telefoneCelular" name="telefoneCelular" value={form.telefoneCelular} onChange={handleChange} required placeholder="(45) 99988-7766" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf"><b>CPF (Apenas 11 números)*</b></label>
              <input id="cpf" name="cpf" type="text" value={form.cpf} onChange={handleCpfChange} placeholder="Digite os 11 números" maxLength={11} required />
            </div>
            <hr className={styles.separador} />
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="endereco"><b>Endereço*</b></label>
              <input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} required placeholder="Rua da Água" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="numero"><b>Número*</b></label>
              <input id="numero" name="numero" type="number" value={form.numero} onChange={handleChange} required placeholder="2015" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="complemento"><b>Complemento</b></label>
              <input id="complemento" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Ap 307 (opcional)" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="bairro"><b>Bairro*</b></label>
              <input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} required placeholder="Centro" />
            </div>
            <div className={styles.formGroupFullWidth}>
              <label htmlFor="pontoReferencia"><b>Ponto de referência</b></label>
              <input id="pontoReferencia" name="pontoReferencia" value={form.pontoReferencia} onChange={handleChange} placeholder="Em frente ao parque (opcional)" />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Voluntário"}
            </button>
            {error && <div className={styles.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroVoluntario;