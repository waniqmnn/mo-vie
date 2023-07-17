const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieList = document.getElementById('movie-list');

searchButton.addEventListener('click', searchMovies);

function searchMovies() {
  const searchTerm = searchInput.value;
  const pageLimit = 50; // Set the desired number of movies to fetch

  const recommendationSelect = document.getElementById('recommendation-select');
  const sortBy = recommendationSelect.value;

  let apiUrl = '';

  if (sortBy === 'year') {
    apiUrl = `https://www.omdbapi.com/?apikey=1ece064e&s=${searchTerm}&y=2023&type=movie`;
  } else if (sortBy === 'rating') {
    apiUrl = `https://www.omdbapi.com/?apikey=1ece064e&s=${searchTerm}&type=movie&sort=imdbRating`;
  }

  let movies = [];

  const fetchMovies = async (page) => {
    const response = await fetch(`${apiUrl}&page=${page}`);
    const data = await response.json();

    if (data.Response === 'True') {
      const newMovies = data.Search;
      movies = movies.concat(newMovies);

      if (movies.length < pageLimit && page < Math.ceil(data.totalResults / 10)) {
        await fetchMovies(page + 1);
      } else {
        fetchMovieRatings();
      }
    } else {
      movieList.innerHTML = '<p>No movies found.</p>';
    }
  };

  const fetchMovieRatings = async () => {
    const moviePromises = movies.map(movie =>
      fetch(`https://www.omdbapi.com/?apikey=1ece064e&i=${movie.imdbID}`)
        .then(response => response.json())
    );

    const movieResults = await Promise.all(moviePromises);

    movies.forEach((movie, index) => {
      movie.imdbRating = movieResults[index].imdbRating;
    });

    displayMovies();
  };

  const displayMovies = () => {
    // Sort movies by rating (highest to lowest)
    movies.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));

    movieList.innerHTML = '';

    movies.slice(0, pageLimit).forEach(movie => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');

      const movieLink = document.createElement('a');
      movieLink.href = `moviedetails.html?id=${movie.imdbID}`;

      const moviePoster = document.createElement('img');
      moviePoster.src = movie.Poster !== 'N/A' ? movie.Poster : 'noposter.jpg';
      moviePoster.alt = movie.Title;

      movieLink.appendChild(moviePoster);
      movieItem.appendChild(movieLink);

      const movieDetails = document.createElement('div');
      movieDetails.classList.add('movie-details');

      const movieTitle = document.createElement('h3');
      movieTitle.innerText = movie.Title;

      const movieYear = document.createElement('p');
      movieYear.innerText = `Year: ${movie.Year}`;

      const movieRating = document.createElement('p');
      movieRating.innerText = `Rating: ${movie.imdbRating ? movie.imdbRating : 'No rating'}`;

      movieDetails.appendChild(movieTitle);
      movieDetails.appendChild(movieYear);
      movieDetails.appendChild(movieRating);

      movieItem.appendChild(movieDetails);

      movieList.appendChild(movieItem);
    });
  };

  fetchMovies(1);
}

