import "./MovieCard.css";

function MovieCard({ movie }) {
  if (!movie) return null;

  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.title} />

      <div className="movie-info">
        <h2>{movie.title} ({movie.year})</h2>
        <p><strong>🕒</strong>  {movie.time}</p>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Writer:</strong> {movie.writers}</p>
        <p><strong>Actors:</strong> {movie.actors}</p>
        <p>{movie.plot}</p>
         <p><strong>Genre:</strong> {movie.genre}</p>
        <p><strong>Language:</strong> {movie.language}</p>
        <p><strong>BoxOffice Collection:</strong> {movie.collection}</p>
        <p><strong>IMDB Rating:</strong> ⭐ {movie.rating}</p>
        <p><strong>Type:</strong> {movie.type}</p>

      </div>
    </div>
  );
}

export default MovieCard;