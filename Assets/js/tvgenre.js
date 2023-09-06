const tvShowsPerPage = 20; // Number of TV shows to load per page
const currentPageMap = {};

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');

    if (genre) {
        fetchTVShowsByGenre(genre);
        $(window).scroll(debounce(function () {
            if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
                fetchTVShowsByGenre(genre);
            }
        }, 300));
    } else {
        // Parse the TV show ID from the URL and display details if available
        const tvShowId = urlParams.get('tvShowId');
        if (tvShowId) {
            fetchTVShowDetails(tvShowId);
        }
    }
});

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}

function redirectToTVShowDetails(tvShowId) {
    // Construct the URL for the TV show details page
    const tvShowDetailsUrl = `tvshowoverview.html?tvShowId=${tvShowId}`;

    // Redirect to the TV show details page
    window.location.href = tvShowDetailsUrl;
}

function fetchTVShowDetails(tvShowId) {
    const apiKey = '57def683b1f588faea8196f4db0da86c';
    const baseUrl = 'https://api.themoviedb.org/3';

    // Construct the URL to fetch TV show details by ID
    const url = `${baseUrl}/tv/${tvShowId}?api_key=${apiKey}&language=en-US`;

    // Make the API request
    $.get(url, function (data) {
        if (data && data.name) {
            // Populate the HTML elements with the retrieved TV show details
            $('#movieTitle').text(data.name);
            $('#movieYear').text(`Year: ${data.first_air_date ? data.first_air_date.split('-')[0] : 'N/A'}`);
            $('#posterImage').attr('src', `https://image.tmdb.org/t/p/w300${data.poster_path}`);
            $('#moviePlot').text(`Plot: ${data.overview}`);
            $('#movieDirector').text(`Created by: ${data.created_by ? data.created_by.map(creator => creator.name).join(', ') : 'N/A'}`);
            $('#movieActors').text(`Cast: ${data.cast ? data.cast.map(actor => actor.name).join(', ') : 'N/A'}`);
            $('#movieGenre').text(`Genres: ${data.genres ? data.genres.map(genre => genre.name).join(', ') : 'N/A'}`);
            $('#movieRuntime').text(`Runtime: ${data.episode_run_time.length > 0 ? data.episode_run_time[0] + ' min' : 'N/A'}`);
        } else {
            console.error('Failed to retrieve TV show details:', data);
        }
    }).fail(function (error) {
        console.error('Error fetching TV show details:', error);
    });
}

function fetchTVShowsByGenre(genre, callback) {
    const apiKey = '57def683b1f588faea8196f4db0da86c';
    const baseUrl = 'https://api.themoviedb.org/3';
    const genreId = getGenreId(genre);

    if (!currentPageMap[genre]) {
        currentPageMap[genre] = 1;
    }

    const url = `${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=${genreId}&page=${currentPageMap[genre]}&include_adult=false&include_video=false&vote_average.gte=6&per_page=${tvShowsPerPage}`;

    const tvShowPostersContainer = $('#movie-posters'); // Use the same container as for movies
    const loadingIndicator = $('#loading-indicator'); // Use the same loading indicator as for movies

    loadingIndicator.show();

    $.get(url, function (data) {
        const sortedResults = data.results
            .filter(tvShow => tvShow.poster_path !== null) // Filter out TV shows with no poster
            .sort((a, b) => a.name.localeCompare(b.name));

            sortedResults.forEach(function (tvShow) {
                const posterPath = tvShow.poster_path;
                const posterUrl = `https://image.tmdb.org/t/p/w300${posterPath}`;
                const tvShowTitle = tvShow.name;
                const tvShowId = tvShow.id; // Add TV show ID
            
                const posterElement = $('<div>')
                    .addClass('tv-show-poster') // Use the same CSS class as for movies
                    .append(
                        $('<img>')
                            .attr('src', posterUrl)
                            .attr('alt', tvShowTitle)
                            .click(function () {
                                console.log('Clicked on TV show poster:', tvShowTitle);
                                redirectToTVShowDetails(tvShowId); // Redirect to TV show details page
                            })
                    );
            
                tvShowPostersContainer.append(posterElement);
            });

        currentPageMap[genre]++;

        loadingIndicator.hide();

        if (typeof callback === 'function') {
            callback();
        }
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
        'Thriller': 53,
        'War': 10768, // Replace with the correct genre ID for War
        'Western': 37,
        'Documentary': 99,
        'Musical': 10402,
        'Historical': 36,
    };

    return genreMap[genre];
}
