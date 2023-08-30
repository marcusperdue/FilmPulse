


//starter code for javascript
// TODO: change ids to fit html
//TODO: add youtube api when html is finished 

//OMDb API - pulls poster and movie data
$(document).ready(function() {
    $('#searchButton').click(function() {
      var searchTerm = $('#searchInput').val();
      if (searchTerm) {
        var omdbApiKey = 'ca388ffd';
        var omdbApiUrl = 'https://www.omdbapi.com/?apikey=' + omdbApiKey + '&t=' + encodeURIComponent(searchTerm);
                
        $.getJSON(omdbApiUrl, function(data) {
          if (data.Response === 'True') {
            var posterApiUrl = 'https://img.omdbapi.com/?i=' + data.imdbID + '&apikey=' + omdbApiKey;
            var resultHtml = `
            <div class="card">
              <div class="card-image">
                <figure class="image">
                  <img src="${posterApiUrl}" alt="Movie Poster">
                </figure>
              </div>
              <div class="card-content">
                <p class="title">${data.Title}</p>
                <p class="subtitle">${data.Year}</p>
                <p>${data.Plot}</p>
                <p>Director: ${data.Director}</p>
                <p>Actors: ${data.Actors}</p>
                <p>Genre: ${data.Genre}</p>
                <p>Runtime: ${data.Runtime}</p>
                <!-- You can add more properties as needed -->
              </div>
            </div>
            `;
            $('#result').html(resultHtml);
          }
        });
      }
    }); 
  });
  