/* This JavaScript code creates a webpage that dynamically loads
 and displays movies of a specified genre from the TMDb API as the
  user scrolls, with clickable posters that fetch additional movie 
  details from the OMDB API and redirect the user to a detailed movie
   overview page upon clicking. */
   
const moviesPerPage = 20;
const currentPageMap = {};
let loading = false;
let reachedEnd = false; // Flag to track if all movies have been loaded

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');

    if (genre) {
        fetchMoviesByGenre(genre);
        $(window).on('scroll', function () {
            if (!reachedEnd && !loading && $(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
                fetchMoviesByGenre(genre);
            }
        });
    }
});

function fetchMoviesByGenre(genre) {
    if (loading || reachedEnd) {
        return;
    }

    loading = true;

    const apiKey = '57def683b1f588faea8196f4db0da86c';
    const omdbApiKey = 'ca388ffd';
    const baseUrl = 'https://api.themoviedb.org/3';
    const genreId = getGenreId(genre);

    if (!currentPageMap[genre]) {
        currentPageMap[genre] = 1;
    }

    const url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${currentPageMap[genre]}&include_adult=false&include_video=false&vote_count.gte=100&per_page=${moviesPerPage}`;

    const moviePostersContainer = $('#movie-posters');
    const loadingIndicator = $('#loading-indicator');

    loadingIndicator.show();

    $.get(url, function (data) {
        const sortedResults = data.results
            .filter(movie => movie.poster_path !== '/t/p/w300/sVOdtRA4bwZmrVE3qzdJH73jOhL.jpg')
            .sort((a, b) => a.title.localeCompare(b.title));

        if (sortedResults.length === 0) {
            reachedEnd = true; // No more movies to load
        }

        sortedResults.forEach(function (movie) {
            const posterPath = movie.poster_path;
            const posterUrl = `https://image.tmdb.org/t/p/w300${posterPath}`;
            const movieTitle = movie.title;

            const posterElement = $('<div>')
                .addClass('movie-poster')
                .append(
                    $('<img>')
                        .attr('src', posterUrl)
                        .attr('alt', movieTitle)
                        .click(function () {
                            redirectToMovieDetails(movieTitle, omdbApiKey);
                        })
                );

            moviePostersContainer.append(posterElement);
        });

        currentPageMap[genre]++;
        loading = false;
        loadingIndicator.hide();
    });
}

function redirectToMovieDetails(movieTitle, omdbApiKey) {
    const omdbApiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${omdbApiKey}`;
    $.getJSON(omdbApiUrl, function (data) {
        if (data.Response === 'True') {
            localStorage.setItem('movieData', JSON.stringify(data));
            window.location.href = 'movieoverview.html';  
        }
    });
}

function getGenreId(genre) {
    const genreMap = {
        'Action': 28,
        'Adventure': 12,
        'Animation': 16,
        'Comedy': 35,
        'Crime': 80,
        'Drama': 18,
        'Family': 10751,
        'Fantasy': 14,
        'Horror': 27,
        'Mystery': 9648,
        'Romance': 10749,
        'Sci-Fi': 878,
        'Thriller': 53,
        'War': 10752,
        'Western': 37,
        'Documentary': 99,
        'Musical': 10402,
        'Historical': 36,
    };

    return genreMap[genre];
}
