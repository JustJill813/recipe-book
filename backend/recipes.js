const express = require('express');
const router = express.Router();
const db = require('./database'); // ✅ Using centralized DB module
const { getNutrition } = require('./spoonacular'); // ✅ Clean import

// Ensure table exists (you could move this to database.js later)
db.run(`CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  ingredients TEXT,
  instructions TEXT,
  servings TEXT,
  prep_time TEXT,
  cook_time TEXT,
  notes TEXT
)`);

// GET all recipes
router.get('/', (req, res) => {
  db.all('SELECT * FROM recipes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single recipe
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM recipes WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Recipe not found' });
    res.json(row);
  });
});

// POST new recipe
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

// PUT update recipe
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

// DELETE recipe
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM recipes WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// GET nutrition info via Spoonacular
router.get('/:id/nutrition', async (req, res) => {
  const { id } = req.params;

  db.get('SELECT ingredients FROM recipes WHERE id = ?', [id], async (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Recipe not found' });

    try {
      const nutritionData = await getNutrition(row.ingredients);
      res.json(nutritionData);
    } catch (e) {
      console.error('Spoonacular error:', e);
      res.status(500).json({ error: 'Nutrition fetch failed' });
    }
  });
});

module.exports = router;
