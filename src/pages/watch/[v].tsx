import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { Video } from "..";
import { formatSubscriberCount } from "@/app/formulas/formatSubscriberCount";
import Link from "next/link";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export interface ChannelInfo {
  snippet: {
    customUrl: string;
    thumbnails: { medium: { height: number; url: string; width: number } };
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
  // ...
}

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
        `http://localhost:3000/api/youtube/videos/${v}?${apiKey}&part="snippet"`
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
        `http://localhost:3000/api/youtube/channels/${channelId}?${apiKey}&part="snippet,id,statistics"`
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

  return (
    <div className={roboto.className}>
      <div className="container">
        <p>hey</p>
        {/* <ReactPlayer url={`https:www.youtube.com/watch?v=${v}`} controls /> */}
        {videoInfo && channelInfo ? (
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
