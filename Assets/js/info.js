$(document).ready(function () {
    var storedMovieData = localStorage.getItem('movieData');
    var storedTVShowData = localStorage.getItem('tvShowData');

    function displayTrailer(trailerKey) {
        var trailerHtml = `
            <iframe width="700" height="400" style="margin-top: 20px;" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
        `;
        $('#trailerContainer').html(trailerHtml);
    }

    if (storedMovieData) {
        // Handle movie data
        console.log('Movie data found in localStorage:', storedMovieData);
        var data = JSON.parse(storedMovieData);

        // Set common data from OMDB for movies
        $('#posterImage').attr('src', data.Poster);
        $('#movieTitle').text(data.Title);
        $('#moviePlot').text(data.Plot);
        $('#movieDirector').text('Director: ' + data.Director);
        $('#movieActors').text('Actors: ' + data.Actors);
        $('#movieGenre').text('Genre: ' + data.Genre);
        $('#movieRuntime').text('Runtime: ' + data.Runtime);

        if (data.Type === 'movie') {
            // For movies, fetch and display the trailer
            var tmdbApiKey = '57def683b1f588faea8196f4db0da86c';
            var tmdbSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(data.Title)}`;
            const baseUrl = 'https://api.themoviedb.org/3';
            
            $.getJSON(tmdbSearchUrl, function (tmdbSearchData) {
                console.log('TMDB movie search response:', tmdbSearchData);
                if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
                    var tmdbMovieId = tmdbSearchData.results[0].id;
                    var tmdbApiUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/videos?api_key=${tmdbApiKey}`;

                    $.getJSON(tmdbApiUrl, function (tmdbData) {
                        console.log('TMDB movie videos response:', tmdbData);
                        if (tmdbData.results && tmdbData.results.length > 0) {
                            // Filter to get only videos of type 'Trailer'
                            var trailers = tmdbData.results.filter(function (video) {
                                return video.type === 'Trailer';
                            });

                            if (trailers.length > 0) {
                                var trailerKey = trailers[0].key;
                                displayTrailer(trailerKey);
                            } else {
                                console.log('No movie trailers found.');
                            }
                        } else {
                            console.log('No movie video data available.');
                        }
                    });
                } else {
                    console.log('No TMDB movie data found.');
                }
            });
            $('#movieYear').text((data.Year || 'N/A'));
        }
        
    } 
    else if (storedTVShowData) {
        console.log('TV show data found in localStorage:', storedTVShowData);
        var tvShowData = JSON.parse(storedTVShowData);

        if (tvShowData.Type === 'series') {
            $('#movieTitle').text(tvShowData.Title || 'N/A');
            $('#posterImage').attr('src', tvShowData.Poster || ''); // Use a default value if Poster is not available
            var releasedDate = tvShowData.Released;
            var dateObject = new Date(releasedDate);
            var year = dateObject.getFullYear();
            $('#movieYear').text(year || 'N/A');
            $('#moviePlot').text(tvShowData.Plot);
            $('#movieSeasons').text('Seasons: ' + (tvShowData.totalSeasons || 'N/A'));
            $('#movieActors').text(`Cast: ${tvShowData.Actors || 'N/A'}`);
            $('#movieGenre').text(`Genres: ${tvShowData.Genre || 'N/A'}`);
            $('#movieDirector ').text(`Director : ${tvShowData.Writer || 'N/A'}`);
            $('#movieEpisodes').text(`Episode: ${tvShowData.number_of_episodes || 'N/A'}`);
            $('#movieActors').text(`Cast: ${tvShowData.Actors || 'N/A'}`);
            fetchTVShowTrailer(tvShowData.Title);
        }
    }

    else {
        // If no data is found in local storage, perform a search and store it accordingly.
        $('#searchButton').click(function () {
            var searchTerm = $('#search').val().trim();
            
            if (searchTerm) {
                var omdbApiKey = 'ca388ffd';
                var omdbApiUrl = 'https://www.omdbapi.com/?apikey=' + omdbApiKey + '&t=' + encodeURIComponent(searchTerm);
                
                $.getJSON(omdbApiUrl, function (data) {
                    if (data.Response === 'True') {
                        if (data.Type === 'movie') {
                            localStorage.setItem('movieData', JSON.stringify(data));
                            window.location.href = 'movieoverview.html';
                        } else if (data.Type === 'series') {
                            localStorage.setItem('tvShowData', JSON.stringify(data));
                            window.location.href = 'tvshowoverview.html';
                        } else {
                            console.error('Error: Unknown type - ' + data.Type);
                        }
                    } else {
                        console.error('Error: Movie/TV show not found or API request failed.');
                    }
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.error('Error: Failed to fetch movie/TV show data. Status:', textStatus, 'Error:', errorThrown);
                });
            }
        });
    }

    function fetchTVShowTrailer(tvShowTitle) {
        var tmdbApiKey = '57def683b1f588faea8196f4db0da86c';
        var tmdbSearchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${encodeURIComponent(tvShowTitle)}`;

        $.getJSON(tmdbSearchUrl, function (tmdbSearchData) {
            console.log('TMDB TV show search response:', tmdbSearchData);
            if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
                var tmdbTVShowId = tmdbSearchData.results[0].id;
                var tmdbApiUrl = `https://api.themoviedb.org/3/tv/${tmdbTVShowId}/videos?api_key=${tmdbApiKey}&language=en-US`;

                $.getJSON(tmdbApiUrl, function (tmdbData) {
                    console.log('TMDB TV show videos response:', tmdbData);
                    if (tmdbData.results && tmdbData.results.length > 0) {
                        // Filter to get only videos of type 'Trailer' that belong to TV shows
                        var trailers = tmdbData.results.filter(function (video) {
                            return video.type === 'Trailer' && video.site.toLowerCase() === 'youtube';
                        });

                        if (trailers.length > 0) {
                            var trailerKey = trailers[0].key;
                            displayTrailer(trailerKey);
                        } else {
                            console.log('No TV show trailers found.');
                        }
                    } else {
                        console.log('No TV show video data available.');
                    }
                });
            } else {
                console.log('No TMDB TV show data found.');
            }
        });
    }
});
