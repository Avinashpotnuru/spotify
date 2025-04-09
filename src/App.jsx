import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Player from './components/Player/Player';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import RecentlyPlayed from './pages/RecentlyPlayed';
import { songs } from './data/songs'; // Assuming songs is an array of song objects
import './styles/App.scss';
import TopTracks from './pages/TopTracks';

function App() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [currentIndex, setCurrentIndex] = useState(0);  // Track the current song index
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleView = () => {
    if (isMobile) {
      setShowPlayer(!showPlayer);
    }
  };

  const playNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setCurrentSong(songs[(currentIndex + 1) % songs.length]);
  };

  const playPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1));
    setCurrentSong(songs[(currentIndex === 0 ? songs.length : currentIndex) - 1]);
  };

  return (
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
                element={
                  <Home
                    setCurrentSong={(song) => {
                      setCurrentSong(song);
                      if (isMobile) setShowPlayer(true);
                    }}
                  />
                }
              />
              <Route
                path="/top-tracks"
                element={
                  <TopTracks
                    setCurrentSong={(song) => {
                      setCurrentSong(song);
                      if (isMobile) setShowPlayer(true);
                    }}
                  />
                }
              />
              <Route
                path="/favorites"
                element={
                  <Favorites
                    setCurrentSong={(song) => {
                      setCurrentSong(song);
                      if (isMobile) setShowPlayer(true);
                    }}
                  />
                }
              />
              <Route
                path="/recently-played"
                element={
                  <RecentlyPlayed
                    setCurrentSong={(song) => {
                      setCurrentSong(song);
                      if (isMobile) setShowPlayer(true);
                    }}
                  />
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
  );
}

export default App;
