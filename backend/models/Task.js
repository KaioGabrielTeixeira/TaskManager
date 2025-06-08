const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');

class Task extends Model {}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'em andamento', 'concluída'),
    allowNull: false,
    defaultValue: 'pendente',
  },
  data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Task',
  tableName: 'tasks',
  timestamps: true,
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;