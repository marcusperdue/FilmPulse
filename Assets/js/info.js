// Pulls from script.js for info.html
$(document).ready(function() {
    
    var storedMovieData = localStorage.getItem('movieData');
    if (storedMovieData) {
        var data = JSON.parse(storedMovieData);
        var posterApiUrl = 'https://img.omdbapi.com/?i=' + data.imdbID + '&apikey=ca388ffd';

        $('#posterImage').attr('src', posterApiUrl);
        $('#movieTitle').text(data.Title);
        $('#movieYear').text(data.Year);
        $('#moviePlot').text(data.Plot);
        $('#movieDirector').text('Director: ' + data.Director);
        $('#movieActors').text('Actors: ' + data.Actors);
        $('#movieGenre').text('Genre: ' + data.Genre);
        $('#movieRuntime').text('Runtime: ' + data.Runtime);
    }
});