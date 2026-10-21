import Task from '../models/Task.js';
import { generateTaskSuggestions, generateHeuristicSuggestions } from '../services/aiService.js';

// @desc    Get all tasks for the logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, suggestedDeadline } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      suggestedDeadline: suggestedDeadline || '',
      user: req.user.id // Associate task with the user
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this task' });
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI suggestions for task
// @route   POST /api/tasks/ai-suggest
// @access  Private
export const getAiSuggestions = async (req, res) => {
  try {
    const { title, description } = req.body || {};
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a task title to generate AI suggestions.' });
    }

    const suggestions = await generateTaskSuggestions(title.trim(), description || '');
    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    console.error('AI Suggestion error:', error.message);
    const fallback = generateHeuristicSuggestions(req.body?.title || 'Task', req.body?.description || '');
    res.status(200).json({ success: true, data: fallback, fallback: true });
  }
};

