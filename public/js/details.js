document.addEventListener('DOMContentLoaded', () => {
  const recipeId = localStorage.getItem('selectedRecipeId');
  if (!recipeId) {
    document.body.innerHTML = '<p>⚠️ No recipe selected. Please go back and choose one.</p>';
    return;
  }

  fetch(`/api/recipes/${recipeId}`)
    .then(res => res.json())
    .then(recipe => {
      document.getElementById('recipe-title').textContent = recipe.name;
      document.getElementById('servings').textContent = recipe.servings || '—';
      document.getElementById('prepTime').textContent = recipe.prep_time || '—';
      document.getElementById('cookTime').textContent = recipe.cook_time || '—';
      document.getElementById('recipe-notes').textContent = recipe.notes || 'None';

      // 🥄 Instructions
      const instructionContainer = document.getElementById('recipe-instructions');
      instructionContainer.innerHTML = '';
      const steps = recipe.instructions.split('\n').filter(step => step.trim());
      const instructionList = document.createElement('ol');
      instructionList.className = 'instruction-list';
      steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step.trim();
        instructionList.appendChild(li);
      });
      instructionContainer.appendChild(instructionList);

      // 🧂 Ingredients
      const ingredientsContainer = document.getElementById('recipe-ingredients');
      ingredientsContainer.innerHTML = '';
      const ingredients = recipe.ingredients.split('\n').filter(item => item.trim());
      ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient.trim();
        ingredientsContainer.appendChild(li);
      });

      // 🍽️ Nutrition Info from Spoonacular
      const loadingMsg = document.createElement('p');
      loadingMsg.textContent = 'Fetching nutrition info...';
      document.querySelector('.form-card').appendChild(loadingMsg);

      fetch(`/api/recipes/${recipeId}/nutrition`)
        .then(res => res.json())
        .then(nutrition => {
          loadingMsg.remove();
          const nutritionBox = document.createElement('div');
          nutritionBox.className = 'nutrition-box';

          console.log("Nutrition response object:", nutrition);

          if (nutrition?.nutrients && Array.isArray(nutrition.nutrients)) {
            nutrition.nutrients.forEach(nutrient => {
              const line = document.createElement('p');
              line.textContent = `${nutrient.name}: ${nutrient.amount} ${nutrient.unit}`;
              nutritionBox.appendChild(line);
            });
          } else if (nutrition?.status === "failure") {
            console.warn("Spoonacular error:", nutrition.message);
            const fallback = document.createElement('p');
            fallback.textContent = 'Nutrition info not authorized.';
            nutritionBox.appendChild(fallback);
          } else {
            console.warn("Unexpected format:", nutrition);
            const fallback = document.createElement('p');
            fallback.textContent = 'Nutrition info unavailable.';
            nutritionBox.appendChild(fallback);
          }

          document.querySelector('.form-card').appendChild(nutritionBox);
        })
        .catch(err => {
          loadingMsg.remove();
          console.warn("Nutrition fetch error:", err);
          const fallback = document.createElement('p');
          fallback.textContent = 'Nutrition info could not be loaded.';
          document.querySelector('.form-card').appendChild(fallback);
        });

      // ✏️ Edit & 🗑️ Delete buttons
      const buttonRow = document.createElement('div');
      buttonRow.className = 'form-buttons';

      const editLink = document.createElement('a');
      editLink.href = `edit.html?id=${recipeId}`;
      editLink.textContent = '✏️ Edit';
      editLink.className = 'button-link';

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️ Delete';
      deleteBtn.className = 'button-link';
      deleteBtn.onclick = () => {
        if (confirm('Are you sure you want to delete this recipe?')) {
          fetch(`/api/recipes/${recipeId}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(result => {
              if (result.deleted) {
                alert('Recipe deleted!');
                window.location.href = 'recipes.html';
              } else {
                alert('Failed to delete the recipe.');
              }
            });
        }
      };

      buttonRow.appendChild(editLink);
      buttonRow.appendChild(deleteBtn);
      document.querySelector('.form-card').appendChild(buttonRow);
    })
    .catch(err => {
      console.warn('Failed to load recipe details:', err);
      document.body.innerHTML = '<p>⚠️ Recipe details could not be loaded. Please try again.</p>';
    });
});



