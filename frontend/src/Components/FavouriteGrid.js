function FavouriteGrid({ favourites, onSelect }) {
  return (
    <section className="favorites-section">
      <h2>❤️ Your Favourites</h2>

      <div className="favorites-grid">
        {favourites.map((fav, index) => (
          <div
            key={index}
            className="favorite-card"
            onClick={() => onSelect(fav)}
          >
            <img
              src={fav.poster}
              alt={fav.title}
              className="fav-poster"
            />

            <div className="fav-info">
              <h4>{fav.title}</h4>
              <p>{fav.year} • {fav.type}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FavouriteGrid;
