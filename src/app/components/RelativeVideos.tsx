import { dateCalculation } from "../formulas/dateCalculation";
import { formatViewCount } from "../formulas/formatViewCount";
import { ExtendedVideo, Video } from "../types/types";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";

import axios from "axios";
import { useEffect, useState } from "react";

const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";

interface RelativeVideoProps {
  // searchResults: Video[];
  searchResults: ExtendedVideo[];
  videoId: string | string[] | undefined;
  videoInfo: Video | null;
}

export default function RelativeVideos({
  searchResults,
  videoId,
  videoInfo,
}: RelativeVideoProps) {
  console.log("relative", searchResults);

  // const router = useRouter();

  const [relativeVideos, setRelativeVideos] = useState<ExtendedVideo[]>([]);

  // const [searchQuery, setSearchQuery] = useState("");

  const hydrate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/search?query=${videoInfo?.snippet.channelTitle}`
      );
      // console.log("relativeeeeeeeeeeee", response.data.items);
      setRelativeVideos(response.data.items);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };
  useEffect(() => {
    hydrate();
  }, []);

  const fetchVideoInfo = async (videoId: string | string[]) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/videos/${videoId}?${apiKey}&part=snippet,statistics,player,contentDetails`
      );
      console.log(" asasasasas", response.data.items[0]);
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  };
  if (videoId) {
    fetchVideoInfo(videoId);
  }

  // const handleVideoClick = (video: ExtendedVideo) => {
  //   router.push({
  //     pathname: `/watch/${video.id.videoId}`,
  //   });
  // };

  console.log("relative videdos", relativeVideos);

  return (
    <>
      <ul>
        {relativeVideos
          ? relativeVideos.map((video) => (
              <li key={video.id.videoId} style={{ listStyle: "none" }}>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <Link href={`/watch/${video.id.videoId}`}>
                    <Image
                      src={video.snippet.thumbnails.medium.url}
                      alt="video-image"
                      width={200}
                      height={120}
                      style={{ borderRadius: "10px", cursor: "pointer" }}
                      // onClick={() => handleVideoClick}
                    />
                  </Link>
                  <div>
                    <Link
                      href={`/watch/${video.id.videoId}`}
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
                    <Link
                      href={`/channel/${video.snippet.channelId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ color: "#676767", fontSize: "12px" }}>
                        {video.snippet.channelTitle}
                      </span>
                    </Link>
                    <div
                      style={{
                        color: "#676767",
                        fontSize: "13px",
                        display: "flex",
                        //   marginTop: "-14px",
                        //   marginBottom: "15px",
                        cursor: "pointer",
                        // width: "100%",
                        // backgroundColor: "red",
                      }}
                    >
                      {/* <span>{formatViewCount(video.statistics.viewCount)}</span> */}
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#676767"
                        className="bi bi-dot"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                      </svg> */}
                      <Link
                        href={`/watch/${video.id.videoId}`}
                        style={{
                          textDecoration: "none",
                          color: "#676767",
                          marginTop: "16px",
                        }}
                      >
                        <span>
                          {dateCalculation(video.snippet.publishedAt)}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))
          : null}
      </ul>
    </>
  );
}
