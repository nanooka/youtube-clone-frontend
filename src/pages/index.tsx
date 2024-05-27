"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { ExtendedVideo } from "@/app/types/types";
import { convertDuration } from "@/app/formulas/formatDuration";
import Link from "next/link";

interface HomeProps {
  // searchResults: Video[];
  searchResults: ExtendedVideo[];
}

export default function Home({ searchResults }: HomeProps) {
  // const [searchResults, setSearchResults] = useState<Video[]>([]);
  const router = useRouter();

  console.log("index", searchResults);

  const handleVideoClick = (video: ExtendedVideo) => {
    console.log("video", video);
    router.push({
      pathname: `/watch/${video.id}`,
    });
  };

  // console.log(searchResults);

  return (
    <div style={{ marginTop: "120px", marginLeft: "120px" }}>
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
                // display: "flex",
                // flexDirection: "column",
                // alignItems: "start",
                // textAlign: "start",
                marginBottom: "20px",
                width: "90%",
                // cursor: "pointer",
              }}
            >
              <div
                className="video-container"
                style={{
                  // display: "flex",
                  // justifyContent: "center",
                  display: "grid",
                  gridTemplateColumns: "480px 1fr",
                  alignItems: "flex-start",
                  // gap: "14px",
                  gap: "24px",
                  // position: "relative",
                }}
              >
                <button
                  onClick={() => handleVideoClick(video)}
                  style={{
                    border: "none",
                    // backgroundColor: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    // flexDirection: "column",
                    // textAlign: "start",
                    position: "relative",
                    // backgroundColor: "red",
                    // borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt="video"
                    // width={video.snippet.thumbnails.medium.width}
                    // height={video.snippet.thumbnails.medium.height}
                    width={480}
                    height={270}
                    className="video-image"
                    // style={{ borderRadius: "12px" }}
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
                <div
                  style={{ marginTop: "-16px", position: "relative" }}
                  className="video-info"
                >
                  <h3
                    style={{
                      fontWeight: "400",
                      cursor: "pointer",
                      width: "100%",
                      // backgroundColor: "red",
                    }}
                    onClick={() => handleVideoClick(video)}
                  >
                    {video.snippet.title}
                  </h3>
                  <div
                    style={{
                      color: "#676767",
                      fontSize: "13px",
                      display: "flex",
                      marginTop: "-14px",
                      marginBottom: "15px",
                      cursor: "pointer",
                      width: "100%",
                      // backgroundColor: "red",
                    }}
                    onClick={() => handleVideoClick(video)}
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <Image
                      src={
                        video.channelImageUrl || "/default-channel-image.png"
                      }
                      alt="channel"
                      width={26}
                      height={26}
                      style={{ borderRadius: "50%" }}
                    />
                    <Link
                      href={`/channel/${video.snippet.channelId}`}
                      style={{
                        marginLeft: "10px",
                        color: "#606060",
                        fontSize: "12px",
                        textDecoration: "none",
                      }}
                    >
                      {video.snippet.channelTitle}
                    </Link>
                  </div>
                  {video.contentDetails.caption == "true" ? (
                    <div
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        // backgroundColor: "red",
                      }}
                      onClick={() => handleVideoClick(video)}
                    >
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
                    </div>
                  ) : null}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="rgba(0,0,0,0.8)"
                    className="bi bi-three-dots-vertical dots"
                    viewBox="0 0 16 16"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "24px",
                      cursor: "pointer",
                    }}
                  >
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                  </svg>
                </div>
              </div>
              {/* <div>{video.player.embedHtml}</div> */}
            </li>
          ))}
      </ul>

      <style jsx>{`
        .video-container button {
          border-radius: 12px;
        }
        .video-container:hover button {
          border-radius: 0;
          transition: 0.3s;
        }
        .video-info .dots {
          display: none;
        }
        .video-info:hover .dots {
          display: block;
        }
      `}</style>
    </div>
  );
}
