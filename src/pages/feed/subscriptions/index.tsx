import { useUser } from "@/app/context/UserContext";
import { useLogin } from "@/app/context/LoginContext";
import { MdOutlineSubscriptions, MdOutlineWatchLater } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import SignInIcon from "@/app/components/static/web.png";
import { useEffect, useState } from "react";
import { ExtendedVideo, Video } from "@/app/types/types";
import axios from "axios";
import { useRouter } from "next/router";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { convertDuration } from "@/app/formulas/formatDuration";

const apiKey = process.env.apiKey;

const fetchChannelInfo = async (channelId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/youtube/channels/${channelId}?key=${apiKey}&part=snippet`
    );
    console.log("Channel Info Response:", response.data);
    return response.data.items[0];
  } catch (error) {
    console.error("Error fetching channel info:", error);
    return null;
  }
};

const fetchVideoInfo = async (videoId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/youtube/videos/${videoId}?key=${apiKey}&part=snippet,statistics,player,contentDetails`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching video info:", error);
    return null;
  }
};

const isVideoIdObject = (
  id: string | { videoId: string }
): id is { videoId: string } => {
  return typeof id !== "string";
};

export default function Subscriptions() {
  const { user } = useUser();
  const { loginData } = useLogin();
  const [videos, setVideos] = useState<ExtendedVideo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptionVideos = async () => {
      if (user && user.subscriptions.length > 0) {
        try {
          const allVideos = await Promise.all(
            user.subscriptions.map(async (sub) => {
              const response = await axios.get<{ items: Video[] }>(
                `http://localhost:5000/api/youtube/channel-videos/${sub.channelID}`
              );
              return response.data.items;
            })
          );
          const flattenedVideos = allVideos.flat();

          const updatedVideos = await Promise.all(
            flattenedVideos.map(async (video) => {
              const [channelInfo, videoInfo] = await Promise.all([
                fetchChannelInfo(video.snippet.channelId),
                fetchVideoInfo(
                  isVideoIdObject(video.id) ? video.id.videoId : video.id
                ),
              ]);
              return {
                ...video,
                ...videoInfo,
                channelImageUrl:
                  channelInfo?.snippet?.thumbnails?.default?.url || "",
              };
            })
          );
          setVideos(updatedVideos);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      }
    };
    fetchSubscriptionVideos();
  }, [user]);

  console.log(videos);

  const handleVideoClick = (video: ExtendedVideo) => {
    router.push({
      pathname: `/watch/${video.id}`,
    });
  };

  return (
    <div style={{ marginLeft: "120px", marginTop: "120px" }}>
      {loginData.token === "" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MdOutlineSubscriptions style={{ width: "130px", height: "130px" }} />
          <h2>Don’t miss new videos</h2>
          <p>Sign in to see updates from your favorite YouTube channels</p>
          <Link href={"/signin/identifier"} style={{ textDecoration: "none" }}>
            <button className="sign-in">
              <Image src={SignInIcon} alt="sign-in" width={26} height={26} />
              <span>Sign in</span>
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "20px",
          }}
        >
          {videos.map((video) => (
            <div
              key={typeof video.id === "string" ? video.id : video.id.videoId}
              style={{
                cursor: "pointer",
                maxWidth: "400px",
                marginBottom: "5px",
              }}
              onClick={() => handleVideoClick(video)}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <div className="video-image">
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    width={390}
                    height={210}
                  />
                  <div className="watch-later-btn">
                    <MdOutlineWatchLater
                      style={{ width: "21px", height: "21px" }}
                    />
                  </div>
                </div>

                <span
                  style={{
                    position: "absolute",
                    bottom: "10px",
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
              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <div>
                  <Image
                    src={video.channelImageUrl || "/default-channel-image.png"}
                    alt="channel"
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: 600 }}>{video.snippet.title}</p>
                  <p
                    style={{
                      color: "#676767",
                      fontSize: "13px",
                      marginTop: "-10px",
                      marginBottom: "2px",
                    }}
                  >
                    {video.snippet.channelTitle}
                  </p>
                  <div
                    style={{
                      color: "#676767",
                      fontSize: "15px",
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
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .sign-in {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #d2d4d6;
          border-radius: 30px;
          padding: 4px 12px;
          cursor: pointer;
          background-color: transparent;
          // width: 220px;
          margin-right: 40px;
        }
        .sign-in:hover {
          background-color: #def1ff;
          border: 1px solid #def1ff;
        }
        .video-image {
          border-radius: 10px;
          overflow: hidden;
          height: 210px;
        }
        .video-image:hover .watch-later-btn {
          display: block;
        }
        .watch-later-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.65);
          font-size: 12px;
          padding: 1px 3px;
          border-radius: 4px;
          display: none;
        }
      `}</style>
    </div>
  );
}
