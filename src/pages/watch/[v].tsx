import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { formatSubscriberCount } from "@/app/formulas/formatSubscriberCount";
import Link from "next/link";
import { ChannelInfo, Video } from "@/app/types/types";

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
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);

  //
  // const [channelId, setChannelId] = useState<string | undefined>(undefined);
  const channelId = videoInfo?.snippet.channelId;
  // console.log("channelId", channelId);

  //

  const hydrate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/videos/${v}?${apiKey}&part="snippet,statistics,player,contentDetails"`
      );
      setVideoInfo(response.data.items[0]);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };
  console.log("channelId", channelId);
  console.log("videoInfo", videoInfo);

  // useEffect(() => {
  const fetchChannel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/channels/${channelId}?${apiKey}&part="snippet,id,statistics,player,contentDetails"`
      );
      // console.log("response", response.data.items[0]);
      setChannelInfo(response.data.items[0]);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };
  //   fetch();
  // }, [channelId]);

  console.log(formatSubscriberCount("10000000"));

  useEffect(() => {
    if (v) {
      hydrate();
    }
  }, [v]);

  useEffect(() => {
    if (v && channelId) {
      fetchChannel();
    }
  }, [v, channelId]);

  console.log("channelInfo", channelInfo);

  if (!videoInfo) {
    return <div>Loading...</div>;
  }

  // console.log(channelInfo?.snippet.thumbnails.medium.url);

  const handleChannelClick = (channelId: string | undefined) => {
    router.push({
      pathname: `/channel/${channelId}`,
    });
  };

  // const createEmbedHtml = (html: string) => {
  //   // Create a temporary element to parse the HTML
  //   const div = document.createElement("div");
  //   div.innerHTML = html;

  //   // Find the iframe element
  //   const iframe = div.querySelector("iframe");

  //   // Apply custom styles if iframe exists
  //   if (iframe) {
  //     iframe.style.width = "70%";
  //     iframe.style.height = "400px";
  //   }

  //   return div.innerHTML;
  // };

  return (
    <div className={roboto.className}>
      <div className="container">
        <p>hey</p>
        {/* <ReactPlayer url={`https:www.youtube.com/watch?v=${v}`} controls /> */}
        {videoInfo && channelInfo ? (
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html: videoInfo.player.embedHtml || "",
              }}
              style={{ width: "100%", backgroundColor: "red" }}
            ></div>

            {/* <iframe
              width="70%"
              height="390"
              src="https://www.youtube.com/embed/YQHsXMglC9A?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3"
            ></iframe> */}

            {/* <div
              className="video-container"
              dangerouslySetInnerHTML={{
                __html: createEmbedHtml(videoInfo.player.embedHtml || ""),
              }}
            ></div> */}
            <h2>{videoInfo.snippet.title}</h2>
            <div>
              <div
                style={{
                  borderRadius: "50%",
                  overflow: "hidden",
                  width: "42px",
                  height: "42px",
                }}
              >
                <Image
                  src={channelInfo.snippet.thumbnails.medium.url}
                  alt="channel"
                  width={42}
                  height={42}
                />
              </div>
              <Link href={`/channel/${channelId}`}>
                {videoInfo.snippet.channelTitle}
              </Link>
              {/* <span>{videoInfo.snippet.channelTitle}</span> */}
              <span>
                {formatSubscriberCount(channelInfo.statistics.subscriberCount)}
              </span>
            </div>
            {/* <button onClick={() => handleChannelClick(channelId)}>click</button> */}
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
