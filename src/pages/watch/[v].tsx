import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
// import ReactPlayer from "react-player";
import Image from "next/image";
// import { Roboto } from "next/font/google";
import { formatSubscriberCount } from "@/app/formulas/formatSubscriberCount";
import Link from "next/link";
import { ChannelInfo, CommentThread, Video } from "@/app/types/types";
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike } from "react-icons/bi";
import { formatLikeCount } from "@/app/formulas/formatLikeCount";
import { PiDotsThreeBold, PiShareFatLight } from "react-icons/pi";
import { LiaDownloadSolid } from "react-icons/lia";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";

// const roboto = Roboto({
//   subsets: ["latin"],
//   weight: ["400", "500", "700"],
// });

// function formatDescription(description: string): string {
//   const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
//   return description.replace(
//     urlRegex,
//     '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
//   );
// }

function formatDescription(description: string): string {
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
  const formattedDescription = description.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  return formattedDescription.replace(/\n/g, "<br>");
}

function formatNumberWithCommas(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export default function WatchPage() {
  const router = useRouter();
  const { v } = router.query;
  const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";
  console.log(v);

  const [videoInfo, setVideoInfo] = useState<Video | null>(null);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comments, setComments] = useState<CommentThread[]>([]);

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

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/comments/${v}`
      );
      setComments(response.data.items);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  console.log("comments ", comments);

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
      fetchComments();
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

  const createEmbedHtml = (html: string) => {
    // Create a temporary element to parse the HTML
    const div = document.createElement("div");
    div.innerHTML = html;

    //   // Find the iframe element
    const iframe = div.querySelector("iframe");

    //   // Apply custom styles if iframe exists
    if (iframe) {
      iframe.style.width = "60%";
      iframe.style.height = "400px";
      iframe.style.borderRadius = "12px";
    }

    return div.innerHTML;
  };

  const truncatedDescription = (description: string): string => {
    const lines = description.split("\n");
    return lines.slice(0, 3).join("<br>");
  };

  return (
    <div className="container">
      {/* <ReactPlayer url={`https:www.youtube.com/watch?v=${v}`} controls /> */}
      {videoInfo && channelInfo ? (
        <div>
          {/* <div
            dangerouslySetInnerHTML={{
              __html: videoInfo.player.embedHtml || "",
            }}
            style={{ width: "100%", backgroundColor: "red" }}
          ></div> */}

          {/* <iframe
              width="70%"
              height="390"
              src="https://www.youtube.com/embed/YQHsXMglC9A?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3"
            ></iframe> */}

          <div
            className="video-container"
            dangerouslySetInnerHTML={{
              __html: createEmbedHtml(videoInfo.player.embedHtml || ""),
            }}
            // style={{ width: "100%", backgroundColor: "red" }}
          ></div>
          <h2>{videoInfo.snippet.title}</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "60%",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Link
                  href={`/channel/${channelId}`}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontSize: "14px",
                  }}
                >
                  {videoInfo.snippet.channelTitle}
                </Link>
                <span style={{ color: "#676767", fontSize: "12px" }}>
                  {formatSubscriberCount(
                    channelInfo.statistics.subscriberCount
                  )}
                </span>
              </div>
              <button className="subscribe-btn">Subscribe</button>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ display: "flex" }}>
                <button className="like">
                  <AiOutlineLike style={{ width: "21px", height: "21px" }} />
                  <span style={{ fontSize: "15px" }}>
                    {formatLikeCount(videoInfo.statistics.likeCount)}
                  </span>
                  <div className="vertical-line"></div>
                </button>
                <button className="dislike">
                  <BiDislike style={{ width: "21px", height: "21px" }} />
                </button>
              </div>
              <button className="share">
                <PiShareFatLight style={{ width: "21px", height: "21px" }} />
                <span style={{ fontSize: "15px" }}>Share</span>
              </button>
              <button className="download">
                <LiaDownloadSolid style={{ width: "21px", height: "21px" }} />
                <span style={{ fontSize: "15px" }}>Download</span>
              </button>
              <button className="dots">
                <PiDotsThreeBold style={{ width: "21px", height: "21px" }} />
              </button>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#f2f2f2",
              maxWidth: "58%",
              padding: "12px",
              borderRadius: "12px",
              marginTop: "14px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>
                {!showFullDescription
                  ? formatViewCount(videoInfo.statistics.viewCount)
                  : formatNumberWithCommas(+videoInfo.statistics.viewCount) +
                    " views"}
              </span>
              <span style={{ fontWeight: 600, fontSize: "14px" }}>
                {!showFullDescription
                  ? dateCalculation(videoInfo.snippet.publishedAt)
                  : formatDate(videoInfo.snippet.publishedAt)}
              </span>
            </div>
            <p
              style={{ fontSize: "15px", display: "inline" }}
              dangerouslySetInnerHTML={{
                __html: showFullDescription
                  ? formatDescription(videoInfo.snippet.description)
                  : formatDescription(
                      truncatedDescription(videoInfo.snippet.description)
                    ),
              }}
            ></p>
            <button
              // className="more-button"
              style={{
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
              }}
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "...Show less" : "...more"}
            </button>
          </div>

          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-author">
                <Image
                  src={
                    comment.snippet.topLevelComment.snippet
                      .authorProfileImageUrl
                  }
                  alt="author"
                  width={20}
                  height={20}
                />
                <span>
                  {comment.snippet.topLevelComment.snippet.authorDisplayName}
                </span>
              </div>
              <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
              <div className="comment-actions">
                <span className="like-count">
                  {comment.snippet.topLevelComment.snippet.likeCount}
                </span>
              </div>
            </div>
          ))}
          {/* <button onClick={() => handleChannelClick(channelId)}>click</button> */}
        </div>
      ) : null}

      <style jsx>{`
        .container {
          // padding: 60px;
          margin-left: 130px;
          margin-top: 100px;
        }

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
        .like,
        .dislike,
        .share,
        .download,
        .dots {
          border: none;
          backgroun-color: #f2f2f2;
          padding: 8px 14px;
          cursor: pointer;
        }
        .like:hover,
        .dislike:hover,
        .share:hover,
        .download:hover,
        .dots:hover {
          background-color: #e5e5e5;
        }
        .like {
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 20px 0 0 20px;
          position: relative;
        }
        .dislike {
          border-radius: 0 20px 20px 0;
          display: flex;
        }
        .vertical-line {
          width: 1.5px;
          height: 24px;
          background-color: #ccc;
          position: absolute;
          right: 0;
        }
        .share,
        .download,
        .dots {
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .comments-section {
          margin-top: 20px;
        }
        .comment {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }
        .comment-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .comment-author img {
          border-radius: 50%;
        }
        .comment-actions {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .like-count {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>
    </div>
  );
}
