import React, { use, useEffect, useState } from 'react';
import Search from './components/Search';
import './App.css';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';


const API_BASE_URL = "https://api.themoviedb.org/3";
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
    if (!query) return;

    const endpoint = `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;

    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      setErrorMessage("No movies found");
      setMovieList([]);
      return;
    }

    setMovieList(data.results); // TMDB returns `results` array

  } catch (error) {
    console.error("Error fetching movies:", error);
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
            <h2 className="flex-1 mt-[40px] text-white text-2xl">All Movies</h2>
            {isLoading ? (
                <Spinner/>
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ):(
  <div className="movie-list grid gap-6 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4 
                px-4">
  {movieList.map(movie => (
    <MovieCard key={movie.id} movie={movie} />
  ))}
</div>


            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
