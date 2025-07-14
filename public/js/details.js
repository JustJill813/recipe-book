document.addEventListener('DOMContentLoaded', () => {
  const recipe = JSON.parse(localStorage.getItem('selectedRecipe'));
  if (!recipe) return;

  document.getElementById('recipe-title').textContent = recipe.name;
  document.getElementById('servings').textContent = recipe.servings || '—';
  document.getElementById('prepTime').textContent = recipe.prepTime || '—';
  document.getElementById('cookTime').textContent = recipe.cookTime || '—';
  document.getElementById('recipe-ingredients').textContent = recipe.ingredients;
  document.getElementById('recipe-instructions').textContent = recipe.instructions;
  document.getElementById('recipe-notes').textContent = recipe.notes || 'None';
});
