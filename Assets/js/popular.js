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

        // Fetch movie posters using OMDB API
        var omdbApiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&y=${movieYear}&apikey=${omdbApiKey}`;
        fetch(omdbApiUrl)
            .then(response => response.json())
            .then(omdbData => {
                var posterUrl = omdbData.Poster;
                var posterElement = $('<img>').attr('src', posterUrl).attr('alt', `${movieTitle} Poster`);
                moviePostersDiv.append(posterElement);
            })
            .catch(error => console.error('Error fetching OMDB data:', error));
    });
})
.catch(error => console.error('Error fetching TMDB data:', error));
});