const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Criar uma nova tarefa (Apenas usuários autenticados)
router.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const newTask = new Task({ title, userId: req.user.userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar tarefa", error });
  }
});

// Listar todas as tarefas do usuário autenticado
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas", error });
  }
});

// Atualizar uma tarefa (Apenas se pertencer ao usuário autenticado)
router.put("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { title, completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tarefa não encontrada!" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar tarefa", error });
  }
});

// Deletar uma tarefa (Apenas se pertencer ao usuário autenticado)
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!deletedTask) {
      return res.status(404).json({ message: "Tarefa não encontrada!" });
    }

    res.status(200).json({ message: "Tarefa deletada com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar tarefa", error });
  }
});

module.exports = router;
