import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateTask } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply auth middleware to all task routes
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .put(validateTask, updateTask)
  .delete(deleteTask);

export default router;
