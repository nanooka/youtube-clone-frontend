import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { Roboto } from "next/font/google";
import { Video } from "..";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function WatchPage() {
  const router = useRouter();
  const { v } = router.query;
  const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";
  console.log(v);

  const [videoInfo, setVideoInfo] = useState<Video | null>(null);

  const hydrate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/videos/${v}?${apiKey}&part="snippet"`
      );
      setVideoInfo(response.data.items[0]);
      console.log(videoInfo);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };

  useEffect(() => {
    if (v) {
      hydrate();
    }
  }, [v]);

  if (!videoInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={roboto.className}>
      <div className="container">
        <p>hey</p>
        {/* <ReactPlayer url={`https:www.youtube.com/watch?v=${v}`} controls /> */}
        {videoInfo ? (
          <div>
            <div
              style={{
                display: "inline-block",
                borderRadius: "10px",
                overflow: "hidden",
                width: "70%",
                height: "70vh",
              }}
            >
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${v}`}
                controls
                // width={900}
                // height={500}
                width={"100%"}
                height={"100%"}
              />
            </div>
            <h2>{videoInfo.snippet.title}</h2>
            <div>
              <span>{videoInfo.snippet.channelTitle}</span>
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .container {
          padding: 60px;
        }
      `}</style>
    </div>
  );
}
