import React, { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import './App.css';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce searchTerm changes
  useDebounce(() => setDebouncedTerm(searchTerm), 500, [searchTerm]);

  const loadingTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies(); // <-- add ()
      setTrendingMovies(movies);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setMovieList([]);
        setErrorMessage('No movies found');
        return;
      }

      setMovieList(data.results);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Error fetching movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch movies when search changes
  useEffect(() => {
    fetchMovies(debouncedTerm);
  }, [debouncedTerm]);

useEffect(() => {
  const loadTrending = async () => {
    const trending = await getTrendingMovies();
    setTrendingMovies(trending);
  };
  loadTrending();
}, []);

// When user searches:
// await updateSearchCount(searchTerm, selectedMovie); 

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> you'll Enjoy without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
  <section className="trending mt-6">
    <h2 className="text-white text-xl mb-2">Trending Movies</h2>
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
      {trendingMovies.map((movie, index) => (
        <div
          key={movie.$id}
          className="trending-card p-2 bg-gray-800 rounded-md flex flex-col items-center"
        >
          <p className="text-sm text-gray-400 mb-1">{index + 1}</p>
          <img
            src={movie.poster_url || '/placeholder.png'}
            alt={movie.title}
            className="w-full h-40 object-cover rounded"
          />
          <p className="text-white text-sm mt-1 text-center">{movie.title}</p>
        </div>
      ))}
    </div>
  </section>
)}
         
          

          <section className="mt-10">
            <h2 className="text-white text-2xl mb-6">All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
                {movieList.map((movie) => (
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
 