import React, { use, useEffect, useState } from 'react';
import Search from './components/Search';
import './App.css';
import Spinner from './components/Spinner';


const API_BASE_URL = "http://www.omdbapi.com/";
 const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

const fetchMovies = async (query) => {
  setIsLoading(true);
  setErrorMessage('');
  try {
    if (!query) return; // don't fetch if empty

    const endpoint = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.Response === "False") {
      setErrorMessage(data.Error || "No movies found");
      setMovieList([]);
      return;
    }

    // Save movie list to state
    setMovieList(data.Search);

  } catch (error) {
    console.error("Error fetching movies. Please try again:", error);
    setErrorMessage("Error fetching movies. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchMovies('Movies'); // provide a default query
  }, []);

 return (
    <main>
      <div className='pattern'> 
        <div className='wrapper'> 
          <header>
            <img src="./hero-img.png" alt="Banner" />
            <h1>Find <span className='text-gradient'>Movies</span> you'll Enjoy without the Hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className='movie-list'>
            <h2 className="mt-[40px]">All Movies</h2>
            {isLoading ? (
                <Spinner/>
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ):(
              <ul>
  {movieList.map((movie) => (
    <li key={movie.imdbID} className='text-white'>
      {movie.Title}
    </li>
  ))}
</ul>

            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
