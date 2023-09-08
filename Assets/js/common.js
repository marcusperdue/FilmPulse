$(document).ready(function() {
    $('#searchButton').click(searchMovies); // Trigger search on button click
    $('#search').keypress(function(event) {
        if (event.keyCode === 13) { // Check if the Enter key was pressed
            searchMovies();
        }
    });

    function searchMovies() {
        var searchTerm = $('#search').val();
        if (searchTerm) {
            var omdbApiKey = 'ca388ffd';
            var omdbApiUrl = 'https://www.omdbapi.com/?apikey=' + omdbApiKey + '&t=' + encodeURIComponent(searchTerm);
    
            $.getJSON(omdbApiUrl, function (data) {
                if (data.Response === 'True') {
                    localStorage.setItem('movieData', JSON.stringify(data));
    
                    // Determine whether it's a movie or TV show
                    if (data.Type === 'movie') {
                        window.location.href = 'movieoverview.html';
                    } else if (data.Type === 'series') {
                        // Redirect to TV show overview and pass TV show data
                        localStorage.setItem('tvShowData', JSON.stringify(data));
                        window.location.href = 'tvshowoverview.html'; // Change this to the appropriate TV show page
                    } else {
                        // Handle other types as needed
                        console.error('Error: Unknown type - ' + data.Type);
                    }
                } else {
                    // Movie not found or API request failed
                    console.error('Error: Movie not found or API request failed.');
                    // You can display an error message to the user here
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                // Handle API request failure
                console.error('Error: Failed to fetch movie data. Status:', textStatus, 'Error:', errorThrown);
                // You can display an error message to the user here
            });
        }
    }
    
});
