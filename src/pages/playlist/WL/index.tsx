import { useUser } from "@/app/context/UserContext";
import { Video } from "@/app/types/types";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatLikeCount } from "@/app/formulas/formatLikeCount";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { LiaDownloadSolid } from "react-icons/lia";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoMdPlay } from "react-icons/io";
import { PiShuffle } from "react-icons/pi";

export default function WatchLater() {
  const { user } = useUser();
  //   const [likedVideosDetails, setLikedVideosDetails] = useState<Video[]>([]);
  const [watchLaterVideosDetails, setWatchLaterVideosDetails] = useState<
    Video[]
  >([]);
  const [loading, setLoading] = useState(true);

  function isVideoIdObject(
    id: string | { videoId: string }
  ): id is { videoId: string } {
    return (id as { videoId: string }).videoId !== undefined;
  }

  useEffect(() => {
    const fetchWatchLaterVideosDetails = async () => {
      if (user && user.watchLaterVideos.length > 0) {
        try {
          const videoIDs = user.watchLaterVideos
            .map((video) =>
              isVideoIdObject(video.id) ? video.id.videoId : video.id
            )
            .join(",");
          const apiKey = process.env.apiKey;
          const response = await axios.get(
            `http://localhost:8080/api/youtube/videos/${videoIDs}?${apiKey}&part=snippet,statistics,player,contentDetails`
          );
          setWatchLaterVideosDetails(response.data.items);
        } catch (error) {
          console.error("Error fetching watch later videos details:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchWatchLaterVideosDetails();
  }, [user]);

  if (!user) {
    return (
      <div style={{ marginTop: "120px", marginLeft: "120px" }}>
        Please log in to see your watch later videos.
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ marginTop: "120px", marginLeft: "120px" }}>
        Loading watch later videos...
      </div>
    );
  }

  if (watchLaterVideosDetails.length === 0) {
    return (
      <div style={{ marginTop: "120px", marginLeft: "120px" }}>
        You have no watch later videos.
      </div>
    );
  }

  console.log("watchLaterVideosDetails", watchLaterVideosDetails);

  return (
    <div style={{ margin: "100px 20px 0 140px" }}>
      {/* <div style={{ display: "flex", justifyContent: "end" }}> */}
      <div style={{ display: "grid", gridTemplateColumns: "30% 70%" }}>
        <div
          style={{
            position: "relative",
            backgroundColor: "green",
            borderRadius: "20px",
            height: "80vh",
            width: "340px",
            flexShrink: 0,
            overflow: "hidden",
            padding: "20px 20px 0 36px",
            // display: "inline-block",
            backgroundImage: `url(${watchLaterVideosDetails[0].snippet.thumbnails.high.url})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "normal",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // dark overlay with 50% opacity
              backdropFilter: "blur(40px)", // blur effect
              borderRadius: "inherit",
              zIndex: 1,
            }}
          ></div>
          <div
            className="image-hover-container"
            // style={{ zIndex: 2, position: "relative" }}
          >
            <Image
              src={watchLaterVideosDetails[0].snippet.thumbnails.high.url}
              width={320}
              height={180}
              alt="image"
              // style={{ zIndex: 100 }}
              style={{ borderRadius: "20px" }}
            />
            <div className="image-overlay">
              <IoMdPlay
                style={{ color: "#fff", width: "21px", height: "21px" }}
              />
              <span className="overlay-text">Play all</span>
            </div>
          </div>
          <div
            style={{
              zIndex: 2,
              color: "#fff",
              // display: "flex",
              // flexDirection: "column",
              // alignItems: "start",
            }}
          >
            <h2>watch later</h2>
            <span>{`${user.firstName} ${user.lastName}`}</span>
            <div
              style={{
                opacity: "70%",
                fontSize: "14px",
                display: "flex",
                gap: "10px",
                margin: "5px 0 20px 0",
              }}
            >
              <span>{user.watchLaterVideos.length} videos</span>
              <span>No views</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="downloadAndDotsBtn">
                <LiaDownloadSolid style={{ width: "21px", height: "21px" }} />
              </div>

              <div className="downloadAndDotsBtn">
                <BiDotsVerticalRounded
                  style={{ width: "21px", height: "21px" }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                // justifyContent: "space-between",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <div className="playAllBtn">
                <IoMdPlay style={{ width: "20px", height: "20px" }} />
                <span>Play all</span>
              </div>
              <div className="shuffleBtn">
                <PiShuffle style={{ width: "20px", height: "20px" }} />
                <span>Shuffle</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flexGrow: 1, overflowY: "scroll", height: "85vh" }}>
          <ol
            style={
              {
                // display: "flex",
                // flexDirection: "column",
                // alignItems: "end",
                // width: "60%",
                // overflow: "scroll",
                // height: "80vh",
              }
            }
          >
            {watchLaterVideosDetails.map((video, index) => (
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
                    href={`/watch/${
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
                      href={`/watch/${
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
                        href={`/watch/${
                          isVideoIdObject(video.id)
                            ? video.id.videoId
                            : video.id
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
                        href={`/watch/${
                          isVideoIdObject(video.id)
                            ? video.id.videoId
                            : video.id
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
      </div>
      <style jsx>{`
        li:hover {
          background-color: #f2f2f2;
        }

        .image-hover-container {
          position: relative;
          width: 320px;
          height: 180px;
          z-index: 2;
        }
        .image-hover-container .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          border-radius: 20px;
          transition: opacity 0.3s ease;
        }
        .image-hover-container:hover .image-overlay {
          opacity: 1;
          cursor: pointer;
        }

        .image-hover-container .overlay-text {
          color: white;
          font-size: 20px;
        }
        .playAllBtn {
          color: #000;
          background-color: #fff;
          padding: 8px 40px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }
        .playAllBtn:hover {
          background-color: rgba(255, 255, 255, 0.8);
        }
        .shuffleBtn {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
          padding: 8px 40px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }
        .shuffleBtn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .downloadAndDotsBtn {
          background-color: rgba(255, 255, 255, 0.1);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        }
        .downloadAndDotsBtn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
