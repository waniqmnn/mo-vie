const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const movieList = document.getElementById('movie-list');
const searchTerm = 'war' ;

searchButton.addEventListener('click', searchMovies);

function searchMovies() {
  const searchTerm = searchInput.value;
  const pageLimit = 100; // Set the desired number of movies to fetch

  fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1ece064e&s=${searchTerm}&page=1`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const totalResults = parseInt(data.totalResults);
        const totalPages = Math.ceil(totalResults / pageLimit);
        const moviePromises = [];

        for (let page = 1; page <= totalPages; page++) {
          const moviePromise = fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1ece064e&s=${searchTerm}&page=${page}`)
            .then(response => response.json())
            .then(data => data.Search || []);

          moviePromises.push(moviePromise);
        }

        Promise.all(moviePromises)
          .then(movieResults => {
            const movies = movieResults.flat();

            // Sort movies from newest to oldest
            const sortedMovies = movies.sort((a, b) => {
              const yearA = parseInt(a.Year);
              const yearB = parseInt(b.Year);
              return yearB - yearA;
            });

            movieList.innerHTML = '';

            const displayedMovies = sortedMovies.slice(0, pageLimit);

            displayedMovies.forEach(movie => {
              const movieItem = document.createElement('div');
              movieItem.classList.add('movie-item'); // Add a class for styling

              const movieLink = document.createElement('a');
              movieLink.href = `moviedetails.html?id=${movie.imdbID}`;

              const moviePoster = document.createElement('img');
              moviePoster.src = movie.Poster !== 'N/A' ? movie.Poster : 'noposter.jpg';
              moviePoster.alt = movie.Title;
              moviePoster.dataset.title = movie.Title;
              moviePoster.dataset.year = movie.Year;
              moviePoster.dataset.poster = movie.Poster;

              movieLink.appendChild(moviePoster);
              movieItem.appendChild(movieLink);

              const movieDetails = document.createElement('div');
              movieDetails.classList.add('movie-details');

              const movieTitle = document.createElement('h3');
              movieTitle.innerText = movie.Title;

              const movieYear = document.createElement('p');
              movieYear.innerText = `Year: ${movie.Year}`;

              const movieId = document.createElement('p');
              movieId.innerText = `ID: ${movie.imdbID}`;

              const addToWatchlistButton = document.createElement('button');
              addToWatchlistButton.classList.add('add-to-watchlist');
              addToWatchlistButton.innerText = 'Add to Watchlist';

              movieDetails.appendChild(movieTitle);
              movieDetails.appendChild(movieYear);
              movieDetails.appendChild(movieId);
              movieDetails.appendChild(addToWatchlistButton);

              movieItem.appendChild(movieDetails);

              movieList.appendChild(movieItem);

              movieItem.addEventListener('mouseenter', () => {
                addToWatchlistButton.style.visibility = 'visible';
                moviePoster.style.transform = 'rotateY(10deg) scale(1.1)';
              });

              movieItem.addEventListener('mouseleave', () => {
                addToWatchlistButton.style.visibility = 'hidden';
                moviePoster.style.transform = 'none';
              });

              addToWatchlistButton.addEventListener('click', addToWatchlist);
            });
          });
      } else {
        movieList.innerHTML = '<p>No movies found.</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

}

function addToWatchlist(event) {
  const moviePoster = event.target.parentNode.parentNode.querySelector('img');
  const title = moviePoster.dataset.title;
  const year = moviePoster.dataset.year;
  const poster = moviePoster.dataset.poster;

  // Store the movie data in local storage or send it to a backend for storage
  // Example using local storage:
  const movieData = { title, year, poster };
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  watchlist.push(movieData);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));

  // Redirect the user to the watchlist page
  window.location.href = 'watchlist.html';
}

const year = 2023;
fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=1ece064e&s=${searchTerm}&y=${year}&page=1`)
  .then(response => response.json())
  .then(data => {
    if (data.Response === 'True') {
      const movies = data.Search;

      movieList.innerHTML = '';

      movies.forEach(movie => {
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

        movieDetails.appendChild(movieTitle);
        movieDetails.appendChild(movieYear);

        movieItem.appendChild(movieDetails);

        movieList.appendChild(movieItem);
      });
    } else {
      movieList.innerHTML = '<p>No movies found.</p>';
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

const images = ["jw4.jpg","op.jpeg","op.jpg","spider.jpg","agent.jpg", "shz.jpg", "trotb.jpg"]; // Add more image URLs if needed
const descriptions = ["John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.","A feature documentary exploring how one man's brilliance, hubris and relentless drive changed the nature of war forever, led to the deaths of hundreds of thousands of people and unleashed mass hysteria, and how, subsequently, the same man's attempts to co.","Desperate to secure funds for his mother's surgery, an amateur boxer searches for the wealthy father he's never met. Traveling from the Philippines to Korea, he is relentlessly pursued and forced to confront a shocking truth.","With help from Princess Peach, Mario gets ready to square off against the all-powerful Bowser to stop his plans from conquering the world.","Over many missions and against impossible odds, Dom Toretto and his family have outsmarted and outdriven every foe in their path. Now, they must confront the most lethal opponent they've ever faced. Fueled by revenge, a terrifying threat emerges from the shadows of the past to shatter Dom's world and destroy everything -- and everyone -- he loves.", "Bestowed with the powers of the gods, Billy Batson and his fellow foster kids are still learning how to juggle teenage life with their adult superhero alter egos. When a vengeful trio of ancient gods arrives on Earth in search of the magic stolen from them long ago, Shazam and his allies get thrust into a battle for their superpowers, their lives, and the fate of the world.", "Optimus Prime and the Autobots take on their biggest challenge yet. When a new threat capable of destroying the entire planet emerges, they must team up with a powerful faction of Transformers known as the Maximals to save Earth."]; // Add more descriptions if needed
const titles = ["John Wick : Chapter 4","Oppenheimer","The Childe","The Super Mario Bros. Movie","Fast X", "Shazam : Fury Of The Gods", "Transformers : Rise Of The Beasts"]; // Add more titles if needed
let currentIndex = 0;

function changeImage() {
  const image = document.getElementById("image");
  const description = document.getElementById("description");
  const title = document.getElementById("title");

  image.src = images[currentIndex];
  description.textContent = descriptions[currentIndex];
  title.textContent = titles[currentIndex];

  currentIndex = (currentIndex + 1) % images.length;
}

setInterval(changeImage, 5000); 


