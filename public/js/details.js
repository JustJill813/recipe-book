document.addEventListener('DOMContentLoaded', () => { // Wait for the DOM to load

  // Get selected recipe ID from localStorage
  const recipeId = localStorage.getItem('selectedRecipeId'); 
    document.body.innerHTML = '<p>⚠️ No recipe selected. Please go back and choose one.</p>';
    return;
  }

  // Fetch recipe details from the API(backend)
  fetch(`/api/recipes/${recipeId}`)
    .then(res => res.json())
    .then(recipe => {
      // Check if recipe data is valid(populate basic recipe details)
      document.getElementById('recipe-title').textContent = recipe.name;
      document.getElementById('servings').textContent = recipe.servings || '—';
      document.getElementById('prepTime').textContent = recipe.prep_time || '—';
      document.getElementById('cookTime').textContent = recipe.cook_time || '—';
      document.getElementById('recipe-notes').textContent = recipe.notes || 'None';

      // Render instructions as an ordered list
      const instructionContainer = document.getElementById('recipe-instructions'); // Clear previous content
      instructionContainer.innerHTML = ''; // Create a new ordered list for instructions
      const steps = recipe.instructions.split('\n').filter(step => step.trim()); // Split instructions by new lines and filter out empty steps
      const instructionList = document.createElement('ol'); // Create an ordered list element
      instructionList.className = 'instruction-list'; // Add class for styling
      steps.forEach(step => { // Iterate through each step
        const li = document.createElement('li'); // Create a list item for each step
        li.textContent = step.trim(); // Trim whitespace from the step
        instructionList.appendChild(li); // Append the list item to the ordered list
      });
      instructionContainer.appendChild(instructionList); // Append the ordered list to the instruction container

      // Render ingredients as an unorderd list
      const ingredientsContainer = document.getElementById('recipe-ingredients'); // Clear previous content
      ingredientsContainer.innerHTML = ''; // Create a new unordered list for ingredients
      const ingredients = recipe.ingredients.split('\n').filter(item => item.trim()); // Split ingredients by new lines and filter out empty items
      ingredients.forEach(ingredient => { // Iterate through each ingredient
        const li = document.createElement('li'); // Create a list item for each ingredient
        li.textContent = ingredient.trim(); // Trim whitespace from the ingredient
        ingredientsContainer.appendChild(li); // Append the list item to the unordered list
      });

      // Nutrition Info(asynchronous fetch from Spoonacular API)
      const loadingMsg = document.createElement('p'); // Create a loading message element
      loadingMsg.textContent = 'Fetching nutrition info...'; // Set the text content to indicate loading
      document.querySelector('.form-card').appendChild(loadingMsg); // Append the loading message to the form card

      fetch(`/api/recipes/${recipeId}/nutrition`) // Fetch nutrition info from the API
        .then(res => res.json()) // Parse the response as JSON
        .then(nutrition => { // Handle the nutrition data
          loadingMsg.remove(); // Remove the loading message once data is received
          const nutritionBox = document.createElement('div'); // Create a new div for nutrition info
          nutritionBox.className = 'nutrition-box'; // Add a class for styling

          console.log("Nutrition response object:", nutrition); // Log the entire nutrition response object for debugging

          if (nutrition?.nutrients && Array.isArray(nutrition.nutrients)) { // Check if nutrition data is in the expected format
            nutrition.nutrients.forEach(nutrient => { // Iterate through each nutrient
              const line = document.createElement('p'); // Create a paragraph for each nutrient
              line.textContent = `${nutrient.name}: ${nutrient.amount} ${nutrient.unit}`; // Set the text content to show nutrient name, amount, and unit
              nutritionBox.appendChild(line); // Append the nutrient line to the nutrition box
            });
          } else if (nutrition?.status === "failure") { // Check if the response indicates a failure
            console.warn("Spoonacular error:", nutrition.message); // Log the error message from the Spoonacular API
            const fallback = document.createElement('p'); // Create a fallback message element
            fallback.textContent = 'Nutrition info not authorized.'; // Set the text content to indicate authorization failure
            nutritionBox.appendChild(fallback); // Append the fallback message to the nutrition box
          } else { // Handle unexpected formats
            console.log("Received nutrition data:", nutrition); // Log the received nutrition data for debugging
            console.warn("Unexpected format:", nutrition); // Log a warning for unexpected formats
            const fallback = document.createElement('p'); // Create a fallback message element
            fallback.textContent = 'Nutrition info unavailable.'; // Set the text content to indicate unavailability
            nutritionBox.appendChild(fallback); // Append the fallback message to the nutrition box
          }

          document.querySelector('.form-card').appendChild(nutritionBox); // Append the nutrition box to the form card
        })
        .catch(err => { // Handle any errors during the fetch
          loadingMsg.remove(); // Remove the loading message if an error occurs
          console.warn("Nutrition fetch error:", err); // Log the error for debugging
          const fallback = document.createElement('p'); // Create a fallback message element
          fallback.textContent = 'Nutrition info could not be loaded.'; // Set the text content to indicate loading failure
          document.querySelector('.form-card').appendChild(fallback); // Append the fallback message to the form card
        });

      // Edit & Delete buttons
      const buttonRow = document.createElement('div'); // Create a new div for buttons
      buttonRow.className = 'form-buttons'; // Add a class for styling

      const editLink = document.createElement('a'); // Create an anchor element for the edit link
      editLink.href = `edit.html?id=${recipeId}`; // Set the href to the edit page with the recipe ID
      editLink.textContent = '✏️ Edit'; // Set the text content to indicate editing
      editLink.className = 'button-link'; // Add a class for styling

      const deleteBtn = document.createElement('button'); // Create a button for deleting the recipe
      deleteBtn.textContent = '🗑️ Delete'; 
      deleteBtn.className = 'button-link';
      deleteBtn.onclick = () => { // Set the onclick event to handle deletion
        if (confirm('Are you sure you want to delete this recipe?')) { // Confirm deletion
          fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' }) // Send a DELETE request to the API with the recipe ID
            .then(res => res.json()) // Parse the response as JSON
            .then(result => { // Handle the result of the deletion
              if (result.deleted) { // Check if the deletion was successful
                alert('Recipe deleted!'); // Show a success message
                window.location.href = 'recipes.html'; // Redirect to the recipes page
              } else { // Handle deletion failure
                alert('Failed to delete the recipe.'); // Show an error message
              }
            });
        }
      };

      buttonRow.appendChild(editLink); // Append the edit link to the button row
      buttonRow.appendChild(deleteBtn); // Append the delete button to the button row
      document.querySelector('.form-card').appendChild(buttonRow); // Append the button row to the form card
    })
    .catch(err => { // Handle any errors during the fetch
      console.warn('Failed to load recipe details:', err); // Log the error for debugging
      document.body.innerHTML = '<p>⚠️ Recipe details could not be loaded. Please try again.</p>'; // Show an error message if the recipe details could not be loaded
    });
});



