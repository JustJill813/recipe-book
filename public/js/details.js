document.addEventListener('DOMContentLoaded', () => {
  const recipeId = localStorage.getItem('selectedRecipeId'); // Just store the ID
  if (!recipeId) return;

  fetch(`/api/recipes/${recipeId}`)
    .then(res => res.json())
    .then(recipe => {
      document.getElementById('recipe-title').textContent = recipe.name;
      document.getElementById('servings').textContent = recipe.servings || '—';
      document.getElementById('prepTime').textContent = recipe.prep_time || '—';
      document.getElementById('cookTime').textContent = recipe.cook_time || '—';
      document.getElementById('recipe-notes').textContent = recipe.notes || 'None';

      // Instructions
      const steps = recipe.instructions.split('\n').filter(step => step.trim());
      const instructionList = document.createElement('ol');
      instructionList.className = 'instruction-list';
      steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step.trim();
        instructionList.appendChild(li);
      });
      const instructionContainer = document.getElementById('recipe-instructions');
      instructionContainer.innerHTML = '';
      instructionContainer.appendChild(instructionList);

      // Ingredients
      const ingredientsContainer = document.getElementById('recipe-ingredients');
      ingredientsContainer.innerHTML = '';
      const ingredients = recipe.ingredients.split('\n').filter(item => item.trim());
      ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient.trim();
        ingredientsContainer.appendChild(li);
      });

      // 🍽️ Nutrition Info
      fetch(`/api/recipes/${recipeId}/nutrition`)
        .then(res => res.json())
        .then(nutrition => {
          const nutritionBox = document.createElement('div');
          nutritionBox.className = 'nutrition-box';
          nutrition.forEach(item => {
            const line = document.createElement('p');
            line.textContent = `${item.name}: ${item.amount} ${item.unit} (${item.nutrients?.[0]?.name || 'Calories'}: ${item.nutrients?.[0]?.amount} ${item.nutrients?.[0]?.unit})`;
            nutritionBox.appendChild(line);
          });
          document.querySelector('.form-card').appendChild(nutritionBox);
        })
        .catch(err => {
          console.warn('Nutrition info unavailable:', err);
        });
    })
    .catch(err => {
      console.warn('Failed to load recipe details:', err);
    });
});
