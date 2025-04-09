/* eslint-disable react/prop-types */
import { BsThreeDotsVertical } from "react-icons/bs";

const SongItem = ({ song, onPlay, removeFavorite }) => {
  return (
    <div key={song.id} className="song-item" onClick={() => onPlay(song)}>
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
          // onFavorite(song);
          removeFavorite(song);
        }}
      >
        <BsThreeDotsVertical />
      </button>
    </div>
  );
};

export default SongItem;
