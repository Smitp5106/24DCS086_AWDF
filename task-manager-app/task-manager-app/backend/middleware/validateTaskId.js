// Route-specific middleware: validates :id is a valid MongoDB ObjectId before hitting the controller
const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid task ID format. ID must be a 24-character MongoDB ObjectId."
    });
  }
  next();
};

module.exports = validateTaskId;
