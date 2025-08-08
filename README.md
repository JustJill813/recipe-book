# 🍽️ Recipe Manager

My Recipe Manager is a web application that allows users to create, view, and manage recipes. It includes detailed nutritional information from an external API. It is built with Node.js, Express.js and SQLite3. It features a frontend interface built wtih HTML, CSS and JavaScript. The backend is built using JavaScript and it integrates with the Spoonacular API which shows real-time nutritional information.  


## ✅ Integrated Features

1. **Calculated Function Output**
    - The backend includes a function that accepts multiple input parameters - such as recipe title-ingredients-instructions
    and returns nurtitional data from the Spoonacular API.
2. **Persistent Internal API**
    - Recipes are stored in a SQLite3 database through an internal API. 
    - The data is accessible throughout the app, which allows users to view, edit and delete recipes.
3. **Node.js Web Server with Express.js**
    - The project uses Express.js. 
    - Routes are organized for CRUD (Create-Read-Update-Delete) operations and external API integration.
4. **SQLite3 Database Interaction**
    - All recipe data is stored and retrieved using SQLite3. 
    - The backend handles table creation, insertion, querying and deletion, which provides storage for recipes.
5. **Calculated Function Output**
    - The backend includes a function that accepts multiple input parameters—such as recipe title-ingredients-instructions and returns nutritional data from the Spoonacular API
6. **Data Analysis from Arrays and Objects**
    - The app dynamically analyzes structured data—such as arrays of ingredients and instructions, and objects returned from the Spoonacular API—and displays it in a user-friendly format. 
    - This includes rendering recipe steps, ingredient lists, and nutrition summaries directly from structured sources.  


## 🌐 External API Integration

A `fetch()` request is made from the backend to the Spoonacular API using the recipe’s title, ingredients, and instructions. The response includes detailed nutritional data (e.g., calories, protein, fat, carbs), which is then returned to the frontend and displayed alongside the recipe.  


## 🚀 How to Run This Project

1. **Clone the Repository**
    - git clone https://github.com/JustJill813/recipe-book.git
    - open in VS Code
    - cd recipe-book


2. **Install Dependencies**
    - Open the terminal
    - Navigate to GitBash/bash
    - Type in: cd backend
    - Type in: npm install


3. **Start the Server**
    - Naviagate to GitBash/bash
    - Type in cd .. 
    - Type in: node backend/app.js


4. **Set Up Your .env File**
    - Create a .env file in the backend folder with the following:
        - PORT=4000
        - DATABASE_NAME=recipes.db
        - SPOONACULAR_API_KEY=your_actual_api_key_here
        - ***(Replace your_actual_api_key_here wtih your Spoonacular API key)***


5. **Open the Frontend**
    - Open your web browser and navigate to:
        http://localhost:4000
    - *** Make sure you've added and saved at least one recipe before viewing the details. ***

        
Finally I would like to thank everyone that helped with my project. They all helped to point me in the correct direction, especially with getting the API to work. I would not have finished without your help, and for that I am very grateful. Thank you all again.
    - Ken Quiggins
    - Milo
    - Lisa Charters
    - Alesha Robinson

