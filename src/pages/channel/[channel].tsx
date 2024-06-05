import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ChannelInfo, Playlist, Video } from "@/app/types/types";
import Image from "next/image";
import { formatSubscriberCount } from "@/app/formulas/formatSubscriberCount";
import { MdOutlineKeyboardArrowRight, MdPlaylistPlay } from "react-icons/md";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { CiSearch } from "react-icons/ci";
import { IconContext } from "react-icons";
import { IoMdPlay } from "react-icons/io";
import NoVideosImage from "../../app/components/static/no-videos.png";

export default function ChannelPage() {
  const apiUrl = "http://localhost:3000/api/youtube";
  const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderVideo, setOrderVideo] = useState<string>("date");
  const [orderLiveVideo, setOrderLiveVideo] = useState<string>("date");
  const router = useRouter();
  const channelId = router.query.channel;
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [channelVideos, setChannelVideos] = useState<Video[] | null>(null);
  const [channelPlaylists, setChannelPlaylists] = useState<Playlist[] | null>(
    null
  );
  const [channelLivevideos, setChannelLiveVideos] = useState<Video[] | null>(
    null
  );
  const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("Home");
  // const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchIconRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  console.log(channelPlaylists);

  useEffect(() => {
    if (isInputFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputFocused]);

  console.log(
    // "isSearchClicked",
    // isSearchClicked,
    "isInputFocused",
    isInputFocused
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchIconRef.current &&
      !searchIconRef.current.contains(event.target as Node)
    ) {
      setIsInputFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const fetchChannel = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/channels/${router.query.channel}?${apiKey}&part="snippet,id,statistics"`
      );
      //   console.log(response);
      setChannelInfo(response.data.items[0]);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };

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
  // console.log(channelInfo);
  console.log(channelVideos);

  const fetchChannelPlaylists = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/channel-playlists/${channelId}`
      );
      setChannelPlaylists(response.data.items);
    } catch (error) {
      console.error("Error fetching YouTube playlists:", error);
    }
  };

  const fetchChannelLiveVideos = async (order: string) => {
    try {
      const response = await axios.get(
        `${apiUrl}/channel-live/${channelId}?order=${order}`
      );
      setChannelLiveVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching Youtube Live videos:", error);
    }
  };

  const searchChannelVideos = async (query: string) => {
    try {
      const response = await axios.get(
        `http:localhost:3000/api/youtube/channel-videos/${channelId}?query=${query}`
      );

      setChannelVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (channelId && activeTab === "Playlists") {
      fetchChannelPlaylists();
    }
  }, [channelId, activeTab]);

  useEffect(() => {
    if (channelId && activeTab === "Videos") {
      fetchChannelVideos(orderVideo);
    }
  }, [channelId, orderVideo, activeTab]);

  useEffect(() => {
    if (channelId && activeTab === "Live") {
      fetchChannelLiveVideos(orderLiveVideo);
    }
  }, [channelId, orderLiveVideo, activeTab]);

  console.log("live videos", channelLivevideos);

  //   fetch();
  // }, [channelId]);

  useEffect(() => {
    if (channelId) {
      fetchChannel();
    }
  }, [channelId]);

  const handleVideoClick = (video: Video) => {
    // console.log("video", video);
    router.push({
      pathname: `/watch/${video.id}`,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchChannelVideos(searchQuery);
  };

  console.log("searchQuery", searchQuery);

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <div>Home Content</div>;
      case "Videos":
        return (
          <div style={{ marginTop: "30px" }}>
            {channelVideos && channelVideos.length > 0 ? (
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
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
                <Image
                  src={NoVideosImage}
                  alt="no-videos"
                  width={160}
                  height={160}
                />
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
                      // marginTop: "-14px",
                      // marginBottom: "15px",
                      cursor: "pointer",
                      width: "100%",
                      // backgroundColor: "red",
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
      case "Shorts":
        return <div>Shorts Content</div>;
      case "Live":
        return (
          <div style={{ marginTop: "30px" }}>
            {/* <h2>Latest Videos</h2> */}
            {channelLivevideos && channelLivevideos.length > 0 ? (
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                {["date", "viewCount", "relevance"].map((type) => (
                  <button
                    key={type}
                    style={{
                      backgroundColor:
                        orderLiveVideo === type ? "#000" : "#f2f2f2",
                      color: orderLiveVideo === type ? "#fff" : "#000",
                      border: "none",
                      fontSize: "15px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => setOrderLiveVideo(type)}
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
                <Image
                  src={NoVideosImage}
                  alt="no-videos"
                  width={160}
                  height={160}
                />
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
              {channelLivevideos?.map((video) => (
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
                      // marginTop: "-14px",
                      // marginBottom: "15px",
                      cursor: "pointer",
                      width: "100%",
                      // backgroundColor: "red",
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
      case "Playlists":
        return (
          <div style={{ marginTop: "30px" }}>
            <p>Created playlists</p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "40px",
              }}
            >
              {channelPlaylists?.map((playlist) => (
                <div
                  key={playlist.id}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredPlaylist(playlist.id)}
                  onMouseLeave={() => setHoveredPlaylist(null)}
                >
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        backgroundColor: "rgba(200,200,200,0.5)",
                        borderRadius: "100px 100px 0 0",
                        width: "210px",
                        height: "5px",
                        position: "absolute",
                        bottom: "1px",
                        left: "10px",
                      }}
                    ></div>

                    <Image
                      src={playlist.snippet.thumbnails.medium.url}
                      alt={playlist.snippet.title}
                      width={210}
                      height={5}
                      style={{
                        marginLeft: "10px",
                        marginBottom: "-3px",
                        borderRadius: "100px 100px 0 0",
                      }}
                    />
                  </div>
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <Image
                      src={playlist.snippet.thumbnails.medium.url}
                      alt={playlist.snippet.title}
                      width={230}
                      height={130}
                      style={{ borderRadius: "10px" }}
                    />
                    <div
                      style={{
                        backgroundColor: "rgba(0,0,0, 0.5)",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        color: "#fff",
                        fontSize: "13px",
                        position: "absolute",
                        top: "100px",
                        right: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MdPlaylistPlay
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span>{playlist.contentDetails.itemCount} videos</span>
                    </div>
                    {hoveredPlaylist === playlist.id && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          height: "130px",
                        }}
                      >
                        <IoMdPlay style={{ width: "20px", height: "20px" }} />
                        PLAY ALL
                      </div>
                    )}
                  </div>
                  <p style={{ fontWeight: 600 }}>{playlist.snippet.title}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "Community":
        return <div>Community</div>;
      default:
        return <div>Home Content</div>;
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
              <button className="subscribe-btn">Subscribe</button>
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
                onClick={() => setActiveTab(tab)}
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
                // ref={searchIconRef}
                style={{ cursor: "pointer", width: "24px", height: "24px" }}
                // onClick={() => setIsSearchClicked(true)}
                // onClick={() => setIsInputFocused(true)}
              />
            </IconContext.Provider>
          </div>
          {isInputFocused && (
            <div
              ref={searchIconRef}
              // className={`search-input-container ${
              //   isInputFocused ? "focused" : ""
              // }`}
              className="search-input-container"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <form
                onSubmit={handleSearchSubmit}
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
                  // style={{
                  //   padding: "10px",
                  //   borderRadius: "20px",
                  //   border: "1px solid #ccc",
                  //   outline: "none",
                  //   width: isInputFocused ? "200px" : "150px",
                  //   transition: "width 0.3s",
                  // }}
                  // onFocus={() => setIsInputFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  // onFocus={() => setIsInputFocused(true)}
                  // onBlur={() => setIsInputFocused(false)}
                />
              </form>
            </div>
          )}
        </nav>
      </div>

      <div style={{ marginTop: "20px" }}>{renderContent()}</div>

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
