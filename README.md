# Sistema de Gerenciamento de Tarefas Colaborativas

## Descrição

Aplicação fullstack para gerenciamento de tarefas colaborativas, permitindo que múltiplos usuários criem, visualizem, compartilhem e gerenciem tarefas. Desenvolvido como desafio técnico para processo seletivo.

---

## Funcionalidades

- **Autenticação e autorização JWT**
- **Cadastro e login de usuários**
- **CRUD de tarefas** (criar, listar, editar, excluir)
- **Compartilhamento de tarefas** (visualização por outros usuários)
- **Filtros por status e data de vencimento**
- **Proteção de rotas com middleware**
- **Modelos organizados com Sequelize**

---

## Tecnologias Utilizadas

- **Frontend:** Angular, Angular Material
- **Backend:** Node.js, Express
- **Banco de Dados:** PostgreSQL
- **ORM:** Sequelize
- **Autenticação:** JWT (jsonwebtoken)
- **Outros:** bcryptjs, dotenv

---

## Instalação e Execução

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- Angular CLI

### 1. Clone o repositório

```sh
git clone <https://github.com/KaioGabrielTeixeira/TaskManager>
cd <TaskManager>
```

### 2. Configuração do Banco de Dados

- Crie um banco de dados no PostgreSQL (ex: `taskmanager`)
- Copie o arquivo `.env.example` para `.env` na pasta `backend`:
  
```bash
cp backend/.env.example backend/.env```

```env
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=<sua_senha>
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres
JWT_SECRET=<sua_chave_secreta>
PORT=3000
```

### 3. Backend

```sh
cd backend
npm install
npm start
```
O backend estará disponível em `http://localhost:3000`.

### 4. Frontend

```sh
cd frontend
npm install
ng serve
```
O frontend estará disponível em `http://localhost:4200`.

---

## Rotas Principais

### Autenticação
- `POST /auth/register` — Cadastro de usuário
- `POST /auth/login` — Login de usuário

### Tarefas (protegidas por JWT)
- `GET /tasks` — Listar tarefas (próprias e compartilhadas, com filtros)
- `POST /tasks` — Criar tarefa
- `PUT /tasks/:id` — Editar tarefa (apenas do dono)
- `DELETE /tasks/:id` — Excluir tarefa (apenas do dono)
- `POST /tasks/:id/share` — Compartilhar tarefa com outro usuário

---

## Arquitetura & Decisões

- **Separação de responsabilidades:**  
  Controllers, models, rotas e middlewares organizados em pastas distintas.
- **Autorização:**  
  Apenas o criador pode editar/excluir tarefas. Usuários compartilhados só podem visualizar.
- **Segurança:**  
  Dados sensíveis (como senha) nunca são expostos nas respostas da API.
- **Filtros:**  
  Implementados via query params para status e data de vencimento.
- **Frontend:**  
  Angular Material para UI consistente e responsiva.

---

## Como executar localmente

1. Suba o banco de dados PostgreSQL e configure o `.env`
2. Inicie o backend (`npm start` na pasta backend)
3. Inicie o frontend (`ng serve` na pasta frontend)
4. Acesse `http://localhost:4200` no navegador

---

## Principais decisões técnicas

- **JWT** para autenticação stateless e segura.
- **Sequelize** para abstração do banco e fácil manutenção dos modelos.
- **Angular Material** para UI rápida e responsiva.
- **Arquitetura modular** para facilitar manutenção e testes.

---

## Histórico de Commits

- Commits frequentes e descritivos.
- Evolução do código registrada passo a passo.

---

## Autor

Kaio Gabriel Teixeira — [KaioGabrielTeixeira](https://github.com/KaioGabrielTeixeira)

---

## Licença

Este projeto está sob a licença MIT.