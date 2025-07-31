console.log('main.js is connected'); //Confirming connection to main.js

//Wait for the DOM to load before executing the script
document.addEventListener('DOMContentLoaded', () => {
  let recipes = []; // Array to hold recipes
  let editingId = null; // ID of the recipe being edited

  //Get form and input fields
  const form = document.getElementById('recipe-form'); // The form element for adding/editing recipes
  const nameInput = document.getElementById('name'); // Input for recipe name
  const ingredientsInput = document.getElementById('ingredients'); // Input for recipe ingredients
  const instructionsInput = document.getElementById('instructions'); // Input for recipe instructions

  //Button event listeners
  document.getElementById('add-btn').addEventListener('click', addRecipe); // Add button to create a new recipe
  document.getElementById('edit-btn').addEventListener('click', editRecipe); // Edit button to update an existing recipe
  document.getElementById('delete-btn').addEventListener('click', deleteRecipe); // Delete button to remove a recipe
  form.addEventListener('submit', saveChanges); // Form submission handler to save changes

  // Fetches and displays all recipes from the server
  function loadRecipes() { // Fetch recipes from the server
    fetch('/api/recipes') // API endpoint to get all recipes
      .then(res => res.json()) // Parse the JSON response
      .then(data => { // Update the recipes array with the fetched data
        recipes = data; // Store the fetched recipes in the recipes array
        renderRecipes(); // Call the function to render the recipes on the page
      });
  }

  //Display recipes in the UI in a list format
  function renderRecipes() { // Clear the current recipe list
    const recipeList = document.getElementById('recipe-list'); // The container where recipes will be displayed
    recipeList.innerHTML = ''; // Clear previous recipes

    recipes.forEach(recipe => { // Loop through each recipe in the recipes array
      const div = document.createElement('div'); // Create a new div for each recipe
      div.classList.add('recipe-name'); // Add a class for styling
      div.textContent = recipe.name; // Set the text content to the recipe name
      div.addEventListener('click', () => selectRecipe(recipe.id)); // Add a click event to select the recipe for editing
      recipeList.appendChild(div); // Append the new div to the recipe list
    });
  }
 // Function to get form data and validate it
  // Returns an object with the recipe data or null if validation fails
  function getFormData() { // Get values from the input fields
    const name = nameInput.value.trim(); // Get the trimmed value of the name input
    const ingredients = ingredientsInput.value.trim(); // Get the trimmed value of the ingredients input
    const instructions = instructionsInput.value.trim(); // Get the trimmed value of the instructions input
    const servings = document.getElementById('servings').value.trim(); // Get the trimmed value of the servings input
    const prepTime = document.getElementById('prepTime').value.trim(); // Get the trimmed value of the prep time input
    const cookTime = document.getElementById('cookTime').value.trim(); // Get the trimmed value of the cook time input
    const notes = document.getElementById('notes').value.trim(); // Get the trimmed value of the notes input

    if (!name || !ingredients || !instructions) { // Validate that name, ingredients, and instructions are not empty
      alert('Please fill out name, ingredients, and instructions.'); // Show an alert if validation fails
      return null; // Return null if validation fails
    }

    return { name, ingredients, instructions, servings, prep_time: prepTime, cook_time: cookTime, notes }; // Return an object with the recipe data
  }

  // Functions to handle adding, editing, and deleting recipes
  // These functions interact with the server API to perform CRUDL operations
  // CRUDL: Create, Read, Update, Delete, List

  // Function to add a new recipe via POST request
  // It retrieves form data, validates it, and sends it to the server
  function addRecipe() { // Get form data and validate it
    const recipe = getFormData(); // Retrieve the recipe data from the form
    if (!recipe) return;

    fetch('/api/recipes', { // Send a POST request to the server to add a new recipe
      method: 'POST', // Specify the HTTP method as POST
      headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
      body: JSON.stringify(recipe) // Convert the recipe object to a JSON string
    })
    .then(res => res.json()) // Parse the JSON response from the server
    .then(() => { // After successfully adding the recipe, reset the form and reload the recipes
      resetForm(); // Reset the form fields
      loadRecipes(); // Reload the recipes to display the newly added recipe
    });
  }

  // Function to select a recipe for editing
  // It populates the form with the selected recipe's data for editing
  function selectRecipe(id) { // Find the recipe by ID from the recipes array
    const recipe = recipes.find(r => r.id === id); // Get the recipe object from the recipes array using the provided ID
    editingId = id; // Set the editingId to the selected recipe's ID

 // Save for use on recipe.html
  localStorage.setItem('selectedRecipeId', recipe.id); // Store the selected recipe ID in localStorage

    nameInput.value = recipe.name; // Populate the name input with the recipe name
    ingredientsInput.value = recipe.ingredients; // Populate the ingredients input with the recipe ingredients
    instructionsInput.value = recipe.instructions; // Populate the instructions input with the recipe instructions
    document.getElementById('servings').value = recipe.servings || ''; // Populate the servings input with the recipe servings, or an empty string if not available
    document.getElementById('prepTime').value = recipe.prep_time || ''; // Populate the prep time input with the recipe prep time, or an empty string if not available
    document.getElementById('cookTime').value = recipe.cook_time || ''; // Populate the cook time input with the recipe cook time, or an empty string if not available
    document.getElementById('notes').value = recipe.notes || ''; // Populate the notes input with the recipe notes, or an empty string if not available
  }

  // Function to edit an existing recipe
  // It retrieves the updated data from the form and sends a PUT request to update the recipe
  // It also resets the form and reloads the recipes after updating
  function editRecipe() { // Check if there is a recipe being edited
    if (editingId === null) return; // If no recipe is being edited, exit the function
    const updatedRecipe = getFormData(); // Get the updated recipe data from the form
    if (!updatedRecipe) return; // If the updated recipe data is invalid, exit the function

    fetch(`/api/recipes/${editingId}`, { // Send a PUT request to update the recipe on the server
      method: 'PUT', // Specify the HTTP method as PUT
      headers: { 'Content-Type': 'application/json' }, // Set the content type to JSON
      body: JSON.stringify(updatedRecipe) // Convert the updated recipe object to a JSON string
    })
    .then(res => res.json()) // Parse the JSON response from the server
    .then(() => { // After successfully updating the recipe, reset the form and reload the recipes
      resetForm(); // Reset the form fields
      editingId = null; // Clear the editingId to indicate no recipe is being edited
      loadRecipes(); // Reload the recipes to display the updated recipe
    });
  }

  // Function to delete a recipe
  // It sends a DELETE request to the server to remove the selected recipe
  function deleteRecipe() { // Check if there is a recipe being edited
    if (editingId === null) return; // If no recipe is being edited, exit the function

    fetch(`/api/recipes/${editingId}`, { // Send a DELETE request to the server to delete the recipe
      method: 'DELETE' // Specify the HTTP method as DELETE
    })
    .then(() => { // After successfully deleting the recipe, reset the form and reload the recipes
      resetForm(); // Reset the form fields
      editingId = null; // Clear the editingId to indicate no recipe is being edited
      loadRecipes(); // Reload the recipes to remove the deleted recipe from the list
    }); 
  }
  
  // Function to handle form submission and save changes
  // It prevents the default form submission behavior and calls the editRecipe function
  function saveChanges(e) { // Prevent the default form submission behavior
    e.preventDefault(); // Prevent the form from submitting in the traditional way
    editRecipe(); // Call the editRecipe function to save changes
  }
  
  // Function to reset the form fields
  // It clears all input fields and sets the editingId to null
  function resetForm() { // Clear the input fields
    form.reset(); // Reset the form to its initial state
    editingId = null; // Clear the editingId to indicate no recipe is being edited
  }

  // Initial load of recipes when the page is ready
  loadRecipes();
});
