require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuração do CORS
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Rotas
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// Middlewares de rota
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Sequelize e Models
const sequelize = require('./config/config');
const User = require('./models/User');
const Task = require('./models/Task');
const TaskShare = require('./models/TaskShare');

const PORT = process.env.PORT || 3000;

// Sincronização e inicialização
async function initializeServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco OK!');

    await sequelize.sync({ alter: true });
    console.log('Models sincronizados');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar:', error);
  }
}

initializeServer();