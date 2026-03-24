const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailContent = document.querySelector('.recipe-detail-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const recipeBackdrop = document.querySelector('.recipe-details-backdrop');



// Function to get recipes
const fetchRecipes = async (query) => {
    if (!query) {
        recipeContainer.innerHTML = '<h2>Please enter a keyword to search recipes</h2>';
        return;
    }

    recipeContainer.innerHTML = '<h2>Fetching Recipes...</h2>';

    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        const response = await data.json();

        if (!response.meals) {
            recipeContainer.innerHTML = `<h2>No recipes found for "${query}"</h2>`;
            return;
        }

        recipeContainer.innerHTML = '';

        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> category</p>
            `;

            const button = document.createElement('button');
            button.textContent = 'View Recipe';
            recipeDiv.appendChild(button);

            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        recipeContainer.innerHTML = '<h2>Unable to fetch recipes right now. Please try again later.</h2>';
        console.error('fetchRecipes error:', error);
    }
};

const openRecipePopup = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
        }
    }

    recipeDetailContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <h3>Ingredients</h3>
        <ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
        <h3>Instructions</h3>
        <p>${meal.strInstructions || 'No instructions available.'}</p>
    `;

    recipeBackdrop.style.display = 'block';
    recipeDetailContent.parentElement.classList.add('active');
};

recipeCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    recipeBackdrop.style.display = 'none';
    recipeDetailContent.parentElement.classList.remove('active');
});

recipeBackdrop.addEventListener('click', () => {
    recipeBackdrop.style.display = 'none';
    recipeDetailContent.parentElement.classList.remove('active');
});

recipeDetailContent.parentElement.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Make search work on form submit and button click
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML = '<h2>Type the meal in the search box</h2>';
        return;
    }

    fetchRecipes(searchInput);

});
