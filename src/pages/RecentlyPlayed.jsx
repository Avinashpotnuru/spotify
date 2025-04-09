/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { songs } from "../data/songs";
import SongItem from "../components/SongItem/SongItem";

const TopTracks = ({ setCurrentSong }) => {
  const [allSongs, setAllSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setAllSongs(songs);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleFavorite = useCallback((song) => {
    let favorites;
    try {
      favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      favorites = [];
    }
    const isFavorite = favorites.some((fav) => fav.id === song.id);

    if (isFavorite) {
      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites.filter((fav) => fav.id !== song.id))
      );
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favorites, song]));
    }
  }, []);

  const handlePlay = useCallback(
    (song) => {
      setCurrentSong(song);
      let recentlyPlayed;
      try {
        recentlyPlayed = JSON.parse(
          sessionStorage.getItem("recentlyPlayed") || "[]"
        );
      } catch (error) {
        console.error(
          "Failed to parse recentlyPlayed from sessionStorage",
          error
        );
        recentlyPlayed = [];
      }
      const updatedRecent = [
        song,
        ...recentlyPlayed.filter((track) => track.id !== song.id),
      ].slice(0, 10);
      sessionStorage.setItem("recentlyPlayed", JSON.stringify(updatedRecent));
    },
    [setCurrentSong]
  );

  const filteredSongs = allSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="recently-played">
      <h2>Recently Played</h2>
      <div className="songs-list">
        {filteredSongs.map((song) => (
          <SongItem
            key={song.id}
            song={song}
            onPlay={handlePlay}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default TopTracks;
