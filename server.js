require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Rotas de autenticação
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});