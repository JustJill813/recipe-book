// /backend/spoonacular.js
const axios = require('axios'); // ✅ Ensure Axios is installed
require('dotenv').config();     // ✅ Load .env variables

async function getNutrition(ingredientList) {
  try {
    const response = await axios.post(
      'https://api.spoonacular.com/recipes/analyze',
      {
        title: recipeTitle,
        ingredients: ingredientList, // 👉 This should be an array of strings
        instructions: instructions   // Optional but helps with accuracy
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.SPOONACULAR_API_KEY // 👈 Your key in headers
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('getNutrition error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getNutrition };



