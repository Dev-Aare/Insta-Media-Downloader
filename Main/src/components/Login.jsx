import React, { useState } from 'react';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Welcome to InstaDownloader
        </h2>
        
        <div className="text-center space-y-6">
          <p className="text-gray-600">
            Sign in with your Google account to start downloading Instagram media
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.04.7-2.36 1.11-3.71 1.11-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C4.01 20.36 7.74 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.87 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.45 8.49 1 10.2 1 12s.45 3.51 1.18 4.93l3.69-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.74 1 4.01 3.64 2.18 7.07l3.69 2.84C6.73 7.31 9.15 5.38 12 5.38z"
              />
            </svg>
            Sign in with Google
          </button>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>By signing in, you agree to our Terms of Service</p>
            <p>and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;