/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';
import { BsThreeDotsVertical , BsSearch } from 'react-icons/bs';
import { songs } from '../data/songs';

const TopTracks = ({ setCurrentSong }) => {
  const [allSongs, setAllSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAllSongs(songs);
  }, []);

  const handlePlay = (song) => {
    setCurrentSong(song);
    const recentlyPlayed = JSON.parse(sessionStorage.getItem('recentlyPlayed') || '[]');
    const updatedRecent = [
      song,
      ...recentlyPlayed.filter(track => track.id !== song.id)
    ].slice(0, 10);
    sessionStorage.setItem('recentlyPlayed', JSON.stringify(updatedRecent));
  };

  const handleRemoveTrack = (song) => {
    alert(`Feature to remove ${song.title} will be implemented here.`);
  };

  const filteredSongs = allSongs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="top-tracks">
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
        {filteredSongs.map(song => (
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
                handleRemoveTrack(song);
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

export default TopTracks;
