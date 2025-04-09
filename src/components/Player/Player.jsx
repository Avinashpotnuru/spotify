/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, useCallback } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipBackwardFill,
  BsSkipForwardFill,
  BsThreeDotsVertical,
  BsVolumeUp,
  BsChevronLeft,
  BsList,
} from "react-icons/bs";
import { getImageColors } from "../../utils/colorUtils";
import "./Player.scss"

const Player = ({
  song,
  isPlaying,
  setIsPlaying,
  onToggleSidebar,
  playNext,
  playPrevious,
}) => {
  // Create a reference to the audio element
  const audioRef = useRef(null);
  // Create state variables to store the progress, current time, and duration of the song
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Function to add a song to the user's favorites
  const handleAddToFavorites = useCallback(() => {
    let storedFavorites = [];
    try {
      storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch (error) {
      console.error("Error accessing local storage:", error);
    }
    const isAlreadyFavorite = storedFavorites.some((fav) => fav.id === song.id);

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...storedFavorites, song];
      try {
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error("Error saving to local storage:", error);
      }
      alert(`${song?.title} has been added to your favorites.`);
    } else {
      alert(`${song?.title} is already in your favorites.`);
    }
  }, [song]);

  // UseEffect to update the background colors based on the song's cover art
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

  // UseEffect to play or pause the audio based on the isPlaying state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, song]);

  // Function to update the progress, current time, and duration of the song
  const handleTimeUpdate = useCallback(() => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setCurrentTime(current);
    setDuration(duration);
    setProgress((current / duration) * 100);
  }, []);

  // Function to seek to a specific time in the song
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

        // Resume playing after seek
        audioRef.current.play();
        setIsPlaying(true);
      }
    },
    [setIsPlaying]
  );

  // Format a time in seconds to MM:SS
  const formatTime = (seconds) => {
    const minutes = seconds / 60 | 0;
    const remainingSeconds = (seconds % 60) | 0;

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
            <BsThreeDotsVertical />
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
