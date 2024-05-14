import SectionImage from "./static/menu-of-three-lines.png";
import Logo from "./static/YouTube-Logo.wine.svg";
import SignInIcon from "./static/web.png";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
    publishTime: string;
    thumbnails: { medium: { height: number; url: string; width: number } };
  };
}

export default function Header() {
  const [videos, setVideos] = useState<Video[]>([]);

  return (
    <header>
      <div style={{ display: "flex" }}>
        <div className="section-div">
          <Image src={SectionImage} alt="Section icon" width={18} height={18} />
        </div>
        <div className="logo">
          <Image src={Logo} alt="Logo" width={120} height={36} priority />
        </div>
      </div>
      <SearchBar videos={videos} />
      <button className="sign-in">
        <Image src={SignInIcon} alt="sign-in" width={26} height={26} />
        <span>Sign in</span>
      </button>

      <style jsx>{`
        header {
          padding-right: 10px;
          display: flex;
          align-items: start;
          justify-content: space-between;
        }
        .section-div {
          border-radius: 50%;
          width: 30px;
          height: 30px;
          padding: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
        .section-div:hover {
          background-color: #e3e6e8;
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
      `}</style>
    </header>
  );
}
