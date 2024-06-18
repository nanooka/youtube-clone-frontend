import { useUser } from "@/app/context/UserContext";
import { Video } from "@/app/types/types";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatLikeCount } from "@/app/formulas/formatLikeCount";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";

export default function LikedVideos() {
  const { user } = useUser();
  const [likedVideosDetails, setLikedVideosDetails] = useState<Video[]>([]);

  function isVideoIdObject(
    id: string | { videoId: string }
  ): id is { videoId: string } {
    return (id as { videoId: string }).videoId !== undefined;
  }

  useEffect(() => {
    const fetchLikedVideosDetails = async () => {
      if (user && user.likedVideos.length > 0) {
        try {
          const videoIDs = user.likedVideos
            .map((video) =>
              isVideoIdObject(video.id) ? video.id.videoId : video.id
            )
            .join(",");
          const apiKey = process.env.apiKey;
          const response = await axios.get(
            `http://localhost:3000/api/youtube/videos/${videoIDs}?${apiKey}&part=snippet,statistics,player,contentDetails`
          );
          setLikedVideosDetails(response.data.items);
        } catch (error) {
          console.error("Error fetching liked videos details:", error);
        }
      }
    };
    fetchLikedVideosDetails();
  }, [user]);

  if (!user) {
    return (
      <div style={{ marginTop: "120px", marginLeft: "120px" }}>
        Please log in to see your liked videos.
      </div>
    );
  }

  return (
    <div style={{ margin: "120px 20px 0 120px" }}>
      {/* <div style={{ display: "flex", justifyContent: "end" }}> */}
      <div style={{ display: "grid", gridTemplateColumns: "30% 70%" }}>
        <div
          style={{
            backgroundColor: "green",
            borderRadius: "20px",

            // height: "80vh",
            // width: "30%",
            // display: "inline-block",
          }}
        >
          <Image
            src={likedVideosDetails[0].snippet.thumbnails.high.url}
            width={300}
            height={300}
            alt="image"
          />
        </div>
        <ol
          style={
            {
              // display: "flex",
              // flexDirection: "column",
              // alignItems: "end",
              // width: "60%",
            }
          }
        >
          {likedVideosDetails.map((video, index) => (
            <li
              key={isVideoIdObject(video.id) ? video.id.videoId : video.id}
              // style={{ listStyle: "none" }}
              style={{
                listStyle: "none",
                counterIncrement: "videoCounter",
                cursor: "pointer",
                padding: "6px 10px",
                borderRadius: "20px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    marginRight: "10px",
                    color: "#676767",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {index + 1}
                </span>

                <Link
                  href={`/watch?v=${
                    isVideoIdObject(video.id) ? video.id.videoId : video.id
                  }`}
                >
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt="video-image"
                    width={200}
                    height={120}
                    style={{ borderRadius: "10px", cursor: "pointer" }}
                  />
                </Link>
                <div>
                  <Link
                    href={`/watch?v=${
                      isVideoIdObject(video.id) ? video.id.videoId : video.id
                    }`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <p
                      style={{
                        marginTop: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {video.snippet.title}
                    </p>
                  </Link>
                  <div
                    style={{
                      color: "#676767",
                      fontSize: "13px",
                      display: "flex",
                      cursor: "pointer",
                    }}
                  >
                    <Link
                      href={`/channel/${video.snippet.channelId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ color: "#676767", fontSize: "12px" }}>
                        {video.snippet.channelTitle}
                      </span>
                    </Link>
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
                    <Link
                      href={`/watch?v=${
                        isVideoIdObject(video.id) ? video.id.videoId : video.id
                      }`}
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ color: "#676767", fontSize: "12px" }}>
                        {dateCalculation(video.snippet.publishedAt)}
                      </span>
                    </Link>
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
                    <Link
                      href={`/watch?v=${
                        isVideoIdObject(video.id) ? video.id.videoId : video.id
                      }`}
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ color: "#676767", fontSize: "12px" }}>
                        {formatViewCount(video.statistics.viewCount)}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="rgba(0,0,0,0.8)"
                className="bi bi-three-dots-vertical dots"
                viewBox="0 0 16 16"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "60px",
                  zIndex: 5,
                }}
              >
                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
              </svg>
            </li>
          ))}
        </ol>
      </div>
      <style jsx>{`
        li:hover {
          background-color: #f2f2f2;
        }
      `}</style>
    </div>
  );
}
