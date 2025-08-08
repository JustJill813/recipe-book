// API handlers for recipes-defines how frontend interacts w/recipe data

const express = require('express'); 
const router = express.Router(); 
const db = require('./database'); 
const { getNutrition } = require('./spoonacular-clean'); 


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


router.get('/', (req, res) => {
  db.all('SELECT * FROM recipes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.get('/:id/nutrition', async (req, res) => {
  const { id } = req.params;

  
  db.get('SELECT name, ingredients, instructions, servings FROM recipes WHERE id = ?', [id], async (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Recipe not found' });

    
    const ingredientsArray = row.ingredients
      .split('\n')
      .map(str => str.trim())
      .filter(Boolean);

    try { 
      const nutritionData = await getNutrition(row.name, ingredientsArray, row.instructions, row.servings);
      res.json(nutritionData); 
    } catch (e) {
      console.error('Spoonacular error:', e);
      res.status(500).json({ error: 'Nutrition fetch failed' });
    }
  });
});


router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM recipes WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Recipe not found' });
    res.json(row);
  });
});


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


router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM recipes WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});


module.exports = router;
