document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '57def683b1f588faea8196f4db0da86c'; // Your TMDB API key
    const youtubeApiKey = 'YOUR_YOUTUBE_API_KEY'; // Your YouTube Data API key
  
 // Function to fetch the latest trailers
 function fetchLatestTrailers() {
    const trailersContainer = document.querySelector('.trailers-container');
    const trailersURL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

    fetch(trailersURL)
        .then((response) => response.json())
        .then((data) => {
            // Check if there are results
            if (data.results && data.results.length > 0) {
                data.results.forEach((movie) => {
                    // Fetch trailers for each movie
                    fetchMovieTrailers(movie.id)
                        .then((trailers) => {
                            if (trailers && trailers.length > 0) {
                                const trailer = trailers[0]; // Assuming you want to display the first trailer
                                const trailerElement = document.createElement('div');
                                trailerElement.innerHTML = `
                                    <iframe
                                        width="300"
                                        height="169"
                                        src="https://www.youtube.com/embed/${trailer.key}"
                                        frameborder="0"
                                        allowfullscreen
                                    ></iframe>
                                    <p style="color: white; text-align: center">${movie.title}</p>
                                `;
                                trailersContainer.appendChild(trailerElement);
                            }
                        });
                });
            } else {
                console.error('No results found in the API response.');
            }
        })
        .catch((error) => {
            console.error('Error fetching latest trailers:', error);
        });
}

// Function to fetch trailers for a specific movie from TMDB
function fetchMovieTrailers(movieId) {
    const trailersURL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

    return fetch(trailersURL)
        .then((response) => response.json())
        .then((data) => {
            return data.results || [];
        });
}

// Call the function to fetch and display the latest trailers
fetchLatestTrailers();
});