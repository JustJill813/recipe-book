const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recipesRouter = require('./recipes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/recipes', recipesRouter);

// 404 handler – catches unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error-handling middleware – catches server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


