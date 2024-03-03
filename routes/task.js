const express = require("express");
const { Board } = require("../models/board");
const { Task } = require("../models/task");

const taskRouter = express.Router();

// Get a single task by taskId
taskRouter.get("/singleTask", async (req, res) => {
  try {
    let { taskId } = req.query;
    let task = await Task.findById(taskId).populate({
      path: "assignedTo",
      select: "name email avatar",
    });

    if (!task)
      return res.status(404).send({ isOk: false, message: "Task Not Found!" });

    return res.status(200).send({ isOk: false, message: "Here is the task", task });
  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
})

// Add a new task to the board
taskRouter.post("/addTask", async (req, res) => {
  try {
    let { boardId } = req.query;
    let { title, category, description, deadline, assignedTo } = req.body;
    assignedTo = assignedTo.trim();

    // Validations for title, description, deadline, and assignedTo
    if (!title || !title.trim())
      return res.status(400).send({
        isOk: false,
        message: "Title must contain at least one word",
      });
    if (!description || !description.trim() || description.length < 10)
      return res.status(400).send({
        isOk: false,
        message: "Description must contain at least 5-6 words",
      });
    if (!deadline || !assignedTo)
      return res.status(400).send({
        isOk: false,
        message: "Deadline and assignedTo (userId) are needed!",
      });

    let task = await Task.create({
      title,
      category,
      description,
      deadline: new Date(deadline),
      assignedTo,
      board: boardId,
    });

    if (!task)
      return res.status(404).send({
        isOk: false,
        message: "Error occurred while saving the task",
      });

    return res.status(200).send({
      isOk: false,
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Edit an existing task
taskRouter.put("/editTask", async (req, res) => {
  try {
    let { taskId } = req.query;
    let { title, category, description, deadline, assignedTo } = req.body;

    let task = await Task.findById(taskId);

    // Update task fields based on provided values
    if (title) task.title = title;
    if (description) task.description = description;
    if (deadline) task.deadline = deadline;
    if (assignedTo) task.assignedTo = assignedTo.toString();
    if (category) task.category = category;

    await task.save();

    return res.status(200).send({
      isOk: false,
      message: "Task Edited Successfully",
      task,
    });
  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

// Delete a task
taskRouter.delete("/deleteTask", async (req, res) => {
  try {
    let { userId } = req.user;
    let { taskId } = req.query;
    let task = await Task.findById(taskId);

    // Check if the task exists
    if (!task)
      return res.status(400).send({ message: "Task not found!", isOk: false });

    let board = await Board.findById(task.board);

    // Check if the user has permission to delete the task
    if (task.assignedTo !== userId && userId !== board.createdBy)
      return res.status(400).send({
        isOk: false,
        message: "You don't have access to delete others' tasks",
      });

    await Task.findByIdAndDelete(taskId);

    return res.status(200).send({
      isOk: true,
      message: "Task Deleted Successfully",
      task,
    });
  } catch (error) {
    return res.status(500).send({
      isOk: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
});

module.exports = { taskRouter };
