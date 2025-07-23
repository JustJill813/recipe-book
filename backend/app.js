const express = require('express');
const app = express();
require('dotenv').config();

const recipesRouter = require('./recipes');

app.use(express.json());
app.use('/api/recipes', recipesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
