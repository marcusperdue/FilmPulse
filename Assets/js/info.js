$(document).ready(function () {
    var storedData = localStorage.getItem('movieData');

    if (storedData) {
        var data = JSON.parse(storedData);

        // Set common data from OMDB
        $('#posterImage').attr('src', data.Poster);
        $('#movieTitle').text(data.Title);
        $('#moviePlot').text(data.Plot);
        $('#movieDirector').text('Director: ' + data.Director);
        $('#movieActors').text('Actors: ' + data.Actors);
        $('#movieGenre').text('Genre: ' + data.Genre);
        $('#movieRuntime').text('Runtime: ' + data.Runtime);

        if (data.Type === 'movie') {
            // For movies, retrieve additional details from TMDB
            var tmdbApiKey = '57def683b1f588faea8196f4db0da86c';
            var tmdbSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(data.Title)}`;

            $.getJSON(tmdbSearchUrl, function (tmdbSearchData) {
                if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
                    var tmdbMovieId = tmdbSearchData.results[0].id;
                    var tmdbDetailsUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${tmdbApiKey}`;

                    $.getJSON(tmdbDetailsUrl, function (tmdbDetailsData) {
                        if (tmdbDetailsData.release_date) {
                            var year = new Date(tmdbDetailsData.release_date).getFullYear();
                            $('#movieYear').text(year);
                        }

                        var tmdbApiUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/videos?api_key=${tmdbApiKey}`;

                        $.getJSON(tmdbApiUrl, function (tmdbData) {
                            if (tmdbData.results && tmdbData.results.length > 0) {
                                var trailerKey = tmdbData.results[0].key;
                                var trailerHtml = `
                                    <iframe width="700" height="400" style="margin-top: 20px;" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
                                `;
                                $('#trailerContainer').html(trailerHtml);
                            }
                        });
                    });
                }
            });
        } else if (data.Type === 'tvshow') {
            // For TV shows, you can fetch and display TV show details here
            // Modify the code to include TV show-specific elements
            var tmdbApiKey = '57def683b1f588faea8196f4db0da86c';
            var tmdbSearchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${encodeURIComponent(data.Title)}`;

            $.getJSON(tmdbSearchUrl, function (tmdbSearchData) {
                if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
                    var tmdbTVShowId = tmdbSearchData.results[0].id;
                    var tmdbDetailsUrl = `https://api.themoviedb.org/3/tv/${tmdbTVShowId}?api_key=${tmdbApiKey}`;

                    $.getJSON(tmdbDetailsUrl, function (tmdbDetailsData) {
                        if (tmdbDetailsData.first_air_date) {
                            var year = new Date(tmdbDetailsData.first_air_date).getFullYear();
                            $('#movieYear').text(year);
                        }

                        // Add more TV show-specific details here
                    });
                }
            });
        }
    }
});
