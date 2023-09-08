const tvShowsPerPage = 20;
const currentPageMap = {};
let loading = false;
let reachedEnd = false; // Flag to track if all TV shows have been loaded

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');

    if (genre) {
        fetchTVShowsByGenre(genre);
        $(window).on('scroll', function () {
            if (!reachedEnd && !loading && $(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
                fetchTVShowsByGenre(genre);
            }
        });
    }
});

function fetchTVShowsByGenre(genre) {
    if (loading || reachedEnd) {
        return;
    }

    loading = true;

    const apiKey = '57def683b1f588faea8196f4db0da86c';
    const baseUrl = 'https://api.themoviedb.org/3';
    const genreId = getGenreId(genre);

    if (!currentPageMap[genre]) {
        currentPageMap[genre] = 1;
    }

    const url = `${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=${genreId}&page=${currentPageMap[genre]}&include_adult=false&include_video=false&vote_average.gte=6&per_page=${tvShowsPerPage}`;

    const tvShowPostersContainer = $('#movie-posters'); // Use the same container as for movies
    const loadingIndicator = $('#loading-indicator');

    loadingIndicator.show();

    $.get(url, function (data) {
        const sortedResults = data.results
            .filter(tvShow => tvShow.poster_path !== null)
            .sort((a, b) => a.name.localeCompare(b.name));

        if (sortedResults.length === 0) {
            reachedEnd = true; // No more TV shows to load
        }

        sortedResults.forEach(function (tvShow) {
            const posterPath = tvShow.poster_path;
            const posterUrl = `https://image.tmdb.org/t/p/w300${posterPath}`;
            const tvShowTitle = tvShow.name;
            const tvShowId = tvShow.id;

            const posterElement = $('<div>')
                .addClass('tv-show-poster')
                .append(
                    $('<img>')
                        .attr('src', posterUrl)
                        .attr('alt', tvShowTitle)
                        .click(function () {
                            console.log('Clicked on TV show poster:', tvShowTitle);
                            redirectToTVShowDetails(tvShowId);
                        })
                );

            tvShowPostersContainer.append(posterElement);
        });

        currentPageMap[genre]++;
        loading = false;
        loadingIndicator.hide();
    });
}


function getGenreId(genre) {
    // Define TV show genres and their corresponding IDs here
    const genreMap = {
        'Action': 10759,
        'Adventure': 10759, // Replace with the correct genre ID for Adventure
        'Animation': 16,
        'Comedy': 35,
        'Crime': 80,
        'Drama': 18,
        'Family': 10751,
        'Fantasy': 10765, // Replace with the correct genre ID for Fantasy
        'Horror': 27,
        'Mystery': 9648,
        'Romance': 10749,
        'Sci-Fi': 10765, // Replace with the correct genre ID for Sci-Fi
        
        'War': 10768, // Replace with the correct genre ID for War
        'Western': 37,
        'Documentary': 99,
        'Musical': 10402,
        'Historical': 36,
    };

    return genreMap[genre];
}
