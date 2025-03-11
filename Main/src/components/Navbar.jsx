import React from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Insta Downloader</h1>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user.displayName}</span>
            <button 
              onClick={handleLogout}
              className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-opacity-90 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;