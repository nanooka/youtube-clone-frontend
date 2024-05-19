"use client";

// import Header from "@/app/components/Header";
import { Roboto } from "next/font/google";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { ExtendedVideo } from "@/app/types/types";
import { convertDuration } from "@/app/formulas/formatDuration";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface HomeProps {
  // searchResults: Video[];
  searchResults: ExtendedVideo[];
}

export default function Home({ searchResults }: HomeProps) {
  // const [searchResults, setSearchResults] = useState<Video[]>([]);
  const router = useRouter();

  console.log("index", searchResults);

  // const handleSearchResults = (results: Video[]) => {
  //   setSearchResults(results);
  // };

  // const handleVideoClick = (video: Video) => {
  //   router.push({
  //     pathname: `/watch/${video.id.videoId}`,
  //   });
  // };

  const handleVideoClick = (video: ExtendedVideo) => {
    console.log("video", video);
    router.push({
      pathname: `/watch/${video.id}`,
    });
  };

  // console.log(searchResults);

  return (
    <div className={roboto.className} style={{ marginTop: "100px" }}>
      {/* <Header onSearchResults={handleSearchResults} /> */}
      <ul
        style={{
          listStyleType: "none",
          // display: "grid",
          // gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {searchResults &&
          searchResults.map((video) => (
            <li
              key={video.id.videoId}
              style={{
                display: "flex",
                // flexDirection: "column",
                // alignItems: "start",
                // textAlign: "start",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  // justifyContent: "center",
                  alignItems: "flex-start",
                  gap: "14px",
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
                    position: "relative",
                  }}
                >
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt="video"
                    // width={video.snippet.thumbnails.medium.width}
                    // height={video.snippet.thumbnails.medium.height}
                    width={480}
                    height={270}
                    style={{ borderRadius: "12px" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "12px",
                      color: "white",
                      background: "rgba(0,0,0,0.65)",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "3px",
                      borderRadius: "4px",
                    }}
                  >
                    {convertDuration(video.contentDetails.duration)}
                  </span>
                </button>
                <div style={{ marginTop: "-16px" }}>
                  <h3 style={{ fontWeight: "400" }}>{video.snippet.title}</h3>
                  <div
                    style={{
                      color: "#676767",
                      fontSize: "13px",
                      display: "flex",
                    }}
                  >
                    <span>{formatViewCount(video.statistics.viewCount)}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="#676767"
                      className="bi bi-dot"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                    </svg>
                    <span>{dateCalculation(video.snippet.publishedAt)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src={
                        video.channelImageUrl || "/default-channel-image.png"
                      }
                      alt="channel"
                      width={26}
                      height={26}
                      style={{ borderRadius: "50%" }}
                    />
                    <p
                      style={{
                        marginLeft: "10px",
                        color: "#606060",
                        fontSize: "12px",
                      }}
                    >
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                  {video.contentDetails.caption == "true" ? (
                    <span
                      style={{
                        backgroundColor: "#f2f2f2",
                        color: "#606060",
                        padding: "0 4px",
                        borderRadius: "2px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      CC
                    </span>
                  ) : null}
                </div>
              </div>
              {/* <div>{video.player.embedHtml}</div> */}
            </li>
          ))}
      </ul>
    </div>
  );
}
