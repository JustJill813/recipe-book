document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('recipe-gallery');
  const savedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

  savedRecipes.forEach((recipe) => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    const title = document.createElement('h3');
    title.className = 'recipe-title';
    title.textContent = recipe.name;

    const snippet = document.createElement('p');
    snippet.className = 'recipe-snippet';
    snippet.textContent = recipe.instructions.substring(0, 60) + '...';

    const fullText = document.createElement('p');
    fullText.className = 'recipe-full';
    fullText.textContent = recipe.instructions;
    fullText.style.display = 'none';

    const viewBtn = document.createElement('button');
    viewBtn.className = 'view-button';
    viewBtn.textContent = 'View Recipe';
    viewBtn.addEventListener('click', () => {
      localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
      window.location.href = 'recipe.html';
  });

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-button';
  editBtn.textContent = 'Edit Recipe';
  editBtn.addEventListener('click', () => {
    localStorage.setItem('editingRecipe', JSON.stringify(recipe));
    window.location.href = 'index.html';
});

                                                                    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'card-buttons';

    buttonGroup.appendChild(viewBtn);
    buttonGroup.appendChild(editBtn);

    card.appendChild(title);
    card.appendChild(snippet);
    card.appendChild(fullText);
    card.appendChild(buttonGroup);
    gallery.appendChild(card);
  });
});


