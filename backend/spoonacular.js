// /backend/spoonacular.js
const axios = require('axios');

async function getNutrition(ingredients, servings = 1) {
  const response = await axios.post(
    'https://api.spoonacular.com/recipes/parseIngredients',
    {
      ingredientList: ingredients,
      servings: servings
    },
    {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        apiKey: process.env.SPOONACULAR_KEY
      }
    }
  );

  console.log('Spoonacular response:', response.data);

  return response.data;
}

module.exports = { getNutrition };
