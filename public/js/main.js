console.log('main.js is connected');

document.addEventListener('DOMContentLoaded', () => {

// In-memory recipe store (to be replaced with backend fetch/save logic)
let recipes = [];
let editingIndex = null;

// DOM references
const form = document.getElementById('recipe-form');
const nameInput = document.getElementById('name');
const ingredientsInput = document.getElementById('ingredients');
const instructionsInput = document.getElementById('instructions');
const tableBody = document.getElementById('recipe-table-body');

// Buttons
document.getElementById('add-btn').addEventListener('click', addRecipe);
document.getElementById('edit-btn').addEventListener('click', loadRecipeForEdit);
document.getElementById('delete-btn').addEventListener('click', deleteRecipe);
form.addEventListener('submit', saveChanges);

// Render the table
function renderRecipes() {
  tableBody.innerHTML = '';
  recipes.forEach((recipe, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${recipe.name}</td>
      <td>${recipe.ingredients}</td>
      <td>${recipe.instructions}</td>
    `;
    row.addEventListener('click', () => selectRecipe(index));
    tableBody.appendChild(row);
  });
}

// Add new recipe
function addRecipe() {
  const recipe = getFormData();
  if (recipe) {
    recipes.push(recipe);
    renderRecipes();
    resetForm();
  }
}

// Load recipe into form
function selectRecipe(index) {
  editingIndex = index;
  const recipe = recipes[index];
  nameInput.value = recipe.name;
  ingredientsInput.value = recipe.ingredients;
  instructionsInput.value = recipe.instructions;
}

// Edit selected recipe
function loadRecipeForEdit() {
  if (editingIndex !== null) {
    const recipe = getFormData();
    if (recipe) {
      recipes[editingIndex] = recipe;
      renderRecipes();
      resetForm();
      editingIndex = null;
    }
  }
}

// Delete selected recipe
function deleteRecipe() {
  if (editingIndex !== null) {
    recipes.splice(editingIndex, 1);
    renderRecipes();
    resetForm();
    editingIndex = null;
  }
}

// Save edits via submit button
function saveChanges(e) {
  e.preventDefault();
  loadRecipeForEdit();
}

// Helpers
function getFormData() {
  const name = nameInput.value.trim();
  const ingredients = ingredientsInput.value.trim();
  const instructions = instructionsInput.value.trim();
  if (!name || !ingredients || !instructions) {
    alert('Please fill out all fields.');
    return null;
  }
  return { name, ingredients, instructions };
}

function resetForm() {
  form.reset();
  editingIndex = null;
}
});
