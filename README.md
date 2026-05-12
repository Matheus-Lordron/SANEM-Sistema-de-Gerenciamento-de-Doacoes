# 🤝 SANEM — Sistema de Gerenciamento de Doações

> Projeto desenvolvido na disciplina de **Oficina de Desenvolvimento de Software**
> Grupo: **La Paz** | Curso: Ciencia da Computação - UTFPR Campus Medianeira

---

## 📋 Descrição

O **SANEM** é uma plataforma web voltada à automatização e organização do fluxo de doações.  
Substitui o controle manual por um sistema centralizado que gerencia doadores, beneficiários e o estoque de itens (roupas, calçados e outros), garantindo rastreabilidade desde a arrecadação até a entrega.

---

## 👥 Membros da Equipe

| Nome | Função |
|------|--------|
| Adriel | Desenvolvedor |
| Bolívar | Desenvolvedor |
| João Pedro Zanette | Scrum Master |
| Matheus Lodron | Desenvolvedor |

---

## 🗂️ Estrutura do Repositório

```
sanem/
├── Arquivos_Projeto_SANEM_LaPaz/
│   ├── documentacao_arquivos_level_1_a_4/
│   │   ├── database/          # Scripts DDL, população e queries SQL
│   │   └── docs/diagramas/    # MER e arquivos do MySQL Workbench
├── La_Paz/
│   ├── backend/               # API REST em Java Spring Boot
│   ├── frontend/              # Interface Web em Next.js
│   └── documentation/         # Propostas de arquitetura e documentos formais
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

- **Front-end:** Next.js 15, React 19, Axios e jsPDF
- **Back-end:** Java 17, Spring Boot 3.4.5 e Spring Security (JWT)
- **Banco de Dados:** PostgreSQL (Produção) e H2 (Testes)
- **Versionamento:** Git + GitHub

---

## 🗃️ Banco de Dados

O banco `sanem` é composto pelas seguintes tabelas:

| Tabela | Descrição |
|--------|-----------|
| `usuario` | Usuários do sistema (administrador e operador) |
| `doador` | Pessoas físicas e jurídicas que realizam doações |
| `beneficiario` | Pessoas cadastradas que recebem as doações |
| `categoria_item` | Categorias dos itens (Vestuário, Calçado, Outros) |
| `item` | Itens disponíveis no estoque |
| `movimentacao` | Registro de entradas (doações recebidas) e saídas (entregas) |
| `movimentacao_item` | Itens vinculados a cada movimentação |


---

## 📏 Regras de Negócio

| ID | Descrição |
|----|-----------|
| RN01 | Itens em **mau estado** não podem entrar no estoque |
| RN02 | Saídas só são permitidas para beneficiários com status **ativo** |
| RN03 | O sistema **não permite estoque negativo** |
| RN04 | Cada beneficiário pode receber no máximo **20 itens por mês** |

---

### 1. Back-end (Java/Spring)
```bash
cd La_Paz/backend
./mvnw spring-boot:run
---
### 2. Front-end (Next.js)
```bash
cd La_Paz/frontend
npm install
npm run dev

📄 Documentação
Os documentos técnicos detalhados podem ser encontrados na pasta de documentação:

Modelo Entidade-Relacionamento (MER) — Localizado em /docs/diagramas/

Proposta de Arquitetura Tecnológica — Localizado em /documentation/

Manual de Equipe (BugBusters) — Localizado em /documentation/
---

*Disciplina: Oficina de Desenvolvimento de Software — 2026*
