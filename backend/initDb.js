const db = require('./database'); //Import the database instance created in database.js

//Create the "recipes" table if it doesn't exist already
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
    
`, (err) => { //If there is an error during table creation, log it to the console
  if (err) {
    console.error('❌ Failed to create recipes table:', err);
  } else {
    console.log('✅ Recipes table is ready');
  }
});
