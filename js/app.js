const search = document.querySelector('#search'); // input
const submit = document.querySelector('#submit'); // the form
const random = document.querySelector('#random'); // random btn
const mealsEl = document.querySelector('#meals'); // meals element
const resultHeading = document.querySelector('.result-heading'); // result heading
const singleMealEl = document.querySelector('.single-meal'); // single meal element

// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    singleMealEl.innerHTML = '';

    // Get search term
    const term = search.value;
    
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>There are no results for '${term}'. Try again!</h2>`;
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="meal-info" data-mealID="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                    .join('');
                }
            })
            .catch(error => console.log(error));
        
        // clear search text
        search.value = '';
    } else {
        showError('Please enter a search term');
    }
}

// function to show error to the user
function showError(error) {
    // create a div
    const errorDiv = document.createElement('div');

    // get elements
    const container = document.querySelector('.container');
    const headingThree = document.querySelector('.container h3');

    // add class
    errorDiv.className = 'alert alert-danger';

    // create text node and append to div
    errorDiv.appendChild(document.createTextNode(error));

    // insert error above heading
    //container
    container.insertBefore(errorDiv, headingThree);

    // clear error after 3 seconds
    setTimeout(clearError, 3000);
}

// function to clear the error div
function clearError() {
    document.querySelector('.alert').remove();
}

// add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
        <div class="single-meal">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>Category: ${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>Origin: ${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <h2>Ingredients</h2>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>

                <h2>How to cook</h2>
                <p>${meal.strInstructions}</p>
            </div>
        </div>
    `;
}

// function to fetch meal by id
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
        .catch(error => console.log(error));
}

// fetch random meal from API
function getRandomMeal() {
    // clear meals and headings
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        })
        .catch(error => console.log(error));
}

// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});
