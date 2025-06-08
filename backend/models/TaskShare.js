const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');
const Task = require('./Task');

class TaskShare extends Model {}

TaskShare.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id',
    },
    onDelete: 'CASCADE',
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
  modelName: 'TaskShare',
  tableName: 'task_shares',
  timestamps: false,
});

Task.belongsToMany(User, { through: TaskShare, as: 'SharedWith', foreignKey: 'taskId' });
User.belongsToMany(Task, { through: TaskShare, as: 'SharedTasks', foreignKey: 'userId' });
TaskShare.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = TaskShare;