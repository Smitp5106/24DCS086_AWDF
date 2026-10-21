const express = require("express");
const router = express.Router();

const validateTaskId = require("../middleware/validateTaskId");
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getAiSuggestions
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.post("/ai-suggest", getAiSuggestions);
router.get("/:id", validateTaskId, getTaskById);
router.post("/", createTask);
router.put("/:id", validateTaskId, updateTask);
router.delete("/:id", validateTaskId, deleteTask);

module.exports = router;
