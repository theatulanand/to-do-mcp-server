require('dotenv').config();
const express = require('express');
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const todoController = require('./controllers/todoController');

// MongoDB Connection
async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB with Mongoose');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    throw err;
  }
}

// Initialize MCP Server
const server = new McpServer({
  name: 'todo-mcp-server',
  version: '1.0.0',
});

// Register Tools with MCP Server (for SSE compatibility)
server.tool('add_todo', { task: 'string' }, todoController.addTodo);
server.tool('list_todos', { showCompleted: 'boolean?' }, todoController.listTodos);
server.tool('complete_todo', { id: 'string' }, todoController.completeTodo);
server.tool('delete_todo', { id: 'string' }, todoController.deleteTodo);

// Set Up Express App
const app = express();
const transports = {};

app.use(express.json());
app.use('/api', todoRoutes);

app.get('/sse', async (req, res) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on('close', () => delete transports[transport.sessionId]);
  await server.connect(transport);
});

app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => console.error('Failed to start server:', err));
