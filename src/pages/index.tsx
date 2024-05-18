"use client";

// import Header from "@/app/components/Header";
import { Roboto } from "next/font/google";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    description: string;
    publishTime: string;
    thumbnails: { medium: { height: number; url: string; width: number } };
  };
}

interface HomeProps {
  searchResults: Video[];
}

export default function Home({ searchResults }: HomeProps) {
  // const [searchResults, setSearchResults] = useState<Video[]>([]);
  const router = useRouter();

  console.log("index", searchResults);

  // const handleSearchResults = (results: Video[]) => {
  //   setSearchResults(results);
  // };

  const handleVideoClick = (video: Video) => {
    router.push({
      pathname: `/watch/${video.id.videoId}`,
    });
  };

  // console.log(searchResults);

  return (
    <div className={roboto.className}>
      {/* <Header onSearchResults={handleSearchResults} /> */}
      <ul
        style={{
          listStyleType: "none",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {searchResults &&
          searchResults.map((video) => (
            <li
              key={video.id.videoId}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                textAlign: "start",
              }}
            >
              <button
                onClick={() => handleVideoClick(video)}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "start",
                }}
              >
                <Image
                  src={video.snippet.thumbnails.medium.url}
                  alt="video"
                  width={320}
                  height={180}
                />
                <h3>{video.snippet.title}</h3>
              </button>
              <p>{video.snippet.channelTitle}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
