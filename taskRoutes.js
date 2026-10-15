const express = require("express");
const { getDashboard, createTask, deleteTask, updateTask, editTask, markAsComplete } = require("../controller/taskController");
const { authmiddleware } = require("../middleware/auth");

const taskRouter = express.Router();

taskRouter.get("/dashboard",authmiddleware, getDashboard);
taskRouter.post('/create',authmiddleware,createTask)
taskRouter.delete('/:id',authmiddleware,deleteTask)
taskRouter.patch('/:id/status',authmiddleware,updateTask)
taskRouter.put('/:id',authmiddleware,editTask)
taskRouter.patch("/:id/complete", authmiddleware, markAsComplete);

module.exports = taskRouter;

