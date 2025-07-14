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
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = ''; // Clear the list first

  recipes.forEach((recipe, index) => {
    const div = document.createElement('div');
    div.classList.add('recipe-name');
    div.textContent = recipe.name;
    div.addEventListener('click', () => selectRecipe(index));
    recipeList.appendChild(div);
  });
}


// Add new recipe
function addRecipe() {
  const recipe = getFormData();
  if (recipe) {
    recipes.push(recipe);
    saveToLocalStorage();
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
      saveToLocalStorage();
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
    saveToLocalStorage();
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

function saveToLocalStorage() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// When page loads, restore from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('recipes');
  if (saved) {
    recipes = JSON.parse(saved);
  }
  renderRecipes();
});


// Helpers
function getFormData() {
  const name = nameInput.value.trim();
  const ingredients = ingredientsInput.value.trim();
  const instructions = instructionsInput.value.trim();
  const servings = document.getElementById('servings').value.trim();
  const prepTime = document.getElementById('prepTime').value.trim();
  const cookTime = document.getElementById('cookTime').value.trim();
  const notes = document.getElementById('notes').value.trim();

  if (!name || !ingredients || !instructions) {
    alert('Please fill out recipe name, ingredients, and instructions.');
    return null;
  }

  return { name, ingredients, instructions, servings, prepTime, cookTime, notes };
}


function resetForm() {
  form.reset();
  editingIndex = null;
}
});
