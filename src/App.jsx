import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Player from "./components/Player/Player";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import RecentlyPlayed from "./pages/RecentlyPlayed";
import { songs } from "./data/songs"; // Assuming songs is an array of song objects
import "./styles/App.scss";
import TopTracks from "./pages/TopTracks";
import { ToastContainer } from "react-toastify";

function App() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current song index
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth <= 768);
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleView = useCallback(() => {
    if (isMobile) {
      setShowPlayer(!showPlayer);
    }
  }, [isMobile, showPlayer]);

  const playNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % songs.length;
      setCurrentSong(songs[newIndex]);
      return newIndex;
    });
  }, [currentIndex]);

  const playPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? songs.length - 1 : prevIndex - 1;
      setCurrentSong(songs[newIndex]);
      return newIndex;
    });
  }, [currentIndex]);

  const handleSetCurrentSong = (song) => {
    setCurrentSong(song);
    if (isMobile) setShowPlayer(true);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        
      />
      <Router>
        <div
          className={["app", showPlayer && "player-visible"]
            .filter(Boolean)
            .join(" ")}
        >
          {/* <div className="app-background"></div> */}
          <div className="left-section">
            <Sidebar />
            <div className="main-content">
              <Routes>
                <Route
                  path="/"
                  element={<Home setCurrentSong={handleSetCurrentSong} />}
                />
                <Route
                  path="/top-tracks"
                  element={<TopTracks setCurrentSong={handleSetCurrentSong} />}
                />
                <Route
                  path="/favorites"
                  element={<Favorites setCurrentSong={handleSetCurrentSong} />}
                />
                <Route
                  path="/recently-played"
                  element={
                    <RecentlyPlayed setCurrentSong={handleSetCurrentSong} />
                  }
                />
              </Routes>
            </div>
          </div>
          <div
            className={["right-section", showPlayer && "visible"]
              .filter(Boolean)
              .join(" ")}
          >
            <Player
              song={currentSong}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onToggleSidebar={handleToggleView}
              playNext={playNext}
              playPrevious={playPrevious}
            />
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
