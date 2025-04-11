const Todo = require('../models/Todo');

const todoController = {
  addTodo: async (args) => {
    const todo = new Todo({ task: args.task });
    const savedTodo = await todo.save();
    const id = savedTodo._id.toString();
    return `Added todo: "${args.task}" (ID: ${id})`;
  },

  listTodos: async (args = {}) => {
    const showCompleted = args.showCompleted || false;
    const query = showCompleted ? {} : { completed: false };
    const todos = await Todo.find(query);
    return todos.length > 0
      ? todos
      : 'No todos found.';
  },

  completeTodo: async (args) => {
    const todo = await Todo.findByIdAndUpdate(
      args.id,
      { completed: true },
      { new: true }
    );
    if (!todo) {
      throw new Error(`Todo with ID ${args.id} not found`);
    }
    return `Completed todo: "${todo.task}" (ID: ${args.id})`;
  },

  deleteTodo: async (args) => {
    const todo = await Todo.findByIdAndDelete(args.id);
    if (!todo) {
      throw new Error(`Todo with ID ${args.id} not found`);
    }
    return `Deleted todo: "${todo.task}" (ID: ${args.id})`;
  },
};

module.exports = todoController;
