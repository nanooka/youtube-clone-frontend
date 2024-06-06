import Image from "next/image";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { Video } from "@/app/types/types";
import NoVideosImage from "../../app/components/static/no-videos.png";

interface VideosContentProps {
  channelVideos: Video[] | null;
  orderVideo: string;
  setOrderVideo: (order: string) => void;
  handleVideoClick: (video: Video) => void;
}

const VideosContent: React.FC<VideosContentProps> = ({
  channelVideos,
  orderVideo,
  setOrderVideo,
  handleVideoClick,
}) => {
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
            key={video.id.videoId}
            style={{ cursor: "pointer" }}
            onClick={() => handleVideoClick(video)}
          >
            <Image
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              width={310}
              height={180}
              style={{ borderRadius: "10px" }}
            />
            <p style={{ fontWeight: 600 }}>{video.snippet.title}</p>
            <div
              style={{
                color: "#676767",
                fontSize: "13px",
                display: "flex",
                cursor: "pointer",
                width: "100%",
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosContent;
