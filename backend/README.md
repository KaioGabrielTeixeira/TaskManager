# Sistema de Gerenciamento de Tarefas Colaborativas - Backend

## Descrição

API RESTful para gerenciamento de tarefas colaborativas, permitindo múltiplos usuários criarem, visualizarem, gerenciarem e compartilharem tarefas.  
Desenvolvido em **Node.js** com **Express**, **Sequelize** e **PostgreSQL**.

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

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

---

## Instalação e Execução

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo/backend
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configure o arquivo `.env`:**
   ```
   JWT_SECRET=sua_chave_secreta
   DB_USER=seu_usuario_postgres
   DB_PASSWORD=sua_senha_postgres
   DB_NAME=nome_do_banco
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. **Inicie o servidor:**
   ```sh
   npm start
   ```
   O backend estará disponível em `http://localhost:3000`.

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

---

## Como contribuir

1. Fork este repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha feature'`
4. Push para o branch: `git push origin minha-feature`
5. Abra um Pull Request

---

## Autor

Seu Nome — [seu-usuario no GitHub](https://github.com/seu-usuario)

---

## Licença

Este projeto está sob a licença MIT.