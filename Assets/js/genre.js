const moviesPerPage = 20; // Number of movies to load per page
const currentPageMap = {};

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');

    if (genre) {
        fetchMoviesByGenre(genre);
        $(window).scroll(debounce(function () {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
                fetchMoviesByGenre(genre);
            }
        }, 300));
    }
});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}

function fetchMoviesByGenre(genre, callback) {
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
                            // Redirect to movie details page
                            const omdbApiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${omdbApiKey}`;
                            $.getJSON(omdbApiUrl, function(data) {
                                if (data.Response === 'True') {
                                    localStorage.setItem('movieData', JSON.stringify(data));
                                    window.location.href = 'movieoverview.html'; // Replace with the actual URL of the movie details page
                                }
                            });
                        })
                );

            moviePostersContainer.append(posterElement);
        });

        currentPageMap[genre]++;

        loadingIndicator.hide();

        if (typeof callback === 'function') {
            callback();
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
