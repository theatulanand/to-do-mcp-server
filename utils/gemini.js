const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const processCommandWithGemini = async (command, tools) => {
  const toolNames = Object.keys(tools).join(', ');

  const prompt = `
    You are an assistant that maps natural language commands to specific tool calls for a Todo app.
    Available tools: ${toolNames}.
    Based on the command below, determine which tool to call and provide the arguments in JSON format.
    Note: The "id" for tools like "complete_todo" or "delete_todo" should be a string matching the MongoDB _id.
    For "list_todos", always include an "arguments" object with "showCompleted" (boolean, optional, default false).
    For "add_todo", use "task" as the argument key for the todo description.
    If no tool matches, return an error message in plain text.

    Command: "${command}"
  `;

  console.log('Sending prompt to Gemini:', prompt);
  const result = await model.generateContent(prompt);
  let responseText = result.response.text();
  console.log('Raw Gemini response:', responseText);

  responseText = responseText.replace(/```json\s*|\s*```/g, '').trim();
  console.log('Cleaned Gemini response:', responseText);

  const parsed = JSON.parse(responseText);
  if (parsed.error) {
    return parsed.error;
  }

  const { tool, arguments: args = {} } = parsed;
  console.log('Parsed tool:', tool);
  console.log('Parsed args:', args);

  if (tool === 'add_todo' && args.description) {
    args.task = args.description;
    delete args.description;
  }

  return { tool, args };
};

module.exports = { processCommandWithGemini };
