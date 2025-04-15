import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Nav = ()=>{
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = localStorage.getItem("user");
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const logout =() => {
    localStorage.clear();
    navigate("/login");
  };
  return(
    <div className="main-menu">
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>
      {auth? (
        <ul className={`menu-items ${isMenuOpen ? "open" : ""}`}>
            <li onClick={toggleMenu}>
            <Link to="/">Home</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link to="/about">About</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link to="/blog">Blog</Link>
          </li>
          <li onClick={logout}>
            <Link to="/login">Logout</Link>
          </li>
          <li className="close-btn" onClick={toggleMenu}>
            &#10005;
          </li>
        </ul>
      ) : (
        // Menu for unauthenticated users
        <ul className={`menu-items ${isMenuOpen ? "open" : ""}`}>
          <li onClick={toggleMenu}>
            <Link to="/signup">Signup</Link>
          </li>
          <li onClick={toggleMenu}>
            <Link to="/login">Login</Link>
          </li>
          <li className="close-btn" onClick={toggleMenu}>
            &#10005;
          </li>
        </ul>
      )}
    </div>
  );
};
export default Nav;
