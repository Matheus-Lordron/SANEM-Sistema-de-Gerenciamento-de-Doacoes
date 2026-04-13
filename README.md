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
| João Pedro Zanette | Desenvolvedor |
| Matheus Lodron | Desenvolvedor |

---

## 🗂️ Estrutura do Repositório

```
sanem/
├── docs/
│   ├── requisitos/          # Levantamento de requisitos funcionais e não funcionais
│   ├── diagramas/           # MER, diagrama de classes, diagrama de casos de uso
│   └── banco-de-dados/      # Prints da base implementada
├── database/
│   ├── scripts/             # Script DDL de criação do banco de dados
│   ├── queries/             # Consultas SQL demonstrativas
│   └── populacao/           # Script de população com dados fictícios
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

- **Banco de Dados:** MySQL
- **IDE/Ferramenta:** MySQL Workbench + DataGrip
- **Versionamento:** Git + GitHub
- **Modelagem:** MySQL Workbench (MWB)

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

### Views
- `vw_consumo_mensal_beneficiario` — Consolida o total de itens recebidos por beneficiário no mês e o saldo disponível.

---

## 📏 Regras de Negócio

| ID | Descrição |
|----|-----------|
| RN01 | Itens em **mau estado** não podem entrar no estoque |
| RN02 | Saídas só são permitidas para beneficiários com status **ativo** |
| RN03 | O sistema **não permite estoque negativo** |
| RN04 | Cada beneficiário pode receber no máximo **20 itens por mês** |

---

## ⚙️ Como executar o banco de dados localmente

1. Tenha o **MySQL** instalado (versão 8+ recomendada).
2. Execute os scripts na seguinte ordem:

```bash
# 1. Criação das tabelas, triggers e views
mysql -u root -p < database/scripts/sanem_sql_script_database_creation.sql

# 2. População com dados fictícios
mysql -u root -p < database/populacao/sanem_populacao_database.sql

# 3. (Opcional) Executar queries demonstrativas
mysql -u root -p sanem < database/queries/querys_sanem_database.sql
```

---

## 📄 Documentação

Toda a documentação do projeto está na pasta `/docs`:

- **Levantamento de Requisitos** — Requisitos funcionais, não funcionais e regras de negócio
- **MER (Modelo Entidade-Relacionamento)** — Diagrama do banco de dados
- **Diagrama de Classes** — Estrutura orientada a objetos do sistema
- **Diagrama de Casos de Uso** — Interações dos atores com o sistema
- **Prints da Base Implementada** — Evidências do banco em funcionamento

---

*Disciplina: Oficina de Desenvolvimento de Software — 2026*
