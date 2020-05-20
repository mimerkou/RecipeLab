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

// Event Listeners
submit.addEventListener('submit', searchMeal);


