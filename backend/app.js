//entry point for the backend server-sets up the Express server-connects to the database-handles API routes

require('dotenv').config(); 

console.log('API Key:', process.env.SPOONACULAR_API_KEY); 

const express = require('express'); 
const path = require('path'); 
const cors = require('cors'); 


require('./initDb'); 

const recipesRouter = require('./recipes'); 

const app = express(); 


app.use(express.static(path.join(__dirname, '../public')));

app.use(express.static(path.join(__dirname, '../public'))); 
app.use(cors()); 
app.use(express.json()); 
app.use('/api/recipes', recipesRouter); 


app.use((req, res, next) => {
  
  res.sendFile(path.join(__dirname, '../public/index.html'), (err) => {
    if (err) next(); 
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: 'Something went wrong!' }); 
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 



