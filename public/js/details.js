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

          nutrition.forEach(item => {
            const line = document.createElement('p');
            const nutrientInfo = item.nutrients?.[0];
            line.textContent = `${item.name}: ${item.amount} ${item.unit}` +
              (nutrientInfo ? ` (${nutrientInfo.name}: ${nutrientInfo.amount} ${nutrientInfo.unit})` : '');
            nutritionBox.appendChild(line);
          });

          document.querySelector('.form-card').appendChild(nutritionBox);
        })
        .catch(err => {
          loadingMsg.remove();
          console.warn('Nutrition info unavailable:', err);
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

