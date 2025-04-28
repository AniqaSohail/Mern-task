import express from "express";
import { addTodo, editTodo, deleteTodo, getTodos } from "../controllers/todoController.js";

const router = express.Router();

// Correct HTTP Methods
router.post("/add", addTodo);     // Add new task
router.put("/edit/:id", editTodo); // Edit task (with ID)
router.delete("/delete/:id", deleteTodo); // Delete task (with ID)
router.get("/get", getTodos);      // Get all tasks

export default router;
