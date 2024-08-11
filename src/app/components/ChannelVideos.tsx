import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import NoVideosImage from "../../app/components/static/no-videos.png";
import { Video } from "../types/types";
import { formatViewCount } from "../formulas/formatViewCount";
import { dateCalculation } from "../formulas/dateCalculation";
import { convertDuration } from "../formulas/formatDuration";

interface ChannelVideosProps {
  channelId: string | string[] | undefined;
  handleVideoClick: (video: Video) => void;
}

const ChannelVideos: React.FC<ChannelVideosProps> = ({
  channelId,
  handleVideoClick,
}) => {
  const apiUrl = "http://localhost:8080/api/youtube";
  const [orderVideo, setOrderVideo] = useState<string>("date");
  const [channelVideos, setChannelVideos] = useState<Video[] | null>(null);

  useEffect(() => {
    const fetchChannelVideos = async (order: string) => {
      try {
        const response = await axios.get(
          `${apiUrl}/channel-videos/${channelId}?order=${order}`
        );
        setChannelVideos(response.data.items);
      } catch (error) {
        console.error("Error fetching Youtube:", error);
      }
    };
    fetchChannelVideos(orderVideo);
  }, [channelId, orderVideo]);

  const isVideoIdObject = (
    id: string | { videoId: string }
  ): id is { videoId: string } => {
    return typeof id === "object" && id !== null && "videoId" in id;
  };

  return (
    <div style={{ marginTop: "30px" }}>
      {channelVideos && channelVideos.length > 0 ? (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {["date", "viewCount", "relevance"].map((type) => (
            <button
              key={type}
              style={{
                backgroundColor: orderVideo === type ? "#000" : "#f2f2f2",
                color: orderVideo === type ? "#fff" : "#000",
                border: "none",
                fontSize: "15px",
                padding: "10px 14px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={() => setOrderVideo(type)}
            >
              {type === "date"
                ? "Latest"
                : type === "viewCount"
                ? "Popular"
                : "Oldest"}
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "100px",
            marginBottom: "300px",
          }}
        >
          <Image src={NoVideosImage} alt="no-videos" width={160} height={160} />
          <p>This channel has no videos.</p>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {channelVideos?.map((video) => (
          <div
            key={isVideoIdObject(video.id) ? video.id.videoId : video.id} // Use video.id.videoId safely here
            style={{ cursor: "pointer", maxWidth: "300px" }}
            onClick={() => handleVideoClick(video)}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                width={310}
                height={180}
                style={{ borderRadius: "10px" }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "152px",
                  right: "9px",
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
            </div>
            <p style={{ fontWeight: 600 }}>{video.snippet.title}</p>
            <div
              style={{
                color: "#676767",
                fontSize: "13px",
                display: "flex",
                marginTop: "-14px",
                marginBottom: "15px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <span>{formatViewCount(video.statistics.viewCount)}</span>
              <svg
                xmlns="http:www.w3.org/2000/svg"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelVideos;
