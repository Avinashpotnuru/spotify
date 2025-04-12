/* eslint-disable react/prop-types */
import { Nav } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BsMusicNoteList,
  BsHeart,
  BsClock,

  BsStars,
} from "react-icons/bs";
import spotify from "../../assets/spotify.png";
import "./Sidebar.scss";
const Sidebar = ({ show }) => {
  const location = useLocation();
    const navigate = useNavigate();

  const navItems = [
    { path: "/", icon: <BsStars />, label: "For You" },
    { path: "/top-tracks", icon: <BsMusicNoteList />, label: "Top Tracks" },
    { path: "/favorites", icon: <BsHeart />, label: "Favourites" },
    { path: "/recently-played", icon: <BsClock />, label: "Recently Played" },
  ];

  return (
    <div className={["sidebar", show && "show"].filter(Boolean).join(" ")}>
      <div onClick={() => navigate("/")} className="logo">
        <img src={spotify} alt="Spotify" width={40} height={40} />
        <h3>Spotify</h3>
      </div>
      <Nav className="">
        {navItems.map((item) => (
          <Nav.Item key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </Nav.Item>
        ))}
      </Nav>
      <div className="profile-section">
        <div className="profile-image">
          <img src="/myLogo.jpg" alt="Profile"  /> 
        </div>
        <div className="profile-info">
          <h4>Avinash</h4>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
