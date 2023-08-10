document.addEventListener("DOMContentLoaded", function () {
    // Select various elements from the DOM
    const searchButton = document.querySelector(".search-button");
    const searchInput = document.querySelector(".search-input");
    const searchResults = document.querySelector(".search-results");
    const movieDetails = document.querySelector(".movie-details");
    const favoriteList = document.querySelector(".favorite-list");
    const favoritesButton = document.querySelector(".favorites-button");
    const favoriteMoviesContainer = document.querySelector(".favorite-movies"); 

    // Initialize the array to store favorite movies
    const favoriteMovies = [];

    // Check if there are already favorite movies stored in local storage
    const storedFavorites = localStorage.getItem("favoriteMovies");
    if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        favoriteMovies.push(...parsedFavorites);
        updateFavoriteMovies();
    }

    // Function to add a movie to the favorite list
    function addToFavorites(movieData) {
        favoriteMovies.push(movieData);
        updateFavoriteMovies();
        saveFavoritesToLocalStorage();
    }

    // Function to save favorite movies to local storage
    function saveFavoritesToLocalStorage() {
        localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
    }

    // Function to update the list of favorite movies in the UI
    function updateFavoriteMovies() {
        favoriteList.innerHTML = favoriteMovies
            .map(movie => `<div class="favorite-movie">
                <img src="${movie.Poster}" alt="${movie.Title}">
                <p class="favorite-movie-title">${movie.Title}</p>
                <span class="favorite-movie-delete">Delete</span>
            </div>`)
            .join("");
    }

    // Event listener for the search button click
    searchButton.addEventListener("click", function (e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            // Construct the API URL for searching movies
            const apiKey = "4ef13bc";
            const apiUrl = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`;

            // Fetch movie data from the API
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.Search) {
                        // Display the search results
                        const movies = data.Search;
                        const movieList = movies.map(movie => `<div class="movie" data-id="${movie.imdbID}">
                            <img src="${movie.Poster}" alt="${movie.Title}" class="movie-poster">
                            <p class="movie-title">${movie.Title}</p>
                        </div>`).join("");
                        searchResults.innerHTML = movieList;
                    } else {
                        // Display a message when no movies are found
                        searchResults.innerHTML = "No movies found.";
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    searchResults.innerHTML = "An error occurred.";
                });
        }
    });

    // Event listener for clicking on a movie in the search results
    searchResults.addEventListener("click", function (e) {
        const movieElement = e.target.closest(".movie");
        if (movieElement) {
            // Fetch detailed movie data using IMDb ID
            const movieId = movieElement.getAttribute("data-id");
            const apiKey = "4ef13bc";
            const apiUrl = `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`;

            // Fetch movie details and display them
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Construct the HTML for displaying movie details
                    const movieDetailsHtml = `
                        <img src="${data.Poster}" alt="${data.Title}">
                        <h2>${data.Title}</h2>
                        <p>Year: ${data.Year}</p>
                        <p>Rated: ${data.Rated}</p>
                        <p>Director: ${data.Director}</p>
                        <br>
                        <button class="favorite-button">Add to Favorites</button>
                    `;

                    // Display the movie details and add a favorite button
                    movieDetails.innerHTML = movieDetailsHtml;
                    const favoriteButton = movieDetails.querySelector(".favorite-button");
                    favoriteButton.addEventListener("click", function () {
                        addToFavorites(data);
                    });

                    // Show the movie details and hide the search results
                    movieDetails.style.display = "block";
                    searchResults.style.display = "none";
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    movieDetails.innerHTML = "An error occurred.";
                });
        }
    });

    // Event listener for clicking the "Favorites" button
    favoritesButton.addEventListener("click", function () {
        // Display the list of favorite movies and hide other sections
        favoriteList.innerHTML = favoriteMovies
            .map(movie => `<div class="favorite-movie">
                <img src="${movie.Poster}" alt="${movie.Title}">
                <p class="favorite-movie-title">${movie.Title}</p>
                <span class="favorite-movie-delete">Delete</span>
            </div>`)
            .join("");
        favoriteMoviesContainer.style.display = "block";
        searchResults.style.display = "none";
        movieDetails.style.display = "none";
    });

    // Event listener for deleting a favorite movie
    favoriteList.addEventListener("click", function (e) {
        const deleteButton = e.target.closest(".favorite-movie-delete");
        if (deleteButton) {
            // Delete the selected favorite movie
            const movieTitle = deleteButton.parentElement.querySelector(".favorite-movie-title").innerText;
            const movieIndex = favoriteMovies.findIndex(movie => movie.Title === movieTitle);
            if (movieIndex !== -1) {
                favoriteMovies.splice(movieIndex, 1);
                updateFavoriteMovies();
                saveFavoritesToLocalStorage(); // Save updated favorites to local storage
            }
        }
    });
});
