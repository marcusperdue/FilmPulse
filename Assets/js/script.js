

//OMDb API - pulls poster and movie data
$(document).ready(function() {
    $('#searchButton').click(function() {
        var searchTerm = $('#search').val();
        if (searchTerm) {
            var omdbApiKey = 'ca388ffd';
            var omdbApiUrl = 'https://www.omdbapi.com/?apikey=' + omdbApiKey + '&t=' + encodeURIComponent(searchTerm);

            $.getJSON(omdbApiUrl, function(data) {
                if (data.Response === 'True') {
                    localStorage.setItem('movieData', JSON.stringify(data));
                    window.location.href = 'info.html';
                }
            });
        }
    });
});
  