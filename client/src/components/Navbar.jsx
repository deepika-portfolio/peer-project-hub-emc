import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          Peer Project Hub
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-brand-600">
            Feed
          </Link>
          {currentUser && (
            <>
              <Link to="/create" className="hover:text-brand-600">
                New Project
              </Link>
              <Link to="/favorites" className="hover:text-brand-600">
                Favorites
              </Link>
              <Link to={`/profile/${currentUser.uid}`} className="hover:text-brand-600">
                Profile
              </Link>
            </>
          )}
          <Link to="/stats" className="hover:text-brand-600">
            Stats
          </Link>

          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-brand-600 text-white px-3 py-1.5 rounded-md hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
