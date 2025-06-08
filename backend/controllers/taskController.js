const { Op } = require('sequelize');
const Task = require('../models/Task');
const User = require('../models/User');
const TaskShare = require('../models/TaskShare');

Task.belongsTo(User, { as: 'user', foreignKey: 'userId' });

exports.createTask = async (req, res) => {
  try {
    const { titulo, descricao, status, data_vencimento } = req.body;
    const userId = req.user.id;

    const newTask = await Task.create({
      titulo,
      descricao,
      status,
      data_vencimento: data_vencimento || null, // não use new Date()
      userId,
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar task', error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, data_vencimento } = req.query;

    // Busca IDs das tarefas compartilhadas com você
    const sharedTaskIds = await TaskShare.findAll({
      where: { userId },
      attributes: ['taskId']
    }).then(shares => shares.map(s => s.taskId));

    // Filtros dinâmicos
    const where = {};
    if (status) where.status = status;
    if (data_vencimento) where.data_vencimento = data_vencimento;

    // Busca tarefas criadas por você OU compartilhadas com você
    const tasks = await Task.findAll({
      where: {
        ...where,
        [Op.or]: [
          { userId }, // criadas por você
          { id: sharedTaskIds } // compartilhadas com você
        ]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    // Para cada tarefa, busque os e-mails compartilhados
    const tasksWithShared = await Promise.all(tasks.map(async (task) => {
      const shares = await TaskShare.findAll({
        where: { taskId: task.id },
        include: [{ model: User, as: 'user', attributes: ['email'] }]
      });
      // Array de e-mails
      const sharedWith = shares.map(s => s.user.email);
      // Retorna a task como objeto + sharedWith
      return {
        ...task.toJSON(),
        sharedWith
      };
    }));

    res.json(tasksWithShared);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { titulo, descricao, status, data_vencimento  } = req.body;

    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) return res.status(404).json({ message: 'Task não encontrada' });

    task.titulo = titulo ?? task.titulo;
    task.descricao = descricao ?? task.descricao;
    task.status = status ?? task.status;
    task.data_vencimento = data_vencimento ?? task.data_vencimento;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar task', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) return res.status(404).json({ message: 'Task não encontrada' });

    await task.destroy();
    res.json({ message: 'Task deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar task', error: err.message });
  }
};

exports.shareTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { email } = req.body;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) return res.status(404).json({ message: 'Task não encontrada ou não pertence a você' });

    const userToShare = await User.findOne({ where: { email } });
    if (!userToShare) return res.status(404).json({ message: 'Usuário para compartilhar não encontrado' });

    // Evita compartilhar consigo mesmo
    if (userToShare.id === userId) return res.status(400).json({ message: 'Não é possível compartilhar consigo mesmo' });

    // Evita duplicidade
    const alreadyShared = await TaskShare.findOne({ where: { taskId, userId: userToShare.id } });
    if (alreadyShared) return res.status(400).json({ message: 'Tarefa já compartilhada com este usuário' });

    await TaskShare.create({ taskId, userId: userToShare.id });
    res.json({ message: 'Tarefa compartilhada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao compartilhar tarefa', error: err.message });
  }
};

exports.unshareTask = async (req, res) => {
  try {
    const { id } = req.params; // id da tarefa
    const { email } = req.body; // email do usuário a remover

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const deleted = await TaskShare.destroy({
      where: { taskId: id, userId: user.id }
    });

    if (deleted) {
      res.json({ message: 'Compartilhamento removido com sucesso' });
    } else {
      res.status(404).json({ message: 'Compartilhamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover compartilhamento', error: err.message });
  }
};