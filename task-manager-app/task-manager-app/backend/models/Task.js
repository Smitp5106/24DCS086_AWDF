const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required and must be a non-empty string"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "done"],
    default: "pending",
  },
}, {
  timestamps: true,
});

// Map _id to id in responses
taskSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
