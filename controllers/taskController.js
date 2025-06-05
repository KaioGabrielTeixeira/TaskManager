const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { titulo, descricao, status } = req.body;
    const userId = req.user.id;

    const newTask = await Task.create({
      titulo,
      descricao,
      status,
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
    const tasks = await Task.findAll({ where: { userId } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar tasks', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { titulo, descricao, status } = req.body;

    const task = await Task.findOne({ where: { id: taskId, userId } });
    if (!task) return res.status(404).json({ message: 'Task não encontrada' });

    task.titulo = titulo ?? task.titulo;
    task.descricao = descricao ?? task.descricao;
    task.status = status ?? task.status;

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