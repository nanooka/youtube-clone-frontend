import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ChannelInfo, Video } from "@/app/types/types";
import Image from "next/image";
import { formatSubscriberCount } from "@/app/formulas/formatSubscriberCount";
import { MdOutlineKeyboardArrowRight, MdPlaylistPlay } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IconContext } from "react-icons";
import ChannelVideos from "@/app/components/ChannelVideos";
import ChannelPlaylists from "@/app/components/ChannelPlaylists";
import ChannelLiveVideos from "@/app/components/ChannelLiveVideos";
import ChannelSearchedVideos from "@/app/components/ChannelSearchedVideos";
import { useLogin } from "@/app/context/LoginContext";
import { BiSolidBellRing } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import UnsubscribeICon from "@/app/components/static/unsubscribe.svg";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";

export default function ChannelPage() {
  const apiUrl = "http://localhost:5000/api/youtube";
  const apiKey = process.env.apiKey;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const channelId = router.query.channel;
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  // const [channelVideos, setChannelVideos] = useState<Video[] | null>(null);
  // const [searchResult, setSearchResult] = useState<Video | null>(null);
  const [searched, setSearched] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("Home");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSigninContainer, setShowSigninContainer] = useState(false);
  const signinContainerRef = useRef<HTMLDivElement>(null);

  const [unsubscribeContainer, setUnsubscribeContainer] = useState(false);
  const unsubscribeContainerRef = useRef<HTMLDivElement>(null);

  const searchIconRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { loginData } = useLogin();
  const { user } = useUser();

  useEffect(() => {
    if (isInputFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputFocused]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchIconRef.current &&
      !searchIconRef.current.contains(event.target as Node)
    ) {
      setIsInputFocused(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // const searchChannelVideos = async (query: string) => {
  //   try {
  //     const response = await axios.get(
  //       `${apiUrl}/channel-videos/${channelId}?query=${query}`
  //     );

  //     setChannelVideos(response.data.items);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  //
  // const handleSearch = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.get(
  //       `${apiUrl}/channel-search?query=${searchQuery}&channelId=${channelId}`
  //     );
  //     // setSearchResult(response.data.items);
  //     setSearched(true);
  //     setActiveTab("");
  //     // console.log("search  ", response.data.items);
  //   } catch (error) {
  //     console.error("Error fetching videos:", error);
  //   }
  // };
  // console.log("search results", searchResult);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setActiveTab("");
  };

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/channels/${channelId}?${apiKey}&part="snippet,id,statistics"`
        );
        setChannelInfo(response.data.items[0]);
      } catch (error) {
        console.error("Error searching YouTube:", error);
      }
    };

    fetchChannel();
  }, [channelId]);

  const handleVideoClick = (video: Video) => {
    router.push({
      pathname: `/watch/${video.id}`,
    });
  };

  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   searchChannelVideos(searchQuery);
  // };

  // console.log("searchQuery", searchQuery);

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
    if (loginData.userID !== "" && loginData.token !== "") {
      try {
        const requestData = {
          userID: loginData.userID,
          channelID: channelId,
        };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        };
        const response = await fetch("http://localhost:5000/subscriptions", {
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
      const response = await fetch("http://localhost:5000/subscriptions", {
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

  return (
    <div
      style={{ marginTop: "70px", marginLeft: "130px", marginRight: "100px" }}
    >
      {channelInfo ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Image
            src={channelInfo?.brandingSettings.image.bannerExternalUrl}
            alt="banner-image"
            layout="responsive"
            priority
            width={1000}
            height={200}
            style={{
              objectFit: "cover",
              borderRadius: "15px",
              maxHeight: "200px",
              maxWidth: "100%",
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
          </div>
        </div>
      ) : null}
      <div style={{ marginTop: "20px", borderBottom: "1px solid #e0e0e0" }}>
        <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {["Home", "Videos", "Shorts", "Live", "Playlists", "Community"].map(
            (tab) => (
              <span
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // setSearchResult(null);
                  setSearched(false);
                }}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  fontWeight: 600,
                  color: "#676767",
                  borderBottom:
                    activeTab === tab
                      ? "3px solid black"
                      : "3px solid transparent",
                }}
              >
                {tab}
              </span>
            )
          )}
          <div
            ref={searchIconRef}
            style={{ cursor: "pointer" }}
            onClick={() => setIsInputFocused(true)}
          >
            <IconContext.Provider value={{ color: "#676767", size: "24px" }}>
              <CiSearch
                style={{ cursor: "pointer", width: "24px", height: "24px" }}
              />
            </IconContext.Provider>
          </div>
          {isInputFocused && (
            <div
              ref={searchIconRef}
              className="search-input-container"
              style={{
                display: "flex",
                justifyContent: "center",
                // marginBottom: "20px",
              }}
            >
              <form
                // onSubmit={handleSearchSubmit}
                onSubmit={handleSearch}
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          )}
        </nav>
      </div>

      {activeTab === "Videos" ? (
        <ChannelVideos
          channelId={channelId}
          handleVideoClick={handleVideoClick}
        />
      ) : activeTab === "Playlists" ? (
        <ChannelPlaylists channelId={channelId} />
      ) : activeTab === "Live" ? (
        <ChannelLiveVideos
          channelId={channelId}
          handleVideoClick={handleVideoClick}
        />
      ) : null}

      {/* {searchResult ? <ChannelSearchedVideos /> : null} */}
      {searched ? (
        <ChannelSearchedVideos
          channelId={channelId}
          searchQuery={searchQuery}
          handleVideoClick={handleVideoClick}
        />
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
        .search-input:focus {
          outline: none;
          border-bottom: 2px solid black;
        }
        .search-input {
          border: none;
          padding: 5px 0;
          font-size: 15px;
          width: 100%;
          position: relative;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
