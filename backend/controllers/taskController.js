const Task = require('../models/Task');
const TaskShare = require('../models/TaskShare');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
  try {
    const { titulo, descricao, status, data_vencimento } = req.body;
    const userId = req.user.id;

    const newTask = await Task.create({
      titulo,
      descricao,
      status,
      data_vencimento, 
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

    // Filtros dinâmicos
    const where = {};
    if (status) where.status = status;
    if (data_vencimento) {
      where.data_vencimento = {
        [Op.gte]: `${data_vencimento} 00:00:00`,
        [Op.lt]: `${data_vencimento} 23:59:59`
      };
    }

    // Tarefas próprias
    const ownTasks = await Task.findAll({ where: { ...where, userId } });

    // Tarefas compartilhadas
    const sharedTasks = await Task.findAll({
      where,
      include: [{
        model: User,
        as: 'SharedWith',
        attributes: ['id', 'nome', 'email'], // Apenas campos públicos
        where: { id: userId },
        through: { attributes: [] }
      }]
    });

    // Junta e remove duplicatas
    const allTasks = [...ownTasks, ...sharedTasks.filter(
      t => !ownTasks.find(ot => ot.id === t.id)
    )];

    res.json(allTasks);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tasks', error: err.message });
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