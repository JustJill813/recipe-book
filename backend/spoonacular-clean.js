// cleans/formats data from Spoonacular API

const axios = require('axios');


if (!process.env.SPOONACULAR_API_KEY) {
  console.error('Missing SPOONACULAR_API_KEY'); 
  process.exit(1);
}

const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000         
});

/**
 * Analyse a recipe and return the enriched data
 * @returns {Promise<object>}
 */
async function getNutrition(
  title,
  ingredients,
  instructions,
  servings = 1,
  includeNutrition = true,
  includeTaste = false,
  language = 'en'
) {
  try {
    const { data } = await spoonacular.post(
      '/recipes/analyze',
      { title, servings, ingredients, instructions },
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY,   
          includeNutrition,
          includeTaste,
          language
        }
      }
    );
    return data;
  } catch (err) {
    
    console.error(
      'Spoonacular error:',
      err.response?.status,
      err.response?.data || err.message
    );
    throw err;
  }
}

module.exports = { getNutrition };