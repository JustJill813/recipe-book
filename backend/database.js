// /sets up/manages database
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3
const path = require('path'); 
require('dotenv').config(); 

const dbName = process.env.DATABASE_NAME || 'recipes.db'; 

const dbPath = path.resolve(__dirname, '../data/recipes.db');
console.log('📦 Using database at:', dbPath); 

const db = new sqlite3.Database(dbPath); 

module.exports = db; 

