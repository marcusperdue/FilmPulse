// Pulls from script.js for info.html
$(document).ready(function() {
    var storedMovieData = localStorage.getItem('movieData');
    if (storedMovieData) {
        var data = JSON.parse(storedMovieData);
        var posterApiUrl = 'https://img.omdbapi.com/?i=' + data.imdbID + '&apikey=ca388ffd';
        
        
        $('#posterImage').attr('src', posterApiUrl);
        $('#movieTitle').text(data.Title);
        $('#moviePlot').text(data.Plot);
        $('#movieDirector').text('Director: ' + data.Director);
        $('#movieActors').text('Actors: ' + data.Actors);
        $('#movieGenre').text('Genre: ' + data.Genre);
        $('#movieRuntime').text('Runtime: ' + data.Runtime);

        // Fetch TMDB movie ID
        var tmdbApiKey = '57def683b1f588faea8196f4db0da86c'; 
        var tmdbSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(data.Title)}`;

        $.getJSON(tmdbSearchUrl, function(tmdbSearchData) {
            console.log('TMDB Search Data:', tmdbSearchData); // Log the search data
            
            if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
                var tmdbMovieId = tmdbSearchData.results[0].id;

                // Fetch TMDB movie details
                var tmdbDetailsUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${tmdbApiKey}`;
                
                $.getJSON(tmdbDetailsUrl, function(tmdbDetailsData) {
                    console.log('TMDB Details Data:', tmdbDetailsData); // Log the details data

                    if (tmdbDetailsData.release_date) {
                        var year = new Date(tmdbDetailsData.release_date).getFullYear();
                        $('#movieYear').text(year);
                    }

                    // Fetch TMDB movie trailers
                    var tmdbApiUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/videos?api_key=${tmdbApiKey}`;
                    
                    $.getJSON(tmdbApiUrl, function(tmdbData) {
                        if (tmdbData.results && tmdbData.results.length > 0) {
                            var trailerKey = tmdbData.results[0].key;
                            var trailerHtml = `
                                <iframe width="800" height="500" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
                            `;
                            $('#trailerContainer').html(trailerHtml);
                        }
                    });
                });
            }
        });
    }
});

