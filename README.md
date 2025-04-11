# Todo App using MCP Server

A simple Todo application enhanced with natural language processing using the Google Gemini API, MongoDB for persistence, and MCP (Model Context Protocol) for real-time updates via Server-Sent Events (SSE). Built using a modular MVC architecture with Express.js.

---

## Features

- Add todos using natural language (e.g., "Add a task to buy milk")
- List todos (optionally include completed ones)
- Mark todos as complete using their MongoDB ID
- Delete todos by their MongoDB ID
- Receive real-time updates using Server-Sent Events (SSE) with MCP

---

## Tech Stack

- Node.js: Server runtime
- Express.js: Routing and middleware
- MongoDB (Atlas): Cloud-based NoSQL database
- Mongoose: ODM for MongoDB
- Google Gemini API: Handles natural language command interpretation
- @modelcontextprotocol/sdk: For MCP integration and SSE
- dotenv: For managing environment variables

---

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas cluster (credentials required)
- Google Gemini API Key (available from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/theatulanand/to-do-mcp-server.git
   cd todo-mcp-single
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```
   PORT=3000
   MONGO_URI=URI
   GEMINI_API_KEY=
   ```

   

---

## Running the App

Start the server:

```bash
npm start
```

You should see:

```
Connected to MongoDB with Mongoose
Server running on http://localhost:3000
```

To stop the server, press `Ctrl + C`.

---

## How to Use

Send a POST request to `/api/command` with a JSON body:
```json
{ "command": "Add a task to buy milk" }
```

### Example Commands

- Add:
  ```bash
  curl -X POST http://localhost:3000/api/command -H "Content-Type: application/json" -d '{"command": "Add a task to buy milk"}'
  ```

- List:
  ```bash
  curl -X POST http://localhost:3000/api/command -H "Content-Type: application/json" -d '{"command": "List my todos"}'
  ```

- Complete:
  ```bash
  curl -X POST http://localhost:3000/api/command -H "Content-Type: application/json" -d '{"command": "Complete todo with ID some_mongodb_id"}'
  ```

- Delete:
  ```bash
  curl -X POST http://localhost:3000/api/command -H "Content-Type: application/json" -d '{"command": "Delete todo with ID some_mongodb_id"}'
  ```

- List including completed:
  ```bash
  curl -X POST http://localhost:3000/api/command -H "Content-Type: application/json" -d '{"command": "List my todos including completed"}'
  ```

---

## Real-time Updates (SSE)

Connect to `/sse` to receive live updates. (Requires MCP-compatible client.)

---

## Project Structure

```
todo-mcp-single/
├── models/           # Mongoose schemas
│   └── Todo.js
├── controllers/      # Business logic
│   └── todoController.js
├── routes/           # API routes
│   └── todoRoutes.js
├── utils/            # Utility functions (e.g., Gemini integration)
│   └── gemini.js
├── .env              # Environment configuration
└── server.js         # App entry point
```

---

## Troubleshooting

- **MongoDB Connection Failed**: Check MONGO_URI and IP whitelist in Atlas.
- **Gemini API Errors**: Validate API key and network access to `generativelanguage.googleapis.com`.
- **Unrecognized Commands**: Check Gemini raw output in logs for debugging.

---

