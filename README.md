# 🤝 SANEM — Sistema de Gerenciamento de Doações

> Projeto desenvolvido na disciplina de **Oficina de Desenvolvimento de Software**
> Grupo: **La Paz** | Curso: Ciência da Computação - UTFPR Campus Medianeira

---

## 📋 Descrição
O **SANEM** é uma plataforma web para automatização e organização do fluxo de doações. O sistema centraliza o gerenciamento de doadores, beneficiários, estoque e movimentações, garantindo rastreabilidade total desde a arrecadação até a entrega final.

---

## 👥 Membros da Equipe

| Nome | Função |
| :--- | :--- |
| Adriel | Desenvolvedor |
| Bolívar | Desenvolvedor |
| João Pedro Zanette | Scrum Master |
| Matheus Lodron | Desenvolvedor |

---

## 🛠️ Tecnologias e Ambiente

### Stack Tecnológica
- **Front-end:** Next.js 15, React 19, Axios e jsPDF
- **Back-end:** Java 17, Spring Boot 3.4.5, Spring Security (JWT)
- **Persistência & Autenticação:** Supabase (PostgreSQL + Auth)
- **Versionamento:** Git + GitHub

### Ambiente de Desenvolvimento
- **IDE Front-end:** Visual Studio Code (Última versão)
- **IDE Back-end:** IntelliJ IDEA (Última versão)
- **Runtime:** Node.js (LTS), Java 17 SDK

---

## 🗃️ Estrutura do Banco de Dados (Supabase/PostgreSQL)

| Tabela | Descrição |
| :--- | :--- |
| `address` | Endereços vinculados a pessoas e locais |
| `category` | Categorias de classificação dos itens |
| `cpf` | Dados de identificação documental |
| `donation` | Registro central de doações realizadas |
| `donation_item` | Itens vinculados especificamente a uma doação |
| `email` | Contatos de e-mail cadastrados |
| `giver` | Doadores (Pessoas físicas ou jurídicas) |
| `item` | Cadastro e estoque de produtos |
| `limit` | Regras de limitação de recebimento |
| `person` | Cadastro base de pessoas físicas |
| `receiver` | Beneficiários cadastrados |
| `receiver_limit` | Controle de limites por beneficiário |
| `size` | Grades de tamanhos disponíveis |
| `transfer` | Registro de movimentações/transferências |
| `transfer_item` | Itens vinculados a uma transferência |
| `voluntary` | Cadastro de voluntários do sistema |

---

## 📏 Regras de Negócio

| ID | Descrição |
|----|-----------|
| RN01 | Itens em **mau estado** não podem entrar no estoque |
| RN02 | Saídas só são permitidas para beneficiários com status **ativo** |
| RN03 | O sistema **não permite estoque negativo** |
| RN04 | Cada beneficiário pode receber no máximo **20 itens por mês** |

---

## 🚀 Como Executar

### 1. Pré-requisitos
Certifique-se de ter instalado:
- **Java 17+**
- **Node.js (LTS)**
- Variáveis de ambiente (`.env.local`) configuradas com as credenciais do seu projeto Supabase.

### 2. Back-end (Spring Boot)
```bash
cd La_Paz/backend
./mvnw spring-boot:run
