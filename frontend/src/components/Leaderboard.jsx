// src/components/Leaderboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:5000/leaderboard");
        setLeaderboardData(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <h2 className="leaderboard-header">Leaderboard</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={entry._id}>
                <td>{index + 1}</td>
                <td>{entry.userName}</td>
                <td>{entry.score * 10}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
