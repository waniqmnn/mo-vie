const movieList = document.getElementById('movie-list');

// Retrieve the watchlist data from localStorage
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Display the movies in the watchlist
function displayMovies() {
  movieList.innerHTML = '';

  watchlist.forEach((movie, index) => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('movie-item');

    const moviePoster = document.createElement('img');
    moviePoster.src = movie.poster;
    moviePoster.alt = movie.title;
    moviePoster.classList.add('movie-poster');

    const movieDetails = document.createElement('div');
    movieDetails.classList.add('movie-details');

    const movieTitleElement = document.createElement('h3');
    movieTitleElement.innerText = movie.title;

    const movieDateElement = document.createElement('p');
    if (movie.date !== undefined) {
      movieDateElement.innerText = `Date To Watch: ${movie.date}`;
    } else {
      movieDateElement.innerText = 'Date has not been added yet';
    }

    const addDateButton = document.createElement('button');
    addDateButton.innerText = 'Add Date';
    addDateButton.addEventListener('click', () => {
      showDatePicker(index);
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.addEventListener('click', () => {
      removeMovie(index);
    });

    movieDetails.appendChild(movieTitleElement);
    movieDetails.appendChild(movieDateElement);
    movieDetails.appendChild(addDateButton);
    movieDetails.appendChild(removeButton);

    movieItem.appendChild(moviePoster);
    movieItem.appendChild(movieDetails);

    movieList.appendChild(movieItem);
  });
}

function showDatePicker(index) {
  const movie = watchlist[index];
  const currentDate = movie.date ? new Date(movie.date).toISOString().split('T')[0] : '';

  const dateInput = document.createElement('input');
  dateInput.type = 'text';
  dateInput.classList.add('flatpickr');
  dateInput.value = currentDate;
  dateInput.addEventListener('change', (event) => {
    const selectedDate = event.target.value;
    watchlist[index].date = selectedDate !== '' ? selectedDate : undefined;
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayMovies();
  });

  const addButtonContainer = document.createElement('div');
  addButtonContainer.classList.add('date-button-container');

  const addButton = document.createElement('button');
  addButton.innerText = 'Add';
  addButton.addEventListener('click', () => {
    watchlist[index].date = dateInput.value !== '' ? dateInput.value : undefined;
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayMovies();
  });

  const cancelButton = document.createElement('button');
  cancelButton.innerText = 'Cancel';
  cancelButton.addEventListener('click', () => {
    displayMovies();
  });

  addButtonContainer.appendChild(addButton);
  addButtonContainer.appendChild(cancelButton);

  const movieItem = movieList.children[index];
  movieItem.appendChild(dateInput);
  movieItem.appendChild(addButtonContainer);

  flatpickr('.flatpickr', {
    dateFormat: 'Y-m-d',
  });

  dateInput.focus();
}

function removeMovie(index) {
  watchlist.splice(index, 1);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  displayMovies();
}

displayMovies();
