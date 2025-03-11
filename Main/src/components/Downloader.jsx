import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { FaDownload } from "react-icons/fa"; // Import download icon from react-icons

const Downloader = ({ user }) => {
  const [url, setUrl] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(""); // User-selected media type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadHistory, setDownloadHistory] = useState([]); // To store download history

  // Fetch download history for the current user
  useEffect(() => {
    if (user?.uid) {
      const q = query(collection(db, "downloads"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const history = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDownloadHistory(history);
      });

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, [user]);

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate media type selection
    if (!mediaType) {
      setError("Please select a media type.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert?url=${url}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "",
            "x-rapidapi-host":
              "instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com",
          },
        }
      );

      const data = await response.json();
      console.log(data, "API Response");

      // Check if media is available in the response
      if (data.media && data.media.length > 0) {
        const mediaUrl = data.media[0].url;
        setMedia(mediaUrl);

        // Save to Firestore
        await addDoc(collection(db, "downloads"), {
          userId: user.uid,
          url: url,
          timestamp: new Date(),
          mediaType: mediaType, // Use user-selected media type
          mediaUrl: mediaUrl, // Save the media URL for history
        });
      } else {
        setError("No media found in the response.");
      }
    } catch (err) {
      console.error("Error downloading media:", err);
      setError("Failed to download media. Please check the URL and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Download Instagram Media
        </h2>
        <form onSubmit={handleDownload} className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Instagram URL"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />

          {/* Media Type Dropdown */}
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Select Media Type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="story">Story</option>
            <option value="reel">Reel</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Downloading..." : "Download"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {media && (
          <div className="mt-6">
            {mediaType === "video" || mediaType === "reel" ? (
              <video controls src={media} className="max-w-full rounded-lg" />
            ) : (
              <img src={media} alt="Downloaded" className="max-w-full rounded-lg" />
            )}
            <a
              href={media}
              download
              className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save to Device
            </a>
          </div>
        )}

        {/* Download History Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Download History</h3>
          {downloadHistory.length > 0 ? (
            <div className="space-y-4">
              {downloadHistory.map((item) => (
                <div key={item.id} className="border p-4 rounded-lg flex items-center space-x-4">
                  {/* Media Thumbnail */}
                  {item.mediaType === "video" || item.mediaType === "reel" ? (
                    <video
                      src={item.mediaUrl}
                      className="w-20 h-20 object-cover rounded-lg"
                      controls={false}
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt="Downloaded Media"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}

                  {/* Media Details */}
                  <div className="flex-1">
                    <p className="text-gray-700">
                      <strong>URL:</strong> {item.url}
                    </p>
                    <p className="text-gray-700">
                      <strong>Type:</strong> {item.mediaType}
                    </p>
                    <p className="text-gray-700">
                      <strong>Date:</strong> {new Date(item.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </div>

                  {/* Download Icon */}
                  <a
                    href={item.mediaUrl}
                    download
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaDownload className="w-6 h-6" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No download history found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Downloader;
