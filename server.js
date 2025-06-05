require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Rotas
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Sequelize e Models
const sequelize = require('./config/config');
const User = require('./models/User');
const Task = require('./models/Task');
const TaskShare = require('./models/TaskShare');

const PORT = process.env.PORT || 3000;

// Sincronização e inicialização
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco OK!');

    await User.sync({ alter: true });
    await Task.sync({ alter: true });
    await TaskShare.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar modelos:', error);
  }
})();