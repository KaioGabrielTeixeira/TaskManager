const sequelize = require('./config/config');
const User = require('./models/User');
const Task = require('./models/Task');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão OK!');
    await User.sync({ alter: true });
    await Task.sync({ alter: true });
    console.log('Model User e Task sincronizados!');
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sequelize.close();
  }
})();