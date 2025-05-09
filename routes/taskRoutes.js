const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    validateCreateTask,
    validateUpdateTask,
    validateTaskId
} = require('../middleware/validateTask');
const {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskAnalytics,
} = require('../controllers/taskController');

// Protect all routes
router.use(protect);

// Task routes with validation
router.route('/')
    .get(getAllTasks)
    .post(validateCreateTask, createTask);

router.get('/analytics', getTaskAnalytics);

router.route('/:id')
    .get(validateTaskId, getTaskById)
    .put(validateUpdateTask, updateTask)
    .delete(validateTaskId, deleteTask);

module.exports = router; 