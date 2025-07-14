document.addEventListener('DOMContentLoaded', () => {
  const recipe = JSON.parse(localStorage.getItem('selectedRecipe'));
  if (!recipe) return;

  document.getElementById('recipe-title').textContent = recipe.name;
  document.getElementById('recipe-ingredients').textContent = recipe.ingredients;
  document.getElementById('recipe-instructions').textContent = recipe.instructions;
});
