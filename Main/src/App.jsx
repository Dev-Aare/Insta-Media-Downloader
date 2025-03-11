import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './config/firebase';
import Navbar from './components/Navbar';
import Downloader from './components/Downloader';
import History from './components/History';
import Login from './components/Login'; // Add this import
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar user={user} />
        <Routes>
          <Route 
            path="/" 
            element={user ? <Downloader user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/history" 
            element={user ? <History user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;