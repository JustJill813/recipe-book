document.addEventListener('DOMContentLoaded', () => {
  const recipe = JSON.parse(localStorage.getItem('selectedRecipe'));
  if (!recipe) return;

  document.getElementById('recipe-title').textContent = recipe.name;
  document.getElementById('servings').textContent = recipe.servings || '—';
  document.getElementById('prepTime').textContent = recipe.prepTime || '—';
  document.getElementById('cookTime').textContent = recipe.cookTime || '—';
  document.getElementById('recipe-notes').textContent = recipe.notes || 'None';

  // ✅ Instructions as numbered steps
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

  // ✅ Ingredients as bulleted items in two columns
  const ingredientsContainer = document.getElementById('recipe-ingredients');
  ingredientsContainer.innerHTML = '';
  const ingredients = recipe.ingredients.split('\n').filter(item => item.trim());
  ingredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient.trim();
    ingredientsContainer.appendChild(li);
  });
});
