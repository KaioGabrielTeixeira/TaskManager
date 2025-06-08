const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, taskController.createTask);
router.get('/', authenticateToken, taskController.getTasks);
router.put('/:id', authenticateToken, taskController.updateTask);
router.delete('/:id', authenticateToken, taskController.deleteTask);
router.post('/:id/share', authenticateToken, taskController.shareTask);
router.post('/:id/unshare', authenticateToken, taskController.unshareTask);

module.exports = router;