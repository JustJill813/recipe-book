require('dotenv').config();

console.log('API Key:', process.env.SPOONACULAR_API_KEY); // Debug line

const express = require('express');
const path = require('path'); // ✅ Needed for static path resolution
const cors = require('cors');


require('./initDb'); // Initialize DB table structure

const recipesRouter = require('./recipes');

const app = express();

// 🔧 Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(express.json());
app.use('/api/recipes', recipesRouter);

// 404 handler – catches unknown API routes
app.use((req, res, next) => {
  // If the request is for an HTML file that doesn't exist, serve index.html as a fallback
  res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
    if (err) next(); // If index.html isn't found, fallback to error middleware
  });
});

// Error-handling middleware – catches server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



