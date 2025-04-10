/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react";
import { BsSearch } from "react-icons/bs";
import { songs } from "../data/songs";
import SongItem from "../components/SongItem/SongItem";
import { toast } from "react-toastify";

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

  const handlePlay = (song) => {
    setCurrentSong(song);
    let recentlyPlayed = [];
    try {
      recentlyPlayed = JSON.parse(
        localStorage.getItem("recentlyPlayed") || "[]"
      );
    } catch (error) {
      console.error("Failed to parse recently played songs:", error);
    }
    const updatedRecent = [
      song,
      ...recentlyPlayed.filter((track) => track.id !== song.id),
    ].slice(0, 10);
    localStorage.setItem("recentlyPlayed", JSON.stringify(updatedRecent));
  };

  const handleRemoveTrack = (song) => {
    toast.success(`Feature to remove ${song.title} will be implemented here.`);
  };

  const filteredSongs = useMemo(
    () =>
      allSongs.filter(
        (song) =>
          song.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ),
    [allSongs, debouncedSearchTerm]
  );

  return (
    <div className="favorites">
      <h2>For You</h2>
      <div className="search-bar">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search tracks..."
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
