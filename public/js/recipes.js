document.addEventListener('DOMContentLoaded', () => { // Wait for the DOM to load before executing script
  const gallery = document.getElementById('recipe-gallery'); // Get the gallery element where recipes will be displayed

  // Fetch recipes from backend API
  // Assumes the backend API is set up to return a list of recipes in JSON format
  fetch('/api/recipes') // Adjust the URL to match your backend endpoint
    .then(res => res.json()) // Parse the JSON response
    .then(recipes => { // Process the list of recipes
      gallery.innerHTML = ''; // Clear any existing content

      recipes.forEach((recipe) => { // Loop through each recipe and create a card for it
        const card = document.createElement('div'); // Create a new div for the recipe card
        card.classList.add('recipe-card'); // Add a class for styling

        const title = document.createElement('h3'); // Create an h3 element for the recipe title
        title.className = 'recipe-title'; // Add a class for styling
        title.textContent = recipe.name; // Set the text content to the recipe name

        const snippet = document.createElement('p'); // Create a paragraph for the recipe snippet
        snippet.className = 'recipe-snippet'; // Add a class for styling
        snippet.textContent = recipe.instructions.substring(0, 60) + '...'; // Display the first 60 characters of instructions as a snippet

        const fullText = document.createElement('p'); // Create a paragraph for the full recipe instructions
        fullText.className = 'recipe-full'; // Add a class for styling
        fullText.textContent = recipe.instructions; // Set the full instructions text
        fullText.style.display = 'none'; // Initially hide the full text

        const viewBtn = document.createElement('button'); // Create a button to view the recipe
        viewBtn.className = 'view-button'; // Add a class for styling
        viewBtn.textContent = 'View Recipe'; // Set the button text
        viewBtn.addEventListener('click', () => { // Add click event to view the recipe

          // Store recipe ID for recipe.html to fetch from backend
          localStorage.setItem('selectedRecipeId', recipe.id); // Store the selected recipe ID in localStorage
          window.location.href = 'recipe.html'; // Redirect to recipe detail page
        });

        // Create a button to edit the recipe
        // This button will redirect to the index.html page where the recipe can be edited
        const editBtn = document.createElement('button'); // Create a button to edit the recipe
        editBtn.className = 'edit-button'; // Add a class for styling
        editBtn.textContent = 'Edit Recipe'; // Set the button text
        editBtn.addEventListener('click', () => { // Add click event to edit the recipe
          localStorage.setItem('editingRecipeId', recipe.id); // Store the recipe ID for editing in localStorage
          window.location.href = 'index.html'; // Redirect to the recipe editing page
        });

        // Create a button group to hold the view and edit buttons
        // This allows both actions to be performed on the recipe card
        const buttonGroup = document.createElement('div'); // Create a div to hold the buttons
        buttonGroup.className = 'card-buttons'; // Add a class for styling
        buttonGroup.appendChild(viewBtn); // Append the view button to the button group
        buttonGroup.appendChild(editBtn); // Append the edit button to the button group

        // Append all elements to the card
        card.appendChild(title); // Append the title to the card
        card.appendChild(snippet); // Append the snippet to the card
        card.appendChild(fullText); // Append the full text to the card
        card.appendChild(buttonGroup); // Append the button group to the card
        gallery.appendChild(card); // Append the card to the gallery
      });
    })

    // Handle errors in fetching recipes
    .catch(error => { // Log any errors that occur during the fetch operation
      console.error('Error fetching recipes:', error); // Log the error to the console
      gallery.innerHTML = '<p>⚠️ Could not load recipes. Please try again later.</p>'; // Display an error message in the gallery
    });
});



