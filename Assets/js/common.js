$(document).ready(function () {
    $('#searchButton').click(searchMovies);
    $('#search').keypress(function (event) {
        if (event.keyCode === 13) {
            searchMovies();
        }
    });

    function searchMovies() {
        var searchTerm = $('#search').val();
        if (searchTerm) {
            // Use OMDB API for movie and TV show data
            var omdbApiKey = 'ca388ffd';
            var omdbApiUrl = 'https://www.omdbapi.com/?apikey=' + omdbApiKey + '&t=' + encodeURIComponent(searchTerm);

            $.getJSON(omdbApiUrl, function (data) {
                if (data.Response === 'True') {
                    if (data.Type === 'movie') {
                        // Redirect to movie overview for movies
                        localStorage.setItem('movieData', JSON.stringify(data));
                        window.location.href = 'movieoverview.html';
                    } else if (data.Type === 'series' && data.totalSeasons !== 'N/A' && data.Episodes !== 'N/A') {
                        // Redirect to TV show overview for TV series with season and episode info
                        localStorage.setItem('tvShowData', JSON.stringify(data));
                        
                        // Fetch detailed TV show data from TMDb API
                        fetchTVShowDetails(searchTerm);
                    } else {
                        // Treat as a movie for other types or TV series without season and episode info
                        localStorage.setItem('movieData', JSON.stringify(data));
                        window.location.href = 'movieoverview.html';
                    }
                } else {
                    // If not found with OMDB, try TMDb API for TV show data
                    searchTVShows(searchTerm);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                // Handle OMDB API request failure
                console.error('Error: Failed to fetch movie/TV show data using OMDB API. Status:', textStatus, 'Error:', errorThrown);
                // You can display an error message to the user here
            });
        }
    }

    function fetchTVShowDetails(searchTerm) {
        // Use TMDb API for TV show data
        var tmdbApiKey = '57def683b1f588faea8196f4db0da86c';
        var tmdbApiUrl = 'https://api.themoviedb.org/3/search/tv?api_key=' + tmdbApiKey + '&query=' + encodeURIComponent(searchTerm);

        $.getJSON(tmdbApiUrl, function (data) {
            if (data.results && data.results.length > 0) {
                var firstResult = data.results[0];

                // Fetch detailed TV show data using the TV show ID from the first result
                fetchDetailedTVShowData(firstResult.id);
            } else {
                // Movie/TV show not found or API request failed for both OMDB and TMDb
                console.error('Error: Movie/TV show not found or API request failed for both OMDB and TMDb.');
                // You can display an error message to the user here
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Handle TMDb API request failure
            console.error('Error: Failed to fetch movie/TV show data using TMDb API. Status:', textStatus, 'Error:', errorThrown);
            // You can display an error message to the user here
        });
    }

    function fetchDetailedTVShowData(tvShowId) {
        // Use TMDb API to fetch detailed TV show data by ID
        var tmdbApiKey = '57def683b1f588faea8196f4db0da86c';
        var tmdbApiUrl = 'https://api.themoviedb.org/3/tv/' + tvShowId + '?api_key=' + tmdbApiKey + '&language=en-US';

        $.getJSON(tmdbApiUrl, function (data) {
            if (data) {
                // Store the detailed TV show data in local storage
                localStorage.setItem('detailedTVShowData', JSON.stringify(data));
                window.location.href = 'tvshowoverview.html';
            } else {
                // TV show details not found or API request failed
                console.error('Error: TV show details not found or API request failed.');
                // You can display an error message to the user here
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Handle TMDb API request failure
            console.error('Error: Failed to fetch detailed TV show data using TMDb API. Status:', textStatus, 'Error:', errorThrown);
            // You can display an error message to the user here
        });
    }
    function fetchTVShowTrailer(tvShowId) {
    const apiKey = '57def683b1f588faea8196f4db0da86c';
    const baseUrl = 'https://api.themoviedb.org/3';

    // Construct the URL to fetch TV show videos by ID
    const videosUrl = `${baseUrl}/tv/${tvShowId}/videos?api_key=${apiKey}&language=en-US`;

    // Clear the trailer container
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
			document.addEventListener('DOMContentLoaded', function () {
				// Retrieve detailed TV show data from local storage
				var detailedTVShowData = JSON.parse(localStorage.getItem('detailedTVShowData'));
				
				// Update HTML elements with TV show data
				document.getElementById('movieTitle').textContent = detailedTVShowData.name;
				document.getElementById('movieYear').textContent = detailedTVShowData.first_air_date ? new Date(detailedTVShowData.first_air_date).getFullYear() : '';

				document.getElementById('posterImage').src = 'https://image.tmdb.org/t/p/w300' + detailedTVShowData.poster_path;
				document.getElementById('moviePlot').textContent = detailedTVShowData.overview;
				document.getElementById('movieSeasons').textContent = 'Seasons: ' + detailedTVShowData.number_of_seasons;
				document.getElementById('movieEpisodes').textContent = 'Episodes: ' + detailedTVShowData.number_of_episodes;
				document.getElementById('movieDirector').textContent = 'Created By: ' + detailedTVShowData.created_by.map(function (creator) {
					return creator.name;
				}).join(', ');
				 
				$('#movieGenre').text(`Genres: ${detailedTVShowData.genres ? detailedTVShowData.genres.map(genre => genre.name).join(', ') : 'N/A'}`);
				var networksElement = document.getElementById('movieNetworks');
    				networksElement.textContent = 'Networks: ';
    					if (detailedTVShowData.networks && detailedTVShowData.networks.length > 0) {
        					for (var i = 0; i < detailedTVShowData.networks.length; i++) {
            	var network = detailedTVShowData.networks[i];
            					networksElement.textContent += network.name;
            			if (i < detailedTVShowData.networks.length - 1) {
               					 networksElement.textContent += ', ';
            }
        }
    } else {
        networksElement.textContent += 'N/A';
    }
	
	fetchTVShowTrailer(detailedTVShowData.id);
			});
});
