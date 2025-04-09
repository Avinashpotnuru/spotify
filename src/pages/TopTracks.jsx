/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useMemo } from "react";
import {  BsSearch } from "react-icons/bs";
import { songs } from "../data/songs";
import SongItem from "../components/SongItem/SongItem";

const TopTracks = ({ setCurrentSong }) => {
  const [allSongs, setAllSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAllSongs(songs);
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
          "Failed to parse recentlyPlayed from sessionStorage:",
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

  const handleRemoveTrack = useCallback((song) => {
    alert(`Feature to remove ${song.title} will be implemented here.`);
  }, []);

  const filteredSongs = useMemo(
    () =>
      allSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [allSongs, searchTerm]
  );

  return (
    <div className="top-tracks">
      <h2>Top Tracks</h2>
      <div className="search-bar">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search Song , Artist"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <BsSearch className="search-icon" />
        </div>
      </div>

      <div className="songs-list">
        {filteredSongs.map((song) => (
          <SongItem
            key={song.id}
            song={song}
            onPlay={handlePlay}
            removeFavorite={handleRemoveTrack}
          />
        ))}
      </div>
    </div>
  );
};

export default TopTracks;
