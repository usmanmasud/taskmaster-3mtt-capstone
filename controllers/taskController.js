const Task = require("../models/Task");

// Create Task
exports.createTask = async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      deadline,
      priority,
      user: req.user.id, // Getting user ID from JWT token
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline, priority } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    task.title = title;
    task.description = description;
    task.deadline = deadline;
    task.priority = priority;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Task not found or unauthorized" });
    }

    await task.remove();
    res.json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
