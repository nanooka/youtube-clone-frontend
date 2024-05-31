import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChannelInfo } from "@/app/types/types";
import Image from "next/image";
import { formatSubscriberCount } from "@/app/formulas/formatSubscriberCount";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function ChannelPage() {
  const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";
  const router = useRouter();
  const channelId = router.query.channel;
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);

  const fetchChannel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/channels/${router.query.channel}?${apiKey}&part="snippet,id,statistics"`
      );
      //   console.log(response);
      setChannelInfo(response.data.items[0]);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };
  console.log(channelInfo);

  //   fetch();
  // }, [channelId]);

  useEffect(() => {
    if (channelId) {
      fetchChannel();
    }
  }, [channelId]);

  return (
    <div style={{ marginTop: "70px", marginLeft: "130px" }}>
      {channelInfo ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Image
            src={channelInfo?.brandingSettings.image.bannerExternalUrl}
            alt="banner-image"
            layout="responsive"
            width={1000}
            height={200}
            style={{
              objectFit: "cover",
              borderRadius: "15px",
              maxHeight: "200px",
              maxWidth: "90%",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "30px",
              alignItems: "flex-end",
            }}
          >
            <Image
              src={channelInfo?.snippet.thumbnails.medium.url}
              alt="channel-image"
              width={160}
              height={160}
              style={{ borderRadius: "50%" }}
            />
            <div>
              <h1>{channelInfo.brandingSettings.channel.title}</h1>
              <div
                style={{
                  color: "#676767",
                  fontSize: "15px",
                }}
              >
                <span>{channelInfo.snippet.customUrl}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="#676767"
                  className="bi bi-dot"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                </svg>
                <span>
                  {formatSubscriberCount(
                    channelInfo.statistics.subscriberCount
                  )}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="#676767"
                  className="bi bi-dot"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                </svg>
                <span>{channelInfo.statistics.videoCount} videos</span>
              </div>
              <div
                style={{
                  color: "#676767",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginTop: "14px",
                  marginBottom: "14px",
                }}
              >
                <span>More about this channel</span>
                <MdOutlineKeyboardArrowRight
                  style={{ width: "26px", height: "26px" }}
                />
              </div>
              <button className="subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>
      ) : null}
      <style jsx>{`
        .subscribe-btn {
          font-size: 15px;
          color: white;
          background-color: black;
          border: none;
          border-radius: 20px;
          padding: 10px 14px;
          cursor: pointer;
        }
        .subscribe-btn:hover {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
}
