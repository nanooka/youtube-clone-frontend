import { useState } from "react";

export default function NavbarVideoTypes() {
  const [activeTab, setActiveTab] = useState<string>("All");
  return (
    <div>
      <nav
        style={{
          marginLeft: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {[
          "All",
          "Music",
          "Mixes",
          "Gaming",
          "Shorts",
          "Albums",
          "Live",
          "Recently uploaded",
          "Lyrics",
          "Watched",
          "Unwatched",
        ].map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="tab"
            style={{
              backgroundColor: activeTab === tab ? "black" : "",
              color: activeTab === tab ? "white" : "",
            }}
          >
            {tab}
          </span>
        ))}
      </nav>
      <style jsx>{`
        .tab {
          padding: 8px 12px;
          background-color: #f2f2f2;
          font-size: 15px;
          cursor: pointer;
          border-radius: 12px;
        }
        .tab:hover {
          background-color: #e5e5e5;
        }
      `}</style>
    </div>
  );
}
