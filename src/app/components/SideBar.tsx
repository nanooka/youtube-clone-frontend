// import { useState } from "react";
import Image from "next/image";
import Logo from "./static/YouTube-Logo.wine.svg";
import SectionImage from "./static/menu-of-three-lines.png";
import YourChannelIcon from "./static/user.png";

import {
  MdOutlineKeyboardArrowRight,
  MdOutlineSubscriptions,
  MdPlaylistPlay,
  MdSubscriptions,
  MdWatchLater,
} from "react-icons/md";
import { VscHistory } from "react-icons/vsc";
import { CiYoutube } from "react-icons/ci";
import { SlClock } from "react-icons/sl";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import { useLogin } from "../context/LoginContext";
import Subscriptions from "@/pages/feed/subscriptions";
import { useEffect, useState } from "react";
// import { ChannelInfo } from "../types/types";

interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface Channel {
  channelID: string;
  channelImage: string;
  channelTitle: string;
}

export default function SideBar({ isOpen, toggleSidebar }: SideBarProps) {
  const router = useRouter();
  const currentRoute = router.pathname;

  const { user } = useUser();
  const { loginData } = useLogin();
  const [channels, setChannels] = useState<Channel[]>([]);

  const isActive = (route: string) => currentRoute === route;

  useEffect(() => {
    if (user?.subscriptions) {
      const fetchChannels = async () => {
        const channelData = await Promise.all(
          user.subscriptions.map(
            async (subscription: { channelID: string }) => {
              const response = await fetch(
                `http://localhost:8080/api/youtube/channels/${subscription.channelID}`
              );
              const data = await response.json();
              const channelInfo = data.items[0]?.snippet;
              return {
                channelID: subscription.channelID,
                channelImage: channelInfo?.thumbnails?.medium?.url || "",
                channelTitle: channelInfo?.title || "Unknown Channel",
              };
            }
          )
        );
        setChannels(channelData);
      };

      fetchChannels();
    }
  }, [user]);

  console.log("from sidebar", channels);

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <nav>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="toggleButton section-div" onClick={toggleSidebar}>
              <Image
                src={SectionImage}
                alt="Section icon"
                width={18}
                height={18}
              />
            </div>

            <Link href="/">
              <div className="logo">
                <Image src={Logo} alt="Logo" width={120} height={36} priority />
              </div>
            </Link>
          </div>
          <ul>
            <Link
              href={"/"}
              style={{
                textDecoration: "none",
                color: "#000",
                // display: "flex",
                // alignItems: "center",
                // gap: "20px",
              }}
            >
              <li key="home" className={isActive("/") ? "active" : ""}>
                {isActive("/") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 15 L 14 15 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="21px"
                    height="21px"
                  >
                    <path d="M 23.951172 4 A 1.50005 1.50005 0 0 0 23.072266 4.3222656 L 8.859375 15.519531 C 7.0554772 16.941163 6 19.113506 6 21.410156 L 6 40.5 C 6 41.863594 7.1364058 43 8.5 43 L 18.5 43 C 19.863594 43 21 41.863594 21 40.5 L 21 30.5 C 21 30.204955 21.204955 30 21.5 30 L 26.5 30 C 26.795045 30 27 30.204955 27 30.5 L 27 40.5 C 27 41.863594 28.136406 43 29.5 43 L 39.5 43 C 40.863594 43 42 41.863594 42 40.5 L 42 21.410156 C 42 19.113506 40.944523 16.941163 39.140625 15.519531 L 24.927734 4.3222656 A 1.50005 1.50005 0 0 0 23.951172 4 z M 24 7.4101562 L 37.285156 17.876953 C 38.369258 18.731322 39 20.030807 39 21.410156 L 39 40 L 30 40 L 30 30.5 C 30 28.585045 28.414955 27 26.5 27 L 21.5 27 C 19.585045 27 18 28.585045 18 30.5 L 18 40 L 9 40 L 9 21.410156 C 9 20.030807 9.6307412 18.731322 10.714844 17.876953 L 24 7.4101562 z" />
                  </svg>
                )}

                <span>Home</span>
              </li>
            </Link>

            <Link
              href={"/shorts"}
              style={{
                textDecoration: "none",
                color: "#000",
                // display: "flex",
                // alignItems: "center",
                // gap: "20px",
              }}
            >
              <li key="shorts" className={isActive("/shorts") ? "active" : ""}>
                {isActive("/shorts") ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 16.75 1 C 16.02 1 15.329609 1.185625 14.724609 1.515625 L 5.2753906 6.4902344 C 3.9253906 7.2002344 3 8.62 3 10.25 C 3 12.345 4.520625 14.085547 6.515625 14.435547 L 5.3359375 14.955078 C 3.9509375 15.660078 3 17.095 3 18.75 C 3 21.095 4.905 23 7.25 23 C 7.985 23 8.6753906 22.814375 9.2753906 22.484375 L 18.589844 17.580078 C 20.014844 16.895078 21 15.435 21 13.75 C 21 11.655 19.479375 9.9144531 17.484375 9.5644531 L 18.664062 9.0449219 C 20.049063 8.3399219 21 6.905 21 5.25 C 21 2.905 19.095 1 16.75 1 z M 10 9 L 15 12 L 10 15 L 10 9 z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="21px"
                    height="21px"
                  >
                    <path d="M 15.886719 1 C 14.974131 1 14.077693 1.2286385 13.287109 1.65625 L 5.5664062 5.7207031 L 5.5664062 5.71875 C 3.7637541 6.6652034 2.6367187 8.5322799 2.6367188 10.566406 C 2.6367188 11.911504 3.2225585 13.082394 4.046875 14.046875 C 3.2161002 15.0216 2.6367187 16.195885 2.6367188 17.521484 C 2.6367188 20.532674 5.1018215 23 8.1132812 23 C 9.0303925 23 9.9287625 22.773103 10.716797 22.341797 L 18.292969 18.353516 L 18.259766 18.369141 C 20.151702 17.459981 21.363281 15.531898 21.363281 13.433594 C 21.363281 12.088496 20.777441 10.917606 19.953125 9.953125 C 20.783897 8.9783946 21.363281 7.8041153 21.363281 6.4785156 C 21.363281 3.4673258 18.898179 1 15.886719 1 z M 15.886719 3 C 17.813259 3 19.363281 4.5517054 19.363281 6.4785156 C 19.363281 7.5499776 18.888956 8.5222239 18.080078 9.1777344 L 17.121094 9.9550781 L 18.080078 10.732422 C 18.871608 11.373406 19.363281 12.344494 19.363281 13.433594 C 19.363281 14.75529 18.584642 15.993566 17.392578 16.566406 L 17.376953 16.574219 L 9.7636719 20.583984 L 9.7578125 20.587891 C 9.2778524 20.850605 8.6961702 21 8.1132812 21 C 6.1867412 21 4.6367188 19.448295 4.6367188 17.521484 C 4.6367188 16.450022 5.1110438 15.477776 5.9199219 14.822266 L 6.8789062 14.044922 L 5.9199219 13.267578 C 5.1283915 12.626594 4.6367188 11.655506 4.6367188 10.566406 C 4.6367188 9.266533 5.3427459 8.095781 6.4960938 7.4902344 L 6.4980469 7.4902344 L 14.232422 3.4179688 L 14.238281 3.4140625 C 14.729251 3.1482632 15.309951 3 15.886719 3 z M 10 9 L 10 15 L 15 12 L 10 9 z" />
                  </svg>
                )}

                <span>Shorts</span>
              </li>
            </Link>
            <Link
              href={"/feed/subscriptions"}
              style={{
                textDecoration: "none",
                color: "#000",
                // display: "flex",
                // alignItems: "center",
                // gap: "20px",
              }}
            >
              <li
                key="subscriptions"
                className={isActive("/feed/subscriptions") ? "active" : ""}
              >
                {isActive("/feed/subscriptions") ? (
                  <MdSubscriptions style={{ width: "21px", height: "21px" }} />
                ) : (
                  <MdOutlineSubscriptions
                    style={{ width: "21px", height: "21px" }}
                  />
                )}
                <span>Subscriptions</span>
              </li>
            </Link>
            {/* Add more items here */}
          </ul>
          <hr
            style={{
              width: "180px",
              marginLeft: 0,
              marginTop: "16px",
              opacity: 0.3,
            }}
          ></hr>
          <ul style={{ marginTop: 0 }}>
            <li
              style={{ display: "flex", gap: 2, alignItems: "center" }}
              key="you"
            >
              <span style={{ fontSize: "15px", fontWeight: "600" }}>You</span>
              <MdOutlineKeyboardArrowRight
                style={{ width: "24px", height: "24px", opacity: 0.5 }}
              />
            </li>
            <li key="your-channel">
              <div
                style={{
                  // width: "21px",
                  // height: "21px",
                  border: "1px solid black",
                  display: "flex",
                }}
              >
                <Image
                  src={YourChannelIcon}
                  alt="icon"
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                />
              </div>
              <span>Your channel</span>
            </li>
            <li key="history" className={isActive("/history") ? "active" : ""}>
              <VscHistory style={{ width: "21px", height: "21px" }} />
              <span>History</span>
            </li>
            <li
              key="playlists"
              className={isActive("/playlists") ? "active" : ""}
            >
              <MdPlaylistPlay style={{ width: "21px", height: "21px" }} />
              <span>Playlists</span>
            </li>
            <li
              key="your-videos"
              className={isActive("/your-videos") ? "active" : ""}
            >
              <CiYoutube style={{ width: "21px", height: "21px" }} />
              <span>Your videos</span>
            </li>

            <Link
              href={"/playlist/WL"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <li
                key="watch-later"
                className={isActive("/playlist/WL") ? "active" : ""}
              >
                {isActive("/playlist/WL") ? (
                  <MdWatchLater style={{ width: "21px", height: "21px" }} />
                ) : (
                  <SlClock style={{ width: "21px", height: "21px" }} />
                )}

                <span>Watch later</span>
              </li>
            </Link>

            <Link
              href={"/playlist/LL"}
              style={{ textDecoration: "none", color: "#000" }}
            >
              <li
                key="liked-videos"
                className={isActive("/playlist/LL") ? "active" : ""}
              >
                {isActive("/playlist/LL") ? (
                  <AiFillLike style={{ width: "21px", height: "21px" }} />
                ) : (
                  <AiOutlineLike style={{ width: "21px", height: "21px" }} />
                )}

                <span>Liked videos</span>
              </li>
            </Link>
          </ul>
          <hr
            style={{
              width: "180px",
              marginLeft: 0,
              marginTop: "16px",
              opacity: 0.3,
            }}
          ></hr>

          {loginData.token && (
            <div>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginLeft: "8px",
                }}
              >
                Subscriptions
              </span>
              <ul>
                {channels?.map((channel) => (
                  <Link
                    href={`/channel/${channel.channelID}`}
                    key={channel.channelID}
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <li key={channel.channelID}>
                      <Image
                        src={channel.channelImage}
                        alt="channel-image"
                        width={30}
                        height={30}
                        style={{ borderRadius: "50%" }}
                      />
                      <span>{channel.channelTitle}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </nav>
        <style jsx>{`
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 200px;
            background-color: white;
            color: black;
            transform: translateX(-100%);
            // transition: transform 0.3s ease;
            z-index: 3;
            padding: 10px;
            padding-left: 20px;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          // .toggleButton {
          //   position: fixed;
          //   top: 20px;
          //   left: 20px;
          //   // background-color: #111;
          //   // color: white;
          //   border: none;
          //   padding: 10px 20px;
          //   cursor: pointer;
          //   z-index: 4;
          // }

          .section-div {
            border-radius: 50%;
            border: none;
            background-color: white;
            width: 30px;
            height: 30px;
            padding: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            // margin-left: 10px;
          }
          .section-div:hover {
            background-color: #e5e5e5;
          }

          .sidebar nav ul {
            list-style: none;
            padding: 0;
            // margin: 0;
          }

          .sidebar nav ul li {
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 20px;
            border-radius: 10px;
            max-width: 180px;
            cursor: pointer;
          }
          .sidebar nav ul li:hover {
            background-color: #f2f2f2;
          }
          .sidebar nav ul li.active {
            background-color: #f2f2f2;
          }

          .sidebar nav ul li span {
            font-size: 14px;
          }
          .logo {
            margin-top: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </>
  );
}
