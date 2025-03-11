import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const History = ({ user }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const q = query(collection(db, "downloads"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const downloads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(downloads);
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Download History</h2>
        {history.length === 0 ? (
          <p className="text-gray-600">No downloads yet</p>
        ) : (
          <div className="space-y-4">
            {history.map(item => (
              <div key={item.id} className="border p-4 rounded-lg">
                <p className="text-gray-800">{item.url}</p>
                <p className="text-sm text-gray-600">
                  {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;