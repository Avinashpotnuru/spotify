/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, useCallback } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipBackwardFill,
  BsSkipForwardFill,
  BsVolumeUp,
  BsChevronLeft,
  BsList,
  BsHeart,
  BsHeartFill,
} from "react-icons/bs";

import { getImageColors } from "../../utils/colorUtils";
import "./Player.scss";

const Player = ({
  song,
  isPlaying,
  setIsPlaying,
  onToggleSidebar,
  playNext,
  playPrevious,
}) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  //  Sync favorite icon state when song changes
  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const isFav = storedFavorites.some((fav) => fav.id === song.id);
    setIsFavorite(isFav);
  }, [song]);

  //  Toggle favorite logic
  const handleAddToFavorites = useCallback(() => {
    let storedFavorites = [];
    try {
      storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch (error) {
      console.error("Error accessing local storage:", error);
    }

    const isAlreadyFavorite = storedFavorites.some((fav) => fav.id === song.id);
    let updatedFavorites;

    if (!isAlreadyFavorite) {
      updatedFavorites = [...storedFavorites, song];
      alert(`${song?.title} has been added to your favorites.`);
    } else {
      updatedFavorites = storedFavorites.filter((fav) => fav.id !== song.id);
      alert(`${song?.title} has been removed from your favorites.`);
    }

    try {
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(!isAlreadyFavorite); // ✅ toggle UI icon
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  }, [song]);

  // Extract colors from song cover
  useEffect(() => {
    if (song?.cover) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = song.cover;
      img.onload = () => {
        getImageColors(img).then((colors) => {
          document.documentElement.style.setProperty(
            "--color-primary",
            colors.primary
          );
          document.documentElement.style.setProperty(
            "--color-vibrant",
            colors.vibrant
          );
          document.documentElement.style.setProperty(
            "--color-muted",
            colors.muted
          );
        });
      };
    }
  }, [song]);

 
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, song]);

  const handleTimeUpdate = useCallback(() => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(duration);
    setProgress((current / duration) * 100);
  }, []);

  const handleProgressClick = useCallback(
    (e) => {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;

      const newTime = clickPosition * audioRef.current.duration;

      if (!isNaN(newTime)) {
        audioRef.current.currentTime = newTime;
        setProgress((newTime / audioRef.current.duration) * 100);
        setCurrentTime(newTime);

        // Resume playing
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
    [setIsPlaying]
  );

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="player">
      <div className="player-header-main">
        <div className="player-header">
          <button className="back-button" onClick={onToggleSidebar}>
            <BsChevronLeft />
          </button>
          <div className="song-title">
            <h1>{song.title}</h1>
            <p>{song.artist}</p>
          </div>
          <button className="menu-button" onClick={onToggleSidebar}>
            <BsList />
          </button>
        </div>
      </div>

      <div className="player-content">
        <div className="cover-art">
          <img src={song.cover} alt={song.title} />
        </div>
      </div>

      <div className="player-controls">
        <div className="progress-container">
          <div className="time-info">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="progress-bar" onClick={handleProgressClick}>
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="controls">
          <button className="control-btn more" onClick={handleAddToFavorites}>
            {isFavorite ? <BsHeartFill color="red" /> : <BsHeart />}
          </button>
          <div className="controls-center">
            <button className="control-btn" onClick={playPrevious}>
              <BsSkipBackwardFill />
            </button>
            <button
              className="control-btn play"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
            </button>
            <button className="control-btn" onClick={playNext}>
              <BsSkipForwardFill />
            </button>
          </div>
          <button className="control-btn volume">
            <BsVolumeUp />
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={song.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default Player;
