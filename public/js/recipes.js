document.addEventListener('DOMContentLoaded', () => { 
  const gallery = document.getElementById('recipe-gallery'); 

  // Fetch recipes from backend API
  fetch('/api/recipes') 
    .then(res => res.json()) 
    .then(recipes => { 
      gallery.innerHTML = ''; 

      recipes.forEach((recipe) => { 
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

          // Store recipe ID for recipe.html
          localStorage.setItem('selectedRecipeId', recipe.id); 
          window.location.href = 'recipe.html'; 
        });

        // Button-edit
        const editBtn = document.createElement('button'); 
        editBtn.className = 'edit-button'; 
        editBtn.textContent = 'Edit Recipe'; 
        editBtn.addEventListener('click', () => { 
          localStorage.setItem('editingRecipeId', recipe.id); 
          window.location.href = 'index.html'; 
        });

        // View/edit buttons
        const buttonGroup = document.createElement('div'); 
        buttonGroup.className = 'card-buttons'; 
        buttonGroup.appendChild(viewBtn); 
        buttonGroup.appendChild(editBtn); 

        // Append elements to card
        card.appendChild(title); 
        card.appendChild(snippet); 
        card.appendChild(fullText); 
        card.appendChild(buttonGroup); 
        gallery.appendChild(card); 
      });
    })

    // Handle errors in fetching recipes
    .catch(error => { 
      console.error('Error fetching recipes:', error); 
      gallery.innerHTML = '<p>⚠️ Could not load recipes. Please try again later.</p>'; 
    });
});



