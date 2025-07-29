console.log('main.js is connected');

document.addEventListener('DOMContentLoaded', () => {
  let recipes = [];
  let editingId = null;

  const form = document.getElementById('recipe-form');
  const nameInput = document.getElementById('name');
  const ingredientsInput = document.getElementById('ingredients');
  const instructionsInput = document.getElementById('instructions');

  document.getElementById('add-btn').addEventListener('click', addRecipe);
  document.getElementById('edit-btn').addEventListener('click', editRecipe);
  document.getElementById('delete-btn').addEventListener('click', deleteRecipe);
  form.addEventListener('submit', saveChanges);

  function loadRecipes() {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => {
        recipes = data;
        renderRecipes();
      });
  }

  function renderRecipes() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    recipes.forEach(recipe => {
      const div = document.createElement('div');
      div.classList.add('recipe-name');
      div.textContent = recipe.name;
      div.addEventListener('click', () => selectRecipe(recipe.id));
      recipeList.appendChild(div);
    });
  }

  function getFormData() {
    const name = nameInput.value.trim();
    const ingredients = ingredientsInput.value.trim();
    const instructions = instructionsInput.value.trim();
    const servings = document.getElementById('servings').value.trim();
    const prepTime = document.getElementById('prepTime').value.trim();
    const cookTime = document.getElementById('cookTime').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!name || !ingredients || !instructions) {
      alert('Please fill out name, ingredients, and instructions.');
      return null;
    }

    return { name, ingredients, instructions, servings, prep_time: prepTime, cook_time: cookTime, notes };
  }

  function addRecipe() {
    const recipe = getFormData();
    if (!recipe) return;

    fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    })
    .then(res => res.json())
    .then(() => {
      resetForm();
      loadRecipes();
    });
  }

  function selectRecipe(id) {
    const recipe = recipes.find(r => r.id === id);
    editingId = id;

 // Save for use on recipe.html
  localStorage.setItem('selectedRecipeId', recipe.id);

    nameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients;
    instructionsInput.value = recipe.instructions;
    document.getElementById('servings').value = recipe.servings || '';
    document.getElementById('prepTime').value = recipe.prep_time || '';
    document.getElementById('cookTime').value = recipe.cook_time || '';
    document.getElementById('notes').value = recipe.notes || '';
  }

  function editRecipe() {
    if (editingId === null) return;
    const updatedRecipe = getFormData();
    if (!updatedRecipe) return;

    fetch(`/api/recipes/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRecipe)
    })
    .then(res => res.json())
    .then(() => {
      resetForm();
      editingId = null;
      loadRecipes();
    });
  }

  function deleteRecipe() {
    if (editingId === null) return;

    fetch(`/api/recipes/${editingId}`, {
      method: 'DELETE'
    })
    .then(() => {
      resetForm();
      editingId = null;
      loadRecipes();
    });
  }

  function saveChanges(e) {
    e.preventDefault();
    editRecipe();
  }

  function resetForm() {
    form.reset();
    editingId = null;
  }

  // Initial load
  loadRecipes();
});
