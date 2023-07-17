const movieDetailsContainer = document.getElementById('movie-details');
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

fetch(`https://www.omdbapi.com/?apikey=c1aecf62&i=${movieId}`)
  .then(response => response.json())
  .then(data => {
    // Use the data to populate the movie details section
    const movieTitle = document.createElement('h2');
    movieTitle.innerText = data.Title;

    const moviePoster = document.createElement('img');
    moviePoster.src = data.Poster;
    moviePoster.alt = data.Title;

    const moviePlot = document.createElement('p');
    moviePlot.innerText = `Plot: ${data.Plot}`;

    const movieCast = document.createElement('p');
    movieCast.innerText = `Cast: ${data.Actors}`;

    const movieReleaseDate = document.createElement('p');
    movieReleaseDate.innerText = `Release Date: ${data.Released}`;

    const movieRatings = document.createElement('p');
    movieRatings.innerText = `Ratings: ${data.imdbRating}`;

    movieDetailsContainer.appendChild(movieTitle);
    movieDetailsContainer.appendChild(moviePoster);
    movieDetailsContainer.appendChild(moviePlot);
    movieDetailsContainer.appendChild(movieCast);
    movieDetailsContainer.appendChild(movieReleaseDate);
    movieDetailsContainer.appendChild(movieRatings);
  })
  .catch(error => {
    console.error('Error:', error);
  });

const backButton = document.querySelector('.back-button');

backButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});