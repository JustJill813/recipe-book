// /backend/database.js
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 and enable verbose mode for detailed error messages
const path = require('path'); //Import Node's path module to help resolve the correct file path for the database

const dbPath = path.resolve(__dirname, '../data/recipes.db');//Construct the full path to the database file located in /data/recipes.db
const db = new sqlite3.Database(dbPath); //Open (or create if it doesn't exist) the SQLite database at the resolved path

module.exports = db; //Export the database object so it can be used in other parts of the application
// This allows other modules to import this database connection and use it to interact with the SQLite database
