// import React from "react";
// import axios from "axios";
// // import ReactPlayer from "react-player";
// // import CustomYouTubePlayer from "../app/CustomYouTubePlayer";
// // import CustomYouTubePlayer from "@/app/components/CustomYouTubePlayer";
// // import ReactPlayer from "react-player";
// import Image from "next/image";

// interface Video {
//   id: {
//     videoId: string;
//   };
//   snippet: {
//     title: string;
//     channelTitle: string;
//     description: string;
//     publishTime: string;
//     thumbnails: { medium: { height: number; url: string; width: number } };
//   };
// }

// interface Props {
//   videos: Video[]; // Define the videos prop
// }

// export default function SearchBar({ videos }: Props) {
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [searchResults, setSearchResults] = React.useState<Video[]>(videos);

//   const hydrate = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:3000/api/youtube/search?query=${encodeURIComponent(
//           searchQuery
//         )}`
//       );
//       setSearchResults(response.data.items as Video[]);
//     } catch (error) {
//       console.error("Error searching YouTube:", error);
//     }
//   };
//   console.log(searchResults);

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     hydrate();
//   };

//   return (
//     <div>
//       <form
//         onSubmit={handleSearch}
//         style={{ position: "relative", marginTop: "4px", display: "flex" }}
//       >
//         <input
//           type="text"
//           value={searchQuery}
//           placeholder="Search"
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button type="submit" className="search-btn">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             fill="#575859"
//             className="bi bi-search"
//             viewBox="0 0 16 16"
//           >
//             <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
//           </svg>
//         </button>
//       </form>

//       <ul
//         style={{
//           listStyleType: "none",
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)",
//         }}
//       >
//         {searchResults &&
//           searchResults.map((video) => (
//             <li
//               key={video.id.videoId}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "start",
//                 textAlign: "start",
//               }}
//             >
//               <button
//                 style={{
//                   border: "none",
//                   backgroundColor: "transparent",
//                   cursor: "pointer",
//                   display: "flex",
//                   flexDirection: "column",
//                   textAlign: "start",
//                 }}
//               >
//                 <Image
//                   src={video.snippet.thumbnails.medium.url}
//                   alt="video"
//                   width={320}
//                   height={180}
//                 />
//                 <h3>{video.snippet.title}</h3>
//               </button>
//               <p>{video.snippet.channelTitle}</p>
//               {/* <ReactPlayer
//                 url={`https://www.youtube.com/watch?v=${video.id.videoId}`}
//                 controls
//               /> */}

//               {/* <img src={video.snippet.thumbnails.medium.url} /> */}
//               {/* <CustomYouTubePlayer videoId={video.id.videoId} /> */}
//             </li>
//           ))}
//       </ul>

//       <style jsx>{`
//         input {
//           width: 450px;
//           //   height: 40px;
//           border-radius: 30px 0% 0% 30px;
//           border: 1px solid #d2d4d6;
//           font-size: 16px;
//           padding: 10px 16px;
//           // margin-left: 300px;
//         }
//         input:focus {
//           outline: none;
//         }
//         .search-btn {
//           // position: absolute;
//           background-color: #f8f8f8;
//           border: 1px solid #d2d4d6;
//           border-radius: 0 30px 30px 0;
//           width: 66px;
//           height: 40px;
//           cursor: pointer;
//         }
//         .search-btn:hover {
//           background-color: #ededed;
//         }
//       `}</style>
//     </div>
//   );
// }

// SearchBar.tsx

import React, { useState } from "react";
import axios from "axios";
import { Video } from "@/pages";

interface Props {
  onSearchResults: (results: Video[]) => void;
}

export default function SearchBar({ onSearchResults }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const hydrate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      onSearchResults(response.data.items);
      // console.log(onSearchResults);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    hydrate();
  };

  return (
    <div>
      <form
        onSubmit={handleSearch}
        style={{ position: "relative", marginTop: "4px", display: "flex" }}
      >
        <input
          type="text"
          value={searchQuery}
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#575859"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </button>
      </form>

      <style jsx>{`
        input {
          width: 450px;
          //   height: 40px;
          border-radius: 30px 0% 0% 30px;
          border: 1px solid #d2d4d6;
          font-size: 16px;
          padding: 10px 16px;
          // margin-left: 300px;
        }
        input:focus {
          outline: none;
        }
        .search-btn {
          // position: absolute;
          background-color: #f8f8f8;
          border: 1px solid #d2d4d6;
          border-radius: 0 30px 30px 0;
          width: 66px;
          height: 40px;
          cursor: pointer;
        }
        .search-btn:hover {
          background-color: #ededed;
        }
      `}</style>
    </div>
  );
}
