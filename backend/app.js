require('dotenv').config(); // Load environment variables from .env file into process.env

console.log('API Key:', process.env.SPOONACULAR_API_KEY); // Debug line: Print API key to console to confirm it's loaded

const express = require('express'); // Express is used for building the API and handling routes
const path = require('path'); // Path is used for handling file and directory paths
const cors = require('cors'); // Enables Cross-Origin Resource Sharing, allowing the frontend to access the API


require('./initDb'); // Initialize DB table structure if they don't exist

const recipesRouter = require('./recipes'); // Rount handler for recipe-related API endpoints

const app = express(); // Create an instance of the Express application

// Serve static frontend files from the public directory (e.g., index.html, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory, allowing the frontend to access them
app.use(cors()); // Enable CORS for all routes so that the frontend can make requests to the backend
app.use(express.json()); // Parse incoming JSON requests, allowing the API to handle JSON payloads
app.use('/api/recipes', recipesRouter); // Mount the recipes router on the /api/recipes path

// 404 handler – catches unknown API routes
app.use((req, res, next) => {
  // If the request is for an HTML file that doesn't exist, serve index.html as a fallback
  res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
    if (err) next(); // If index.html isn't found, fallback to error middleware
  });
});

// Error-handling middleware – catches server errors and returns a JSON response
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace to the console for debugging
  res.status(500).json({ error: 'Something went wrong!' }); // Respond with a 500 status code and a JSON error message
});

const PORT = process.env.PORT || 4000; //Start the server on the port specified in the environment variable or default to 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Log a message to the console when the server starts successfully



