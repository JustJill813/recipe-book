// analyse.js

const axios = require('axios');


if (!process.env.SPOONACULAR_API_KEY) {
  console.error('Missing SPOONACULAR_API_KEY'); // fail fast
  process.exit(1);
}

const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000         // 10 s guard-rail
});

/**
 * Analyse a recipe and return the enriched data
 * @returns {Promise<object>}
 */
async function getNutrition(
  title,
  ingredients,
  instructions,
  servings = 1,
  includeNutrition = true,
  includeTaste = false,
  language = 'en'
) {
  try {
    const { data } = await spoonacular.post(
      '/recipes/analyze',
      { title, servings, ingredients, instructions },
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,   // <-- in URL
          includeNutrition,
          includeTaste,
          language
        }
      }
    );
    return data;
  } catch (err) {
    // Surface actionable context instead of swallowing it
    console.error(
      'Spoonacular error:',
      err.response?.status,
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { getNutrition };
9:36
recipe.js should look like is
const express = require('express'); // Importing express to create the router
const router = express.Router(); // Importing the database module and Spoonacular API utility-creates a new router instance
const db = require('./database'); // Importing the SQLite database ojbect
const { getNutrition } = require('./spoonacular'); // Importing the function to get nutrition info from Spoonacular

// Ensure the recipes table exists
db.run(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    ingredients TEXT,
    instructions TEXT,
    servings TEXT,
    prep_time TEXT,
    cook_time TEXT,
    notes TEXT
  )
`);

//  GET all recipes-retreives all recipes from the database(read operation)
router.get('/', (req, res) => {
  db.all('SELECT * FROM recipes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🧪 GET nutrition info via Spoonacular(external API integration) - MUST BE BEFORE /:id route
router.get('/:id/nutrition', async (req, res) => {
  const { id } = req.params;

  // Fetch the recipe by ID to get its ingredients and instructions
  db.get('SELECT name, ingredients, instructions, servings FROM recipes WHERE id = ?', [id], async (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Recipe not found' });

    //Convert ingredients to an array by splitting into new lines and trimming whitespace
    const ingredientsArray = row.ingredients
      .split('\n')
      .map(str => str.trim())
      .filter(Boolean);

    try { // Call the Spoonacular API to get nutrition data
      // Pass the recipe name, ingredients array, and instructions to the getNutrition function
      const nutritionData = await getNutrition(row.name, ingredientsArray, row.instructions, row.servings);
      res.json(nutritionData); // Return the nutrition data as JSON
    } catch (e) {
      console.error('Spoonacular error:', e);
      res.status(500).json({ error: 'Nutrition fetch failed' });
    }
  });
});

//  GET a specific recipe by ID(read operation) - MUST BE AFTER /:id/nutrition route
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM recipes WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Recipe not found' });
    res.json(row);
  });
});

//  POST a new recipe(create operation)
router.post('/', (req, res) => {
  const { name, ingredients, instructions, servings, prep_time, cook_time, notes } = req.body;
  db.run(
    `INSERT INTO recipes (name, ingredients, instructions, servings, prep_time, cook_time, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, ingredients, instructions, servings, prep_time, cook_time, notes],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

//  PUT to update a recipe's data(update operation)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, ingredients, instructions, servings, prep_time, cook_time, notes } = req.body;
  db.run(
    `UPDATE recipes SET name = ?, ingredients = ?, instructions = ?, servings = ?, prep_time = ?, cook_time = ?, notes = ?
     WHERE id = ?`,
    [name, ingredients, instructions, servings, prep_time, cook_time, notes, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

//  DELETE a recipe(delete operation)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM recipes WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Export the router to use in app.js
module.exports = router;