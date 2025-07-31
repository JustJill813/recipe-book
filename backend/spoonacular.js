const axios = require('axios'); // Import axios for HTTP requests
require('dotenv').config();     // Load environment variables from .env file
console.log('Spoonacular API Key:', process.env.SPOONACULAR_API_KEY); // Log the API key for debugging

//Main function to send recipe info to Spoonacular and get nutrition details
async function getNutrition(recipeTitle, ingredientsArray, instructions) { 
  try { // Extracting recipe title, ingredients, and instructions
    const response = await axios.post( //Make a POST request to Spoonacular API(recipes/analyze endpoint)
      'https://api.spoonacular.com/recipes/analyze',
      {
        title: recipeTitle,          // This should be a string
        ingredients: ingredientsArray, // This should be an array of ingredient strings
        instructions: instructions   // Optional but helps with accuracy
      },
      {
        headers: {
          'Content-Type': 'application/json', //Tell Spoonacular we're sending JSON data
          'x-api-key': process.env.SPOONACULAR_API_KEY // Load your API key from .env file
        }
      }
    );

    //Return the nutrition section of Spoonacular's response
    return response.data;
  } catch (error) {
    console.error('getNutrition error:', error.response?.data || error.message); //Log any errors from the API call
    throw error; // Rethrow the error to be handled by the caller(upstream)
  }
}

module.exports = { getNutrition }; // Export the getNutrition function for use in other files(like recipes.js)



