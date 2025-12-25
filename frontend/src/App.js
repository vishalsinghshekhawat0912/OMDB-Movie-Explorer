import { useEffect, useState } from "react";
import "./App.css";
import { getMovieDetails } from "./services/Api";
import {
  addFavourite,
  getFavourites,
  getFavouriteDetails
} from "./services/favouriteApi";

import SearchForm from "./Components/SearchForm";
import MovieCard from "./Components/MovieCard";
import FavouriteGrid from "./Components/FavouriteGrid";

function App() {
  const [movie, setMovie] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔹 Load favourites on app start */
  useEffect(() => {
    loadFavourites();
  }, []);

  const loadFavourites = async () => {
    try {
      const data = await getFavourites();
      setFavourites(data);
    } catch {
      console.error("Failed to load favourites");
    }
  };

  /* 🔹 Search movie from backend */
  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setError("");
      setMovie(null);

      const data = await getMovieDetails(filters);
      setMovie(data);
    } catch (err) {
      setError(err.message || "Movie not found");
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Add movie to favourites */
  const handleAddFavourite = async () => {
    if (!movie) return;

    try {
      await addFavourite(movie);
      await loadFavourites();
      alert("Added to favourites ❤️");
    } catch (err) {
      alert(err.message || "Failed to add favourite");
    }
  };

  /* 🔹 Click favourite → load full details */
  const handleFavouriteClick = async (fav) => {
    try {
      setLoading(true);
      setError("");
      setMovie(null);

      const data = await getFavouriteDetails(
        fav.title,
        fav.year,
        fav.type
      );

      setMovie(data);
    } catch {
      setError("Failed to load favourite details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 style={{
        textAlign: "center",
        fontSize: "2.5rem",
        color: "#facc15",
        margin: "20px 0"
      }}>
        🎬 OMDB Movie Explorer
      </h1>

      <SearchForm onSearch={handleSearch} />

      {/* 🔹 Loading */}
      {loading && (
        <div className="loading-container">
          <div className="loading-message">
            🔍 Searching movie...
          </div>
        </div>
      )}

      {/* 🔹 Welcome */}
      {!loading && !error && !movie && (
        <div className="welcome-container">
          <h2>🎬 Discover Movies & Series</h2>
          <h3>Search above to explore detailed information instantly.</h3>
          <h3>Ratings ⭐ • Cast 🎭 • Plot 📖</h3>
        </div>
      )}

      {/* 🔹 Error */}
      {error && (
        <div className="error-container">
          <div className="error-message">
            ⚠️ {error}
          </div>
        </div>
      )}

      {/* 🔹 Favourites Section */}
      {!loading && !error && !movie && favourites.length > 0 && (
        <FavouriteGrid
          favourites={favourites}
          onSelect={handleFavouriteClick}
        />
      )}

      {/* 🔹 Movie Details */}
      {movie && (
        <>
          <MovieCard movie={movie} />
          <div style={{ textAlign: "center", margin: "20px" }}>
            <button
              className="favourite-btn"
              onClick={handleAddFavourite}
            >
              ❤️ Add to Favourites
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
