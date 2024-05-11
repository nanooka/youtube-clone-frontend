// src/app/page.tsx

// @ts-nocheck
// use client
"use client";
import React from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import CustomYouTubePlayer from "./CustomYouTubePlayer";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
  };
}

export default function Home({ videos }: { videos: Video[] }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Video[]>(videos);

  const hydrate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      setSearchResults(response.data.items as Video[]);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };

  const handleSearch = () => {
    hydrate();
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {searchResults &&
          searchResults.map((video) => (
            <li key={video.id.videoId}>
              <h3>{video.snippet.title}</h3>
              {/* <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                controls
              /> */}
              <CustomYouTubePlayer videoId={video.id.videoId} />
            </li>
          ))}
      </ul>
    </div>
  );
}
