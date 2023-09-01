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

         // Fetch YouTube videos
         var youtubeApiKey = 'youtubeApiKey';
         var youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search?q=' + encodeURIComponent(data.Title + ' trailer') + '&key=' + youtubeApiKey + '&part=snippet&type=video';

         $.getJSON(youtubeApiUrl, function(youtubeData) {
             if (youtubeData.items && youtubeData.items.length > 0) {
                 var trailerVideoId = youtubeData.items[0].id.videoId;
                 var trailerHtml = `
                     <iframe width="800" height="500" src="https://www.youtube.com/embed/${trailerVideoId}" frameborder="0" allowfullscreen></iframe>
                 `;
                 $('#trailerContainer').html(trailerHtml);
             }
         });
    }
});
