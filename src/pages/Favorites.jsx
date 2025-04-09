import { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

const Favorites = ({ setCurrentSong }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  const handleRemoveFavorite = (song) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== song.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handlePlay = (song) => {
    setCurrentSong(song);
    const recentlyPlayed = JSON.parse(sessionStorage.getItem('recentlyPlayed') || '[]');
    const updatedRecent = [
      song,
      ...recentlyPlayed.filter(track => track.id !== song.id)
    ].slice(0, 10);
    sessionStorage.setItem('recentlyPlayed', JSON.stringify(updatedRecent));
  };

  return (
    <div className="favorites">
      <h2>Favorites</h2>
      <div className="songs-list">
        {favorites.map(song => (
          <div key={song.id} className="song-item" onClick={() => handlePlay(song)}>
            <img src={song.cover} alt={song.title} className="cover" />
            <div className="details">
              <h4>{song.title}</h4>
              <p>{song.artist}</p>
            </div>
            <span className="duration">{song.duration}</span>
            <button 
              className="more-options"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFavorite(song);
              }}
            >
              <BsThreeDotsVertical />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
