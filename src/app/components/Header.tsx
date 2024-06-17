import SectionImage from "./static/menu-of-three-lines.png";
import Logo from "./static/YouTube-Logo.wine.svg";
import SignInIcon from "./static/web.png";
import YouIcon from "./static/video-library.png";

import Image from "next/image";

import React from "react";
import SearchBar from "./SearchBar";
import { Video } from "../types/types";
import { MdOutlineSubscriptions } from "react-icons/md";
import Link from "next/link";
import { useLogin } from "../context/LoginContext";

interface Props {
  onSearchResults: (results: Video[]) => void;
  toggleSidebar: () => void;
}

export default function Header({ onSearchResults, toggleSidebar }: Props) {
  const { loginData } = useLogin();

  console.log("header", loginData);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const randomColor = getRandomColor();

  return (
    <div>
      <div
        // className="list"
        style={{
          width: "50px",
          height: "100vh",
          backgroundColor: "white",
          position: "fixed",
          top: "50px",
          // left: 0,
        }}
      >
        <ul>
          <li key="home">
            <Link
              href={"/"}
              style={{
                textDecoration: "none",
                color: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="21px"
                height="21px"
              >
                <path d="M 23.951172 4 A 1.50015 1.50015 0 0 0 23.072266 4.3222656 L 8.859375 15.519531 C 7.0554772 16.941163 6 19.113506 6 21.410156 L 6 40.5 C 6 41.863594 7.1364058 43 8.5 43 L 18.5 43 C 19.863594 43 21 41.863594 21 40.5 L 21 30.5 C 21 30.204955 21.204955 30 21.5 30 L 26.5 30 C 26.795045 30 27 30.204955 27 30.5 L 27 40.5 C 27 41.863594 28.136406 43 29.5 43 L 39.5 43 C 40.863594 43 42 41.863594 42 40.5 L 42 21.410156 C 42 19.113506 40.944523 16.941163 39.140625 15.519531 L 24.927734 4.3222656 A 1.50015 1.50015 0 0 0 23.951172 4 z M 24 7.4101562 L 37.285156 17.876953 C 38.369258 18.731322 39 20.030807 39 21.410156 L 39 40 L 30 40 L 30 30.5 C 30 28.585045 28.414955 27 26.5 27 L 21.5 27 C 19.585045 27 18 28.585045 18 30.5 L 18 40 L 9 40 L 9 21.410156 C 9 20.030807 9.6307412 18.731322 10.714844 17.876953 L 24 7.4101562 z" />
              </svg>

              <span>Home</span>
            </Link>
          </li>
          <li key="shorts">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="21px"
              height="21px"
            >
              <path d="M 15.886719 1 C 14.974131 1 14.077693 1.2286385 13.287109 1.65625 L 5.5664062 5.7207031 L 5.5664062 5.71875 C 3.7637541 6.6652034 2.6367187 8.5322799 2.6367188 10.566406 C 2.6367188 11.911504 3.2225585 13.082394 4.046875 14.046875 C 3.2161002 15.0216 2.6367187 16.195885 2.6367188 17.521484 C 2.6367188 20.532674 5.1018215 23 8.1132812 23 C 9.0303925 23 9.9287625 22.773103 10.716797 22.341797 L 18.292969 18.353516 L 18.259766 18.369141 C 20.151702 17.459981 21.363281 15.531898 21.363281 13.433594 C 21.363281 12.088496 20.777441 10.917606 19.953125 9.953125 C 20.783897 8.9783946 21.363281 7.8041153 21.363281 6.4785156 C 21.363281 3.4673258 18.898179 1 15.886719 1 z M 15.886719 3 C 17.813259 3 19.363281 4.5517054 19.363281 6.4785156 C 19.363281 7.5499776 18.888956 8.5222239 18.080078 9.1777344 L 17.121094 9.9550781 L 18.080078 10.732422 C 18.871608 11.373406 19.363281 12.344494 19.363281 13.433594 C 19.363281 14.75529 18.584642 15.993566 17.392578 16.566406 L 17.376953 16.574219 L 9.7636719 20.583984 L 9.7578125 20.587891 C 9.2778524 20.850605 8.6961702 21 8.1132812 21 C 6.1867412 21 4.6367188 19.448295 4.6367188 17.521484 C 4.6367188 16.450022 5.1110438 15.477776 5.9199219 14.822266 L 6.8789062 14.044922 L 5.9199219 13.267578 C 5.1283915 12.626594 4.6367188 11.655506 4.6367188 10.566406 C 4.6367188 9.266533 5.3427459 8.095781 6.4960938 7.4902344 L 6.4980469 7.4902344 L 14.232422 3.4179688 L 14.238281 3.4140625 C 14.729251 3.1482632 15.309951 3 15.886719 3 z M 10 9 L 10 15 L 15 12 L 10 9 z" />
            </svg>
            <span>Shorts</span>
          </li>
          <li key="subscriptions">
            <Link
              href={"/feed/subscriptions"}
              style={{
                textDecoration: "none",
                color: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <MdOutlineSubscriptions
                style={{ width: "21px", height: "21px" }}
              />

              <span>Subscriptions</span>
            </Link>
          </li>
          <li key="you">
            <Image src={YouIcon} alt="icon" />
            <span>You</span>
          </li>
        </ul>
      </div>

      <header>
        <div style={{ display: "flex" }}>
          <div>
            <div className="section-div" onClick={toggleSidebar}>
              <Image
                src={SectionImage}
                alt="Section icon"
                width={18}
                height={18}
              />
            </div>
          </div>
          {/* <button className="toggleButton" onClick={toggleSidebar}>
          <Image src={SectionImage} alt="Menu icon" width={18} height={18} />
        </button> */}
          <Link href="/">
            <div className="logo">
              <Image src={Logo} alt="Logo" width={120} height={36} priority />
            </div>
          </Link>
        </div>
        <SearchBar onSearchResults={onSearchResults} />

        {!loginData.token ? (
          <Link href={"/signin/identifier"} style={{ textDecoration: "none" }}>
            <button className="sign-in">
              <Image src={SignInIcon} alt="sign-in" width={26} height={26} />
              <span>Sign in</span>
            </button>
          </Link>
        ) : (
          <div
            style={{
              backgroundColor: randomColor,
              color: "#fff",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              marginRight: "40px",
              cursor: "pointer",
            }}
          >
            {/* {loginData?.email.split("")[0].toUpperCase()} */}N
          </div>
        )}
      </header>

      <style jsx>{`
        header {
          padding: 10px;
          // padding-right: 10px;
          // padding-bottom: 10px;
          display: flex;
          align-items: start;
          justify-content: space-between;
          background-color: white;
          position: fixed;
          top: 0;
          z-index: 1;
          width: 100%;
        }
        .section-div {
          border-radius: 50%;
          width: 30px;
          height: 30px;
          padding: 6px;
          // margin: 6px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .section-div:hover {
          background-color: #e5e5e5;
        }
        .logo {
          margin-top: 4px;
          cursor: pointer;
        }
        .sign-in {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #d2d4d6;
          border-radius: 30px;
          padding: 4px 12px;
          cursor: pointer;
          background-color: transparent;
          // width: 220px;
          margin-right: 40px;
        }
        .sign-in:hover {
          background-color: #def1ff;
          border: 1px solid #def1ff;
        }
        span {
          color: #3590ba;
          font-weight: 700;
          font-size: 14px;
        }
        ul {
          list-style: none;
          // margin: 0;
          margin-left: -45px;
          // width: 50px;
        }
        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          // margin-left: 0;
          padding: 15px 7px;
          width: 100%;
          border-radius: 12px;
          cursor: pointer;
        }
        li:hover {
          background-color: #f2f2f2;
        }

        ul li span {
          color: black;
          font-weight: 300;
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}
