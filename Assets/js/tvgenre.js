/* This JavaScript code, triggered on document ready,
 enables users to browse and access detailed information 
 about TV shows, including posters, titles, and trailers, 
 categorized by genre, with support for dynamic loading and clicking on posters to view more details. */
 
const tvShowsPerPage = 20;
const currentPageMap = {};
var storedTVShowData = localStorage.getItem('tvShowData');
let loading = false;
let reachedEnd = false; // Flag to track if all TV shows have been loaded

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');
    const tvShowId = urlParams.get('tvShowId');
   

    if (genre) {
        fetchTVShowsByGenre(genre);
        $(window).on('scroll', function () {
            if (!reachedEnd && !loading && $(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
                fetchTVShowsByGenre(genre);
            }
        });
    } else if (tvShowId) {
        fetchTVShowDetails(tvShowId);
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
    const detailsUrl = `${baseUrl}/tv/${tvShowId}?api_key=${apiKey}&language=en-US`;
    
    $('#trailerContainer').html('');

    // Make the API request to fetch TV show details
    $.get(detailsUrl, function (data) {
        if (data && data.name) {
            // Populate the HTML elements with the retrieved TV show details
            $('#movieTitle').text(data.name);
            $('#movieYear').text(` ${data.first_air_date ? data.first_air_date.split('-')[0] : 'N/A'}`);
            $('#posterImage').attr('src', `https://image.tmdb.org/t/p/w300${data.poster_path}`);
            $('#moviePlot').text(`${data.overview}`);
            $('#movieDirector').text(`Created by: ${data.created_by ? data.created_by.map(creator => creator.name).join(', ') : 'N/A'}`);
            $('#movieActors').text(`Cast: ${data.Actors || 'N/A'}`);
 
            $('#movieGenre').text(`Genres: ${data.genres ? data.genres.map(genre => genre.name).join(', ') : 'N/A'}`);
            
            $('#movieSeasons').text(`Seasons: ${data.number_of_seasons}`);
            $('#movieEpisodes').text(`Episodes: ${data.number_of_episodes || 'N/A'}`);

            // Fetch and display the TV show trailer
            fetchTVShowTrailer(tvShowId);

            // Store TV show data in localStorage after fetching
            localStorage.setItem('tvShowData', JSON.stringify(data));
        } else {
            console.error('Failed to retrieve TV show details:', data);
        }
    }).fail(function (error) {
        console.error('Error fetching TV show details:', error);
    });
}

function fetchTVShowTrailer(tvShowId) {
    const apiKey = '57def683b1f588faea8196f4db0da86c';
    const baseUrl = 'https://api.themoviedb.org/3';

 

    // Construct the URL to fetch TV show videos by ID
    const videosUrl = `${baseUrl}/tv/${tvShowId}/videos?api_key=${apiKey}&language=en-US`;
   $('#trailerContainer').html('');
  

    // Make the API request to fetch TV show videos
    $.get(videosUrl, function (data) {
        if (data.results && data.results.length > 0) {
            // Filter to get only videos of type 'Trailer' that belong to TV shows
            const trailer = data.results.find(function (video) {
                return video.type === 'Trailer' && video.site.toLowerCase() === 'youtube';
            });

            if (trailer) {
                const trailerKey = trailer.key;
                const trailerHtml = `
                    <iframe src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
                `;

                $('#trailerContainer').html(trailerHtml);
            } else {
                // No TV show trailer of type 'Trailer' found
                $('#trailerContainer').html('<div style="display: flex; justify-content: center; align-items: center; height: 400px;"><p>Trailer not available :(</p></div>');
            }
        } else {
            // No video data available
            $('#trailerContainer').html('<div style="display: flex; justify-content: center; align-items: center; height: 400px;"><p>Trailer not available :(</p></div>');
        }
    }).fail(function (error) {
        console.error('Error fetching TV show videos:', error);
        // Handle the error, e.g., display an error message in the trailer container
        $('#trailerContainer').html('<p>Error fetching TV show trailers. Please try again later.</p>');
    });
}

function fetchTVShowsByGenre(genre, callback) {
    if (loading) {
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
        loading = false; // Reset the loading flag
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
