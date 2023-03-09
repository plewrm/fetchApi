import React, { useCallback, useState,useEffect } from "react";
import AddMovie from './components/AddMovie';
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const  fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setIsError(null);
    try {
      const response = await fetch("https://react-http-d104d-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");
      
      if (!response.ok){
        throw new Error('Something went wrong...!');
      }

      const data = await response.json();

      const loadMovies= [];

      for(const key in data){
        loadMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate
        })
      }
      // const transforedMovies = data.results.map((movieData) => {
      //   return {
      //     id: movieData.episode_id,
      //     title: movieData.title,
      //     openingText: movieData.opening_crawl,
      //     releaseDate: movieData.release_date,
      //   };
      // });
      // setMovies(transforedMovies);
      setMovies(loadMovies);
    } catch (isError) {
      setIsError(isError.message);
    }
    setIsLoading(false);
  },[]);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler])
  
  async function addMovieHandler(movie) {
   const response=await fetch("https://react-http-d104d-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",{
      method:'POST',
      body:JSON.stringify(movie),
      headers:{
        'Content-Type':'application/json'
      } 

    }
    );
    const data= await response.json();
    console.log(data);
  }
  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];

  return (
    <React.Fragment>
    <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !isError && <p>No movie found</p>}
        {!isLoading && isError && <p>{isError}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
