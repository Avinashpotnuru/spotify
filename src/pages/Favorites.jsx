/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import SongItem from "../components/SongItem/SongItem";
import { useLocation } from "react-router-dom";

const Favorites = ({ setCurrentSong }) => {
  const [favorites, setFavorites] = useState([]);
  const loaction = useLocation();
  const pageName = loaction.pathname.split("/")[1];

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  const handleRemoveFavorite = (song) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== song.id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handlePlay = (song) => {
    setCurrentSong(song);
    const recentlyPlayed = JSON.parse(
      sessionStorage.getItem("recentlyPlayed") || "[]"
    );
    const updatedRecent = [
      song,
      ...recentlyPlayed.filter((track) => track.id !== song.id),
    ].slice(0, 10);
    sessionStorage.setItem("recentlyPlayed", JSON.stringify(updatedRecent));
  };

  return (
    <div className="favorites">
      <h2>Favorites</h2>
      <div className="songs-list">
        {favorites.map((song) => (
          <SongItem
            key={song.id}
            song={song}
            onPlay={handlePlay}
            removeFavorite={handleRemoveFavorite}
            pageName={pageName}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
