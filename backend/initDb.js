// backend/initDb.js
const db = require('./database');

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
`, (err) => {
  if (err) {
    console.error('❌ Failed to create recipes table:', err);
  } else {
    console.log('✅ Recipes table is ready');
  }
});
