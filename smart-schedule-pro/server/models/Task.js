const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  date: Date,
  type: String,
  completed: Boolean
});

module.exports = mongoose.model("Task", TaskSchema);