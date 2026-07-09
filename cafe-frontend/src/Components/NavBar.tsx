import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import api from "../api/api";
import "../styles/Navbar.css";

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/account/logout");
      localStorage.removeItem("token");
      onLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src="/Logo.png" alt="Cafe Logo" />
          <span>Cafe</span>
        </Link>
        <Link to="/events" className="navbar-link">
          Events
        </Link>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <span className="user-greeting">👋 {user.firstName}</span>
            <button className="auth-btn logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="auth-btn">Login / Sign Up</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
