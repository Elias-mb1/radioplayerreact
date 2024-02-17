// src/App.js
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "./App.css";

const App = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.sr.se/api/v2/channels/?format=json"
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const data = await response.json();
        setChannels(data.channels);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const changeColor = (name) => {
    switch (name) {
      case "P1":
        return "#00FFFF";
      case "P2":
        return "#D2691E";
      case "P3":
        return "#8FBC8F";
      default:
        return "#9932CC";
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search stations..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? (
        // Display skeleton loader while data is loading
        <>
          <Skeleton height={100} count={5} />
          <Skeleton height={100} count={5} />
        </>
      ) : (
        // Display the actual channels when data is loaded
        filteredChannels.map((channel) => (
          <div
            key={channel.id}
            style={{ backgroundColor: changeColor(channel.name) }}
            className="channel"
          >
            <div className="parentWidth border">
              <div className="flex childWidth divWidth">
                <img src={channel.image} alt={channel.name} />
              </div>
              <div className="flex innerBorder padding">
                <h2>{channel.name}</h2>
                <audio controls className="audio">
                  <source src={channel.liveaudio.url} type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
