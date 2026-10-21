const Task = require("../models/Task");
const aiService = require("../services/aiService");

const VALID_STATUSES = ["pending", "in-progress", "done"];
const VALID_PRIORITIES = ["low", "medium", "high", "urgent"];

// GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      const err = new Error(`Task with id ${req.params.id} not found`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, suggestedDeadline } = req.body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      const err = new Error("Title is required and must be a non-empty string");
      err.status = 400;
      return next(err);
    }

    if (status && !VALID_STATUSES.includes(status)) {
      const err = new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
      err.status = 400;
      return next(err);
    }

    if (priority && !VALID_PRIORITIES.includes(priority.toLowerCase())) {
      const err = new Error(`Priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
      err.status = 400;
      return next(err);
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? String(description).trim() : "",
      status: status || "pending",
      priority: priority ? priority.toLowerCase() : "medium",
      suggestedDeadline: suggestedDeadline ? String(suggestedDeadline).trim() : ""
    });

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, suggestedDeadline } = req.body || {};

    if (status && !VALID_STATUSES.includes(status)) {
      const err = new Error(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
      err.status = 400;
      return next(err);
    }

    if (priority && !VALID_PRIORITIES.includes(priority.toLowerCase())) {
      const err = new Error(`Priority must be one of: ${VALID_PRIORITIES.join(", ")}`);
      err.status = 400;
      return next(err);
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority.toLowerCase();
    if (suggestedDeadline !== undefined) updateData.suggestedDeadline = String(suggestedDeadline).trim();

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!task) {
      const err = new Error(`Task with id ${req.params.id} not found`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      const err = new Error(`Task with id ${req.params.id} not found`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks/ai-suggest
// Generates AI suggestions for task description, priority, and deadline
exports.getAiSuggestions = async (req, res, next) => {
  try {
    const { title, description } = req.body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please provide a task title to generate AI suggestions."
      });
    }

    const suggestions = await aiService.generateTaskSuggestions(
      title.trim(),
      description ? String(description).trim() : ""
    );

    res.status(200).json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    // Graceful error handling: never break or throw 500
    console.error("[taskController.getAiSuggestions] Handled error:", error.message);
    const fallback = aiService.generateHeuristicSuggestions(
      req.body?.title || "Task",
      req.body?.description || ""
    );
    res.status(200).json({
      success: true,
      data: fallback,
      fallback: true,
      note: "Generated using resilient offline assistant."
    });
  }
};
