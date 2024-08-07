import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Video } from "../types/types";
import { formatViewCount } from "../formulas/formatViewCount";
import { dateCalculation } from "../formulas/dateCalculation";
import Link from "next/link";

interface ChannelSearchedVideosProps {
  channelId: string | string[] | undefined;
  searchQuery: string | undefined;
  handleVideoClick: (video: Video) => void;
}

function isVideoIdObject(
  id: string | { videoId: string }
): id is { videoId: string } {
  return (id as { videoId: string }).videoId !== undefined;
}

const ChannelSearchedVideos: React.FC<ChannelSearchedVideosProps> = ({
  channelId,
  searchQuery,
  handleVideoClick,
}) => {
  const apiUrl = "http://localhost:5000/api/youtube";
  const [searchResult, setSearchResult] = useState<Video[] | null>(null);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/channel-search?query=${searchQuery}&channelId=${channelId}`
        );
        setSearchResult(response.data.items);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    handleSearch();
  }, [channelId, searchQuery]);

  // console.log("from channelSearch", searchResult);

  return (
    <div style={{ marginTop: "30px" }}>
      {searchResult?.map((video) => (
        <div
          key={isVideoIdObject(video.id) ? video.id.videoId : video.id}
          //   style={{ cursor: "pointer" }}
          style={{
            display: "flex",
            gap: "20px",
            borderBottom: "1px solid #e5e5e5",
            paddingBottom: "15px",
            marginBottom: "15px",
          }}
        >
          <div>
            <Image
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              width={310}
              height={180}
              style={{ borderRadius: "10px", cursor: "pointer" }}
              onClick={() => handleVideoClick(video)}
            />
          </div>
          <div>
            <p
              style={{ fontWeight: 600, marginTop: 0, cursor: "pointer" }}
              onClick={() => handleVideoClick(video)}
            >
              {video.snippet.title}
            </p>
            <div
              style={{
                color: "#676767",
                fontSize: "13px",
                display: "flex",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {/* <span>{formatViewCount(video.statistics.viewCount)}</span> */}
              <Link
                href={`/channel/${video.snippet.channelId}`}
                style={{ textDecoration: "none", color: "#676767" }}
              >
                <span>{video.snippet.channelTitle}</span>
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

              <span onClick={() => handleVideoClick(video)}>
                {dateCalculation(video.snippet.publishedAt)}
              </span>
            </div>
            <p
              style={{
                color: "#676767",
                fontSize: "13px",
                cursor: "pointer",
              }}
              onClick={() => handleVideoClick(video)}
            >
              {video.snippet.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChannelSearchedVideos;
