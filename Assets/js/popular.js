/* This JavaScript code, executed when the document is ready,
 fetches and displays information about popular movies, including titles, 
 release years, and movie posters, utilizing both The Movie Database (TMDb) 
 and Open Movie Database (OMDB) APIs, allowing users to click on posters to access detailed movie data. */

$(document).ready(function() {
    var tmdbApiKey = '57def683b1f588faea8196f4db0da86c';
    var omdbApiKey = 'ca388ffd';

    var tmdbApiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1`;

    // Select the popular-movies and movie-posters divs
    var popularMoviesDiv = $('#popular-movies');
    var moviePostersDiv = $('#movie-posters');

    // Fetch popular movies
    fetch(tmdbApiUrl)
        .then(response => response.json())
        .then(data => {
            var movies = data.results;

            // Display titles of popular movies
            movies.slice(0, 10).forEach(movie => {
                var movieTitle = movie.title;
                var movieYear = movie.release_date.substring(0, 4); 
                var movieElement = $('<h1>').text(movieTitle + ' (' + movieYear + ')');
                popularMoviesDiv.append(movieElement);

                // Fetch TMDB movie details to get IMDb ID
                var tmdbDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}&language=en-US`;
                fetch(tmdbDetailsUrl)
                    .then(response => response.json())
                    .then(tmdbDetailsData => {
                        var imdbID = tmdbDetailsData.imdb_id;

                        // Fetch movie posters using OMDB API
                        var omdbApiUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`;
                        fetch(omdbApiUrl)
                            .then(response => response.json())
                            .then(omdbData => {
                                var posterUrl = omdbData.Poster;

                                // Create poster image element
                                var posterElement = $('<img>')
                                    .addClass('movie-poster')
                                    .attr('src', posterUrl)
                                    .attr('alt', `${movieTitle} Poster`)
                                    .click(function() {
                                        // Fetch movie details using OMDB API
                                        var omdbApiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${omdbApiKey}`;
                                        $.getJSON(omdbApiUrl, function(data) {
                                            if (data.Response === 'True') {
                                                localStorage.setItem('movieData', JSON.stringify(data));
                                                window.location.href = 'movieoverview.html'; // Redirect to movie overview page
                                            }
                                        });
                                    });

                                moviePostersDiv.append(posterElement); // Append the poster
                            })
                            .catch(error => console.error('Error fetching OMDB data:', error));
                    })
                    .catch(error => console.error('Error fetching TMDB details data:', error));
            });
        })
        .catch(error => console.error('Error fetching TMDB data:', error));
});
