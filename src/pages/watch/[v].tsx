import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import ReactPlayer from "react-player";
import Image from "next/image";
// import { Roboto } from "next/font/google";
import { formatSubscriberCount } from "@/app/formulas/formatSubscriberCount";
import Link from "next/link";
import {
  ChannelInfo,
  CommentThread,
  ExtendedVideo,
  Video,
} from "@/app/types/types";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { BiDislike, BiSolidBellRing } from "react-icons/bi";
import { formatLikeCount } from "@/app/formulas/formatLikeCount";
import { PiDotsThreeBold, PiShareFatLight } from "react-icons/pi";
import { LiaDownloadSolid } from "react-icons/lia";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import CommentSection from "@/app/components/CommentSection";
import RelativeVideos from "@/app/components/RelativeVideos";
import { useUser } from "@/app/context/UserContext";
import { useLogin } from "@/app/context/LoginContext";
import { IoIosArrowDown } from "react-icons/io";
import UnsubscribeICon from "@/app/components/static/unsubscribe.svg";

function formatDescription(description: string): string {
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
  const formattedDescription = description.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer"}>$1</a>'
  );
  return formattedDescription.replace(/\n/g, "<br>");
}

export function formatNumberWithCommas(number: number): string {
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

interface watchProps {
  // searchResults: Video[];
  searchResults: ExtendedVideo[];
}

export default function WatchPage({ searchResults }: watchProps) {
  const router = useRouter();
  const { v } = router.query;
  const apiKey = process.env.apiKey;
  // console.log(v);

  const { user } = useUser();
  const { loginData } = useLogin();

  const [videoInfo, setVideoInfo] = useState<Video | null>(null);
  // const [videoID, setVideoID] = useState<String | undefined>(undefined);
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [comments, setComments] = useState<CommentThread[]>([]);

  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [showSigninContainer, setShowSigninContainer] = useState(false);
  const signinContainerRef = useRef<HTMLDivElement>(null);

  const [unsubscribeContainer, setUnsubscribeContainer] = useState(false);
  const unsubscribeContainerRef = useRef<HTMLDivElement>(null);

  //
  // const [channelId, setChannelId] = useState<string | undefined>(undefined);
  const channelId = videoInfo?.snippet.channelId;
  // console.log("channelId", channelId);

  //
  console.log("logindata", loginData);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/youtube/videos/${v}?${apiKey}&part="snippet,statistics,player,contentDetails"`
        );
        setVideoInfo(response.data.items[0]);
      } catch (error) {
        console.error("Error searching YouTube:", error);
      }
    };
    if (v) {
      hydrate();
    }
  }, [apiKey, v]);

  // console.log("channelId", channelId);
  console.log("videoInfo", videoInfo);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/youtube/comments/${v}`
        );
        setComments(response.data.items);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    if (v) {
      fetchComments();
    }
  }, [v]);

  // console.log("comments ", comments);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/youtube/channels/${channelId}?${apiKey}&part="snippet,id,statistics,player,contentDetails"`
        );
        // console.log("response", response.data.items[0]);
        setChannelInfo(response.data.items[0]);
      } catch (error) {
        console.error("Error searching YouTube:", error);
      }
    };
    // fetchChannel();
    if (v && channelId) {
      fetchChannel();
    }
  }, [apiKey, channelId, v]);

  // console.log(formatSubscriberCount("10000000"));

  // useEffect(() => {
  //   if (v) {
  //     hydrate();
  //     fetchComments();
  //   }
  // }, [v]);

  // useEffect(() => {
  //   if (v && channelId) {
  //     fetchChannel();
  //   }
  // }, [v, channelId, fetchChannel]);

  // console.log("channelInfo", channelInfo);

  // if (!videoInfo) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    if (user && videoInfo) {
      const videoId =
        typeof videoInfo.id === "string" ? videoInfo.id : videoInfo.id.videoId;
      const isVideoLiked = user.likedVideos.some(
        (likedVideo) =>
          likedVideo.userID === loginData.userID && likedVideo.id === videoId
      );
      setIsLiked(isVideoLiked);
    }
  }, [user, videoInfo, loginData]);

  useEffect(() => {
    if (user && channelId) {
      const isChannelSubscribed = user.subscriptions.some(
        (subscribedChannel) =>
          subscribedChannel.userID === loginData.userID &&
          subscribedChannel.channelID === channelId
      );
      setIsSubscribed(isChannelSubscribed);
    }
  }, [channelId, loginData.userID, user]);
  console.log("isSubscribed", isSubscribed);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        signinContainerRef.current &&
        !signinContainerRef.current.contains(event.target as Node)
      ) {
        setShowSigninContainer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        unsubscribeContainerRef.current &&
        !unsubscribeContainerRef.current.contains(event.target as Node)
      ) {
        setUnsubscribeContainer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubscribe = async () => {
    if (loginData.userID !== "" && loginData.token !== "" && videoInfo) {
      try {
        const requestData = {
          userID: loginData.userID,
          channelID: channelId,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        };
        const response = await fetch("http://localhost:8080/subscriptions", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestData),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        setIsSubscribed(true);
        console.log("subscribe clicked", response);
      } catch (error) {
        console.error("Could not subscribe", error);
      }
    } else {
      setShowSigninContainer(true);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const requestData = {
        userID: loginData.userID,
        channelID: channelId,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      };
      const response = await fetch("http://localhost:8080/subscriptions", {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      setIsSubscribed(false);
      setUnsubscribeContainer(false);
      console.log("unsubscribe clicked", response);
    } catch (error) {
      console.error("Could not unsubscribe", error);
    }
  };

  const handleLikeVideo = async () => {
    if (loginData && videoInfo) {
      try {
        const requestData = {
          userID: loginData.userID,
          id: videoInfo.id,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        };

        const response = await fetch("http://localhost:8080/liked-videos", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestData),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        console.log("liked clicked", response);
      } catch (error) {
        console.error("Could not add video", error);
      }
      setIsLiked(true);
    }
  };

  const handleDislikeVideo = async () => {
    if (loginData && videoInfo) {
      try {
        const requestData = {
          userID: loginData.userID,
          id: videoInfo.id,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        };

        const response = await fetch("http://localhost:8080/liked-videos", {
          method: "DELETE",
          headers: headers,
          body: JSON.stringify(requestData),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        console.log("liked clicked", response);
      } catch (error) {
        console.error("Could not add video", error);
      }
      setIsLiked(false);
    }
  };

  const createEmbedHtml = (html: string) => {
    // Create a temporary element to parse the HTML
    const div = document.createElement("div");
    div.innerHTML = html;

    //   // Find the iframe element
    const iframe = div.querySelector("iframe");

    //   // Apply custom styles if iframe exists
    if (iframe) {
      iframe.style.width = "100%";
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
          <h2 style={{ fontSize: "20px" }}>{videoInfo.snippet.title}</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "100%",
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
                <Link href={`/channel/${channelId}`}>
                  <Image
                    src={channelInfo.snippet.thumbnails.medium.url}
                    alt="channel"
                    width={42}
                    height={42}
                  />
                </Link>
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
              <div style={{ position: "relative" }}>
                {!isSubscribed ? (
                  <button className="subscribe-btn" onClick={handleSubscribe}>
                    Subscribe
                  </button>
                ) : (
                  <button
                    className="subscribed-btn"
                    // onClick={handleUnsubscribe}
                    onClick={() => setUnsubscribeContainer(true)}
                  >
                    <BiSolidBellRing /> Subscribed <IoIosArrowDown />
                  </button>
                )}

                {showSigninContainer && (
                  <div
                    ref={signinContainerRef}
                    style={{
                      position: "absolute",
                      top: "-140px",
                      backgroundColor: "#fff",
                      color: "#000",
                      padding: "10px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                      width: "250px",
                      zIndex: 10,
                    }}
                  >
                    <p>Want to subscribe to this channel?</p>
                    <p style={{ color: "#676767" }}>
                      Sign in to subscribe to this channel.
                    </p>
                    <button className="signin-btn">
                      <Link
                        href={"/signin/identifier"}
                        style={{ textDecoration: "none", color: "#065fd4" }}
                      >
                        Sign in
                      </Link>
                    </button>
                  </div>
                )}

                {unsubscribeContainer && (
                  <div
                    ref={unsubscribeContainerRef}
                    style={{
                      position: "absolute",
                      top: "-60px",
                      backgroundColor: "#fff",
                      color: "#000",
                      // padding: "10px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
                      width: "250px",
                      zIndex: 10,
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={handleUnsubscribe}
                      className="unsubscribe-btn"
                    >
                      <Image
                        src={UnsubscribeICon}
                        alt="unsubscribe"
                        width={20}
                        height={20}
                      />{" "}
                      <p>Unsubscribe</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ display: "flex" }}>
                {isLiked ? (
                  <button className="like" onClick={handleDislikeVideo}>
                    <AiFillLike style={{ width: "21px", height: "21px" }} />
                    <span style={{ fontSize: "15px" }}>
                      {formatLikeCount(videoInfo.statistics.likeCount)}
                    </span>
                    <div className="vertical-line"></div>
                  </button>
                ) : (
                  <button className="like" onClick={handleLikeVideo}>
                    <AiOutlineLike style={{ width: "21px", height: "21px" }} />
                    <span style={{ fontSize: "15px" }}>
                      {formatLikeCount(videoInfo.statistics.likeCount)}
                    </span>
                    <div className="vertical-line"></div>
                  </button>
                )}

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
              maxWidth: "100%",
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

          <CommentSection comments={comments} videoInfo={videoInfo} />

          {/* <button onClick={() => handleChannelClick(channelId)}>click</button> */}
        </div>
      ) : null}
      <RelativeVideos
        searchResults={searchResults}
        videoId={v}
        videoInfo={videoInfo}
      />

      <style jsx>{`
        .container {
          // padding: 60px;
          margin-left: 130px;
          margin-top: 100px;
          display: grid;
          grid-template-columns: 65% 1fr;
          gap: 10px;
          padding-right: 50px;
        }

        .subscribe-btn {
          font-size: 15px;
          color: white;
          background-color: black;
          border: none;
          border-radius: 20px;
          padding: 10px 14px;
          cursor: pointer;
          margin-left: 10px;
        }
        .subscribe-btn:hover {
          opacity: 0.85;
        }
        .subscribed-btn {
          font-size: 15px;
          color: black;
          background-color: #f2f2f2;
          border: none;
          border-radius: 20px;
          padding: 10px 14px;
          cursor: pointer;
          margin-left: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .subscribed-btn:hover,
        .unsubscribe-btn:hover {
          background-color: #e5e5e5;
        }
        .unsubscribe-btn {
          color: black;
          background-color: #f2f2f2;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 15px;
          // padding: 10px 14px;
          padding: 6px;
          width: 100%;
        }
        .signin-btn {
          background-color: transparent;
          border: none;
          padding: 8px;
          border-radius: 20px;
          cursor: pointer;
        }
        .signin-btn:hover {
          background-color: #def1ff;
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
      `}</style>
    </div>
  );
}
