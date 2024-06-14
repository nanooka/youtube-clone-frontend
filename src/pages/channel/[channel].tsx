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

export default function ChannelPage() {
  const apiUrl = "http://localhost:3000/api/youtube";
  const apiKey = "AIzaSyB9Y0VMkev57rkase2o37r_xJOceqga-h0";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const channelId = router.query.channel;
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  // const [channelVideos, setChannelVideos] = useState<Video[] | null>(null);
  // const [searchResult, setSearchResult] = useState<Video | null>(null);
  const [searched, setSearched] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("Home");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const searchIconRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

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
