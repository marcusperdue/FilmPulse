/* This JavaScript code, triggered when the document is ready,
 retrieves and displays detailed information about a movie, 
 including its poster, title, plot, director, actors, genre, runtime, 
 and trailer (if available), by fetching data from local storage and 
 making API requests to both OMDB and TMDb databases for movie information and trailers. */
 
$(document).ready(function () {

    var storedMovieData = localStorage.getItem('movieData');
   

    function displayTrailer(trailerKey) {
        var trailerHtml = `
            <iframe width="700" height="400" style="margin-top: 20px;" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
        `;
        $('#trailerContainer').html(trailerHtml);
    }

    if (storedMovieData) {
        // Handle movie data
        
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
                
                if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
                    var tmdbMovieId = tmdbSearchData.results[0].id;
                    var tmdbApiUrl = `https://api.themoviedb.org/3/movie/${tmdbMovieId}/videos?api_key=${tmdbApiKey}`;

                    $.getJSON(tmdbApiUrl, function (tmdbData) {
                       
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
    
});
