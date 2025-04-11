const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { processCommandWithGemini } = require('../utils/gemini');

const tools = {
  add_todo: todoController.addTodo,
  list_todos: todoController.listTodos,
  complete_todo: todoController.completeTodo,
  delete_todo: todoController.deleteTodo,
};

router.post('/command', async (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ error: 'Command is required' });
  }

  try {
    const { tool, args } = await processCommandWithGemini(command, tools);
    const toolHandler = tools[tool];
    if (!toolHandler) {
      return res.json({ result: `Tool "${tool}" not found` });
    }

    const result = await toolHandler(args);
    res.json({ result });
  } catch (e) {
    console.error('Error processing command:', e.message, e.stack);
    res.json({ result: `Error processing command: ${e.message}` });
  }
});

module.exports = router;
