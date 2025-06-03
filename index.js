const sequelize = require('./config/config');
const User = require('./models/User');
const Task = require('./models/Task');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão OK!');
    await User.sync({ alter: true }); // cria tabela users se não existir, ajusta estrutura
    console.log('Model User sincronizado!');
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sequelize.close();
  }
})();