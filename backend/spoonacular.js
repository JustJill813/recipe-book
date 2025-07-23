// /backend/spoonacular.js
const axios = require('axios');

async function getNutrition(ingredients, servings = 1) {
  const response = await axios.get('https://api.spoonacular.com/recipes/parseIngredients', {
    params: {
      ingredientList: ingredients,
      servings,
      apiKey: process.env.SPOONACULAR_KEY
    }
  });
  return response.data;
}

module.exports = { getNutrition };
