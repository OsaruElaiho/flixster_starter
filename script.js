// API Key & Glabal Variables
const apiKey = '7b989307aa3699b5c12f3e96cd1323e5'; // ask 
var apiPage = 1;
var apiUrl = '';
// HTML Elements Selectors
const searchEl = document.querySelector("#search");
const userInputEl = document.querySelector("#search-input");
const movieSectionEl = document.querySelector("#movies-grid");
const loadMoreBtn = document.querySelector("#load-more-movies-btn");
let closeBtn = document.querySelector("#close-search-btn");
let backToTopBtn = document.querySelector("#back-to-top-btn");

// function that will get current movies from the API
async function getMovies(){
    apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${apiPage}`
    // use the fetch method with your custom HTTP request
    const response = await fetch(apiUrl);
    // convert the response to a JSON object
    const jsonResponse = await response.json();
    // return the data of the response
    console.log(jsonResponse);
    displayResults(jsonResponse);
}

// function that will get search results from the API for specific movies
async function searchResults(){
    apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${userInputEl.value}`;
    // use the fetch method with your custom HTTP request
    const response = await fetch(apiUrl);
    // convert the response to a JSON object
    const jsonResponse = await response.json();
    // return the data of the response
    console.log(jsonResponse);
    displayResults(jsonResponse);
}

// function will take in the response data as a parameter and 
// inject each movie and its respective properties into the HTML
function displayResults(results){
    let poster = "";
    results.results.forEach(function(element){
    // null == poster_path indicates no image for movie
    if(element.poster_path == null){
        // movie poster doesn't exsist --> display coming soon
        poster = "./comingSoon.jpeg";
    } else{
        // movie poster exsist --> display movie poster
        poster = `https://image.tmdb.org/t/p/w500${element.poster_path}`;
    }
      movieSectionEl.innerHTML +=  `
      <div class="movie-card">
      <img class="movie-poster" src="${poster}" alt="Movie image"/>
      <p class="movie-votes">⭐ ${element.vote_average}</p>
      <p class="movie-title">${element.original_title}</p>
      </div>
      `;
    });
}

// function to handle scrolling of pa
const goToTop = () => {
    document.body.scrollIntoView({
      behavior: "smooth",
    });
  };

// Add an event listener to the search form that senses the submit event.
searchEl.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);
closeBtn.addEventListener('click', closeSection);
backToTopBtn.addEventListener('click', goToTop);

// function to run the steps when the search form is submitted
async function handleFormSubmit(evt){
    evt.preventDefault();
    // Each time a new search starts, be sure to clear any existing movies in the movie div area.
    movieSectionEl.innerHTML = '';
    // send to search function to handles user search
    searchResults();
    userInputEl.value = "";
    loadMoreBtn.classList.remove('hidden');
}

async function handleLoadMoreClick() {
    apiPage++;
    // can I do this??
    await getMovies();
    console.log("load more worked");
}

async function closeSection(evt) {
    // Each time a new search starts, be sure to clear any existing movies in the movie div area.
    movieSectionEl.innerHTML = '';
    // reset page count
    apiPage = 1;
    // repopulate page with 
    await getMovies();
    console.log("Clear button worked");
}

window.onload = function(){
    getMovies(); 
}