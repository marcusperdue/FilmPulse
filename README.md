# [FilmPulse](https://marcusperdue.github.io/FilmPulse/) 

## Introduction

Welcome to [FilmPulse](https://marcusperdue.github.io/FilmPulse/), your ultimate destination for exploring the world of movies. Whether you're a dedicated cinephile searching for information about your favorite films or just curious about the latest releases, FilmPulse is your go-to platform.

##
### User Story:

- **AS A** user of the [FilmPulse](https://marcusperdue.github.io/FilmPulse/)  website,  
- **I WANT TO** search for movies and TV shows  
- **SO THAT I CAN** quickly find information about my favorite films and TV series, make informed viewing decisions, and stay updated on the latest releases.

### Acceptance Criteria: 

- **GIVEN** I'm on the [FilmPulse](https://marcusperdue.github.io/FilmPulse/)  website,
- **WHEN** I enter a title in the search bar,
- **THEN** I should be able to click the "Search" button,
- **AND** I expect to see a list of movies and TV shows related to the title I entered,
- **AND** the search results should include movie and TV show titles, genres, release years, directors, casts, and plot summaries.
- **WHEN** I click on a search result,
- **THEN** I should be directed to a dedicated page with detailed information about the selected movie or TV show,
- **AND** I should be able to view trailers, reviews, ratings, and related recommendations.
- **WHEN** I use the search feature,
- **THEN** I should be able to refine my search by applying filters such as genre, release year, and rating,
- **AND** I should have the option to sort the search results by relevance, release date, or rating.
- **WHEN** I interact with the website on different devices, including desktops, tablets, and smartphones,
- **THEN** I expect the website to provide a responsive and visually appealing user experience on all screen sizes.

##
## Installation

To run [FilmPulse](https://marcusperdue.github.io/FilmPulse/) locally, follow these simple steps:

1. Clone the GitHub repository:
```bash
git clone https://github.com/marcusperdue/FilmPulse.git
```

2. Open the cloned directory in your preferred code editor.

3. Start exploring movies and TV shows with FilmPulse!

## Live Deploy
[FilmPulse](https://marcusperdue.github.io/FilmPulse/) has been deployed to GitHub Pages and is accessible online. You can experience the live website by visiting the following URL: [https://marcusperdue.github.io/FilmPulse/](https://marcusperdue.github.io/FilmPulse/)

<img src="./Assets/Images/mainscreenshot.png" alt="Main Screenshot" width="300" height="370"/>
<img src="./Assets/Images/genrescreenshot1.png" alt="Genre Screenshot" width="320" height="370"/>


## API Integration

[FilmPulse](https://marcusperdue.github.io/FilmPulse/) harnesses the power of two robust APIs to provide you with comprehensive movie and TV show data:

### OMDB API


The OMDB API serves as the foundation for retrieving movie data. Here's the key endpoint:

- **Endpoint for Movie Data:** `https://www.omdbapi.com/?apikey=ca388ffd&t=<movie_title>`

[FilmPulse](https://marcusperdue.github.io/FilmPulse/) extracts valuable information from OMDB, including movie title, genre, release year, director, cast, and plot summary. If the data pertains to a TV series with season and episode details, FilmPulse seamlessly redirects you to the TV show overview page.

### TMDb API


The TMDb (The Movie Database) API enhances FilmPulse with detailed TV show data and exciting trailers. Here are the crucial endpoints:

- **Endpoint for TV Show Data:** `https://api.themoviedb.org/3/search/tv?api_key=57def683b1f588faea8196f4db0da86c&query=<tv_show_title>`
- **Endpoint for TV Show Trailers:** `https://api.themoviedb.org/3/tv/<tv_show_id>/videos?api_key=57def683b1f588faea8196f4db0da86c&language=en-US`

FilmPulse relies on the TMDb API to fetch detailed TV show data and captivating trailers. It stores this data locally and presents it on the TV show overview page.

## Features

- **Search Movies and TV Shows:** FilmPulse offers an intuitive search bar, allowing you to easily discover your favorite movies and TV shows.

 

- **Comprehensive Details:** Get in-depth information about each movie or TV show, including title, genre, release year, director, cast, and a captivating plot summary.

 

- **User-Friendly Interface:** We've designed FilmPulse with a user-friendly interface to ensure effortless navigation for users of all tech levels.

 

- **Responsive Design:** FilmPulse guarantees a visually appealing and consistent experience across all devices, whether you're using a desktop, tablet, or smartphone.

 
 ## License

Please refer to the LICENSE file in the repository.




<div align="left">
  <h2>Credits</h2>
  <p>Special thanks to the following contributors who have helped make this project possible:</p>
</div>

<div style="display: flex; justify-content: flex-start; align-items: left; flex-wrap: wrap;">
  <div style="text-align: center; margin: 0 15px;">
    <a href="https://github.com/UCarr81">
      <img src="https://avatars.githubusercontent.com/UCarr81" alt="UCarr81's Avatar" width="100">
    </a>
    <br>
    <a href="https://github.com/UCarr81">UCarr81</a>
  </div>

  <div style="text-align: center; margin: 0 15px;">
    <a href="https://github.com/Emlonike">
      <img src="https://avatars.githubusercontent.com/Emlonike" alt="Emlonike's Avatar" width="100">
    </a>
    <br>
    <a href="https://github.com/Emlonike">Emlonike</a>
  </div>

  <div style="text-align: center; margin: 0 15px;">
    <a href="https://github.com/TylerJMalone">
      <img src="https://avatars.githubusercontent.com/TylerJMalone" alt="TylerJMalone's Avatar" width="100">
    </a>
    <br>
    <a href="https://github.com/TylerJMalone">TylerJMalone</a>
  </div>

  <div style="text-align: center; margin: 0 15px;">
    <a href="https://github.com/marcusperdue">
      <img src="https://avatars.githubusercontent.com/marcusperdue" alt="marcusperdue's Avatar" width="100">
    </a>
    <br>
    <a href="https://github.com/marcusperdue">marcusperdue</a>
  </div>
</div>

</div>
