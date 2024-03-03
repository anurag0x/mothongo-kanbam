// Importing Mongoose
const mongoose = require('mongoose');

// Creating a schema for the Task
const taskSchema = new mongoose.Schema(
  {
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ['Unassigned', 'In Development', 'Pending Review', 'Done'], default: 'Unassigned' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deadline: { type: Date },
  },
  { timestamps: true }
);

// Creating a Task model based on the schema
const Task = mongoose.model('Task', taskSchema);

// Exporting the Task model
module.exports = { Task };
