document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('all-recipe-table-body');

  // Pull recipes from localStorage (used by main.js)
  const raw = localStorage.getItem('recipes');
  const recipes = raw ? JSON.parse(raw) : [];

  recipes.forEach(recipe => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${recipe.name}</td>
      <td>${recipe.ingredients}</td>
      <td>${recipe.instructions}</td>
    `;
    tableBody.appendChild(row);
  });
});

