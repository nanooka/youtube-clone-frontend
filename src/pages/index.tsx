// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import { formatViewCount } from "@/app/formulas/formatViewCount";
// import { dateCalculation } from "@/app/formulas/dateCalculation";
// import { ExtendedVideo } from "@/app/types/types";
// import { convertDuration } from "@/app/formulas/formatDuration";
// import Link from "next/link";
// import NavbarVideoTypes from "@/app/components/NavbarVideoTypes";
// import axios from "axios";

// interface HomeProps {
//   // searchResults: Video[];
//   searchResults: ExtendedVideo[];
// }

// function isVideoIdObject(
//   id: string | { videoId: string }
// ): id is { videoId: string } {
//   return (id as { videoId: string }).videoId !== undefined;
// }

// export default function Home({ searchResults }: HomeProps) {
//   // const [searchResults, setSearchResults] = useState<Video[]>([]);
//   const apiKey = process.env.apiKey;
//   const [randomVideos, setRandomVideos] = useState<ExtendedVideo[]>([]);
//   const [nextPageToken, setNextPageToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   // console.log("index", searchResults);

//   useEffect(() => {
//     const fetchRandomVideos = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/youtube/search`
//         );
//         setNextPageToken(response.data.nextPageToken);
//         await handleRandomVideos(response.data.items);
//       } catch (error) {
//         console.error("Failed to fetch random videos", error);
//       }
//     };

//     if (searchResults.length === 0) {
//       fetchRandomVideos();
//     } else {
//       setRandomVideos(searchResults);
//     }
//   }, [searchResults]);

//   const handleRandomVideos = async (results: ExtendedVideo[]) => {
//     const updatedResults = await Promise.all(
//       results.map(async (video) => {
//         const [channelInfo, videoInfo] = await Promise.all([
//           fetchChannelInfo(video.snippet.channelId),
//           fetchVideoInfo(
//             isVideoIdObject(video.id) ? video.id.videoId : video.id
//           ),
//         ]);
//         return {
//           ...video,
//           ...videoInfo,
//           channelImageUrl: channelInfo?.snippet?.thumbnails?.default?.url || "",
//         };
//       })
//     );
//     setRandomVideos(updatedResults);
//   };

//   const fetchChannelInfo = async (channelId: string) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/youtube/channels/${channelId}?key=${apiKey}&part=snippet`
//       );
//       return response.data.items[0];
//     } catch (error) {
//       console.error("Error fetching channel info:", error);
//       return null;
//     }
//   };

//   const fetchVideoInfo = async (videoId: string) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/youtube/videos/${videoId}?key=${apiKey}&part=snippet,statistics,player,contentDetails`
//       );
//       return response.data.items[0];
//     } catch (error) {
//       console.error("Error fetching video info:", error);
//       return null;
//     }
//   };

//   // console.log("randomvideos", randomVideos);

//   const handleVideoClick = (video: ExtendedVideo) => {
//     // console.log("video", video);
//     router.push({
//       pathname: `/watch/${video.id}`,
//     });
//   };

//   const loadMoreVideos = async () => {
//     if (!nextPageToken || loading) return;

//     setLoading(true);

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/youtube/search`,
//         {
//           params: { pageToken: nextPageToken },
//         }
//       );
//       setNextPageToken(response.data.nextPageToken);
//       await handleRandomVideos(response.data.items);
//     } catch (error) {
//       console.error("Failed to load more videos", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//           document.body.offsetHeight - 500 &&
//         !loading
//       ) {
//         loadMoreVideos();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [nextPageToken, loading]);

//   // const videosToShow = searchResults.length > 0 ? searchResults : randomVideos;

//   return (
//     <div style={{ marginTop: "120px", marginLeft: "120px" }}>
//       <NavbarVideoTypes />
//       <ul
//         style={{
//           listStyleType: "none",
//           // display: "grid",
//           // gridTemplateColumns: "repeat(3, 1fr)",
//         }}
//       >
//         {searchResults && searchResults.length > 0 ? (
//           searchResults.map((video) => (
//             <li
//               key={isVideoIdObject(video.id) ? video.id.videoId : video.id}
//               style={{
//                 // display: "flex",
//                 // flexDirection: "column",
//                 // alignItems: "start",
//                 // textAlign: "start",
//                 marginBottom: "20px",
//                 width: "90%",
//                 // cursor: "pointer",
//               }}
//             >
//               <div
//                 className="video-container"
//                 style={{
//                   // display: "flex",
//                   // justifyContent: "center",
//                   display: "grid",
//                   gridTemplateColumns: "480px 1fr",
//                   alignItems: "flex-start",
//                   // gap: "14px",
//                   gap: "24px",
//                   // position: "relative",
//                 }}
//               >
//                 <button
//                   onClick={() => handleVideoClick(video)}
//                   style={{
//                     border: "none",
//                     // backgroundColor: "transparent",
//                     cursor: "pointer",
//                     display: "flex",
//                     justifyContent: "center",
//                     // flexDirection: "column",
//                     // textAlign: "start",
//                     position: "relative",
//                     // backgroundColor: "red",
//                     // borderRadius: "12px",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Image
//                     src={video.snippet.thumbnails.medium.url}
//                     alt="video"
//                     // width={video.snippet.thumbnails.medium.width}
//                     // height={video.snippet.thumbnails.medium.height}
//                     width={480}
//                     height={270}
//                     // className="video-image"
//                     // style={{ borderRadius: "12px" }}
//                   />
//                   <span
//                     style={{
//                       position: "absolute",
//                       bottom: "8px",
//                       right: "12px",
//                       color: "white",
//                       background: "rgba(0,0,0,0.65)",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                       padding: "3px",
//                       borderRadius: "4px",
//                     }}
//                   >
//                     {convertDuration(video.contentDetails.duration)}
//                   </span>
//                 </button>
//                 <div
//                   style={{ marginTop: "-16px", position: "relative" }}
//                   className="video-info"
//                 >
//                   <h3
//                     style={{
//                       fontWeight: "400",
//                       cursor: "pointer",
//                       width: "100%",
//                       // backgroundColor: "red",
//                     }}
//                     onClick={() => handleVideoClick(video)}
//                   >
//                     {video.snippet.title}
//                   </h3>
//                   <div
//                     style={{
//                       color: "#676767",
//                       fontSize: "13px",
//                       display: "flex",
//                       marginTop: "-14px",
//                       marginBottom: "15px",
//                       cursor: "pointer",
//                       width: "100%",
//                       // backgroundColor: "red",
//                     }}
//                     onClick={() => handleVideoClick(video)}
//                   >
//                     <span>{formatViewCount(video.statistics.viewCount)}</span>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       fill="#676767"
//                       className="bi bi-dot"
//                       viewBox="0 0 16 16"
//                     >
//                       <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
//                     </svg>
//                     <span>{dateCalculation(video.snippet.publishedAt)}</span>
//                   </div>
//                   {/* <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "12px",
//                     }}
//                   > */}
//                   <Link
//                     href={`/channel/${video.snippet.channelId}`}
//                     style={{
//                       // marginLeft: "10px",
//                       color: "#606060",
//                       fontSize: "12px",
//                       textDecoration: "none",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       marginBottom: "12px",
//                     }}
//                   >
//                     <Image
//                       src={
//                         video.channelImageUrl || "/default-channel-image.png"
//                       }
//                       alt="channel"
//                       width={26}
//                       height={26}
//                       style={{ borderRadius: "50%" }}
//                     />

//                     <span>{video.snippet.channelTitle}</span>
//                   </Link>
//                   {/* </div> */}
//                   {video.contentDetails.caption == "true" ? (
//                     <div
//                       style={{
//                         cursor: "pointer",
//                         width: "100%",
//                         // backgroundColor: "red",
//                       }}
//                       onClick={() => handleVideoClick(video)}
//                     >
//                       <span
//                         style={{
//                           backgroundColor: "#f2f2f2",
//                           color: "#606060",
//                           padding: "0 4px",
//                           borderRadius: "2px",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                         }}
//                       >
//                         CC
//                       </span>
//                     </div>
//                   ) : null}
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="18"
//                     height="18"
//                     fill="rgba(0,0,0,0.8)"
//                     className="bi bi-three-dots-vertical dots"
//                     viewBox="0 0 16 16"
//                     style={{
//                       position: "absolute",
//                       right: 0,
//                       top: "24px",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
//                   </svg>
//                 </div>
//               </div>
//               {/* <div>{video.player.embedHtml}</div> */}
//             </li>
//           ))
//         ) : (
//           <div
//             style={{
//               // marginTop: "120px",
//               // marginLeft: "120px",
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
//               gap: "20px",
//             }}
//           >
//             {randomVideos.map((video) => (
//               <div
//                 key={isVideoIdObject(video.id) ? video.id.videoId : video.id}
//                 style={{
//                   cursor: "pointer",
//                   maxWidth: "400px",
//                   marginBottom: "5px",
//                 }}
//                 onClick={() => handleVideoClick(video)}
//               >
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                   <div className="video-image">
//                     <Image
//                       src={video.snippet.thumbnails.medium.url}
//                       alt={video.snippet.title}
//                       width={390}
//                       height={210}
//                       // style={{ borderRadius: "10px" }}
//                     />
//                   </div>
//                   <span
//                     style={{
//                       position: "absolute",
//                       // top: "152px",
//                       bottom: "10px",
//                       right: "9px",
//                       color: "white",
//                       background: "rgba(0,0,0,0.65)",
//                       fontWeight: 700,
//                       fontSize: "12px",
//                       padding: "3px",
//                       borderRadius: "4px",
//                     }}
//                   >
//                     {convertDuration(video.contentDetails.duration)}
//                   </span>
//                 </div>
//                 <div
//                   style={{ display: "flex", gap: "20px", alignItems: "center" }}
//                 >
//                   <div>
//                     <Image
//                       src={
//                         video.channelImageUrl || "/default-channel-image.png"
//                       }
//                       alt="channel"
//                       width={40}
//                       height={40}
//                       style={{ borderRadius: "50%" }}
//                     />
//                   </div>
//                   <div>
//                     <p style={{ fontWeight: 600 }}>{video.snippet.title}</p>
//                     <p
//                       style={{
//                         color: "#676767",
//                         fontSize: "13px",
//                         marginTop: "-10px",
//                         marginBottom: "2px",
//                       }}
//                     >
//                       {video.snippet.channelTitle}
//                     </p>
//                     <div
//                       style={{
//                         color: "#676767",
//                         fontSize: "15px",
//                         display: "flex",
//                         // marginTop: "-14px",
//                         // marginBottom: "15px",
//                         cursor: "pointer",
//                         width: "100%",
//                       }}
//                     >
//                       <span>{formatViewCount(video.statistics.viewCount)}</span>
//                       <svg
//                         xmlns="http:www.w3.org/2000/svg"
//                         width="16"
//                         height="16"
//                         fill="#676767"
//                         className="bi bi-dot"
//                         viewBox="0 0 16 16"
//                       >
//                         <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
//                       </svg>
//                       <span>{dateCalculation(video.snippet.publishedAt)}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </ul>

//       <style jsx>{`
//         .video-container button {
//           border-radius: 12px;
//         }
//         .video-container:hover button,
//         .video-image:hover {
//           border-radius: 0;
//           transition: 0.3s;
//         }
//         .video-info .dots {
//           display: none;
//         }
//         .video-info:hover .dots {
//           display: block;
//         }
//         .video-image {
//           border-radius: 10px;
//           overflow: hidden;
//           height: 210px;
//         }
//       `}</style>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { formatViewCount } from "@/app/formulas/formatViewCount";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { ExtendedVideo } from "@/app/types/types";
import { convertDuration } from "@/app/formulas/formatDuration";
import Link from "next/link";
import NavbarVideoTypes from "@/app/components/NavbarVideoTypes";
import axios from "axios";
import Spinner from "@/app/components/Spinner";
import { MdOutlineWatchLater } from "react-icons/md";

interface HomeProps {
  searchResults: ExtendedVideo[];
}

function isVideoIdObject(
  id: string | { videoId: string }
): id is { videoId: string } {
  return (id as { videoId: string }).videoId !== undefined;
}

export default function Home({ searchResults }: HomeProps) {
  const apiKey = process.env.apiKey;
  const [randomVideos, setRandomVideos] = useState<ExtendedVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRandomVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/youtube/search`
        );
        setNextPageToken(response.data.nextPageToken);
        await handleRandomVideos(response.data.items);
      } catch (error) {
        console.error("Failed to fetch random videos", error);
      }
    };

    if (searchResults.length === 0) {
      fetchRandomVideos();
    } else {
      setRandomVideos(searchResults);
    }
  }, [searchResults]);

  const handleRandomVideos = async (results: ExtendedVideo[]) => {
    const updatedResults = await Promise.all(
      results.map(async (video) => {
        const [channelInfo, videoInfo] = await Promise.all([
          fetchChannelInfo(video.snippet.channelId),
          fetchVideoInfo(
            isVideoIdObject(video.id) ? video.id.videoId : video.id
          ),
        ]);
        return {
          ...video,
          ...videoInfo,
          channelImageUrl: channelInfo?.snippet?.thumbnails?.default?.url || "",
        };
      })
    );
    setRandomVideos((prev) => [...prev, ...updatedResults]);
  };

  const fetchChannelInfo = async (channelId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/youtube/channels/${channelId}?key=${apiKey}&part=snippet`
      );
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  };

  const fetchVideoInfo = async (videoId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/youtube/videos/${videoId}?key=${apiKey}&part=snippet,statistics,player,contentDetails`
      );
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching video info:", error);
      return null;
    }
  };

  const handleVideoClick = (video: ExtendedVideo) => {
    router.push({
      pathname: `/watch/${video.id}`,
    });
  };

  const loadMoreVideos = async () => {
    if (!nextPageToken || loading) return;

    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/youtube/search`,
        {
          params: { pageToken: nextPageToken },
        }
      );
      setNextPageToken(response.data.nextPageToken);
      await handleRandomVideos(response.data.items);
    } catch (error) {
      console.error("Failed to load more videos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !loading
      ) {
        loadMoreVideos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loading]);

  return (
    <div style={{ marginTop: "120px", marginLeft: "120px" }}>
      <NavbarVideoTypes />
      {loading && <Spinner />}
      <ul
        style={{
          listStyleType: "none",
        }}
      >
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((video) => (
            <li
              key={isVideoIdObject(video.id) ? video.id.videoId : video.id}
              style={{
                marginBottom: "20px",
                width: "90%",
              }}
            >
              <div
                className="video-container"
                style={{
                  display: "grid",
                  gridTemplateColumns: "480px 1fr",
                  alignItems: "flex-start",
                  gap: "24px",
                }}
              >
                <button
                  onClick={() => handleVideoClick(video)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={video.snippet.thumbnails.medium.url}
                    alt="video"
                    width={480}
                    height={270}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "12px",
                      color: "white",
                      background: "rgba(0,0,0,0.65)",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "3px",
                      borderRadius: "4px",
                    }}
                  >
                    {convertDuration(video.contentDetails.duration)}
                  </span>
                </button>
                <div
                  style={{ marginTop: "-16px", position: "relative" }}
                  className="video-info"
                >
                  <h3
                    style={{
                      fontWeight: "400",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    onClick={() => handleVideoClick(video)}
                  >
                    {video.snippet.title}
                  </h3>
                  <div
                    style={{
                      color: "#676767",
                      fontSize: "13px",
                      display: "flex",
                      marginTop: "-14px",
                      marginBottom: "15px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    onClick={() => handleVideoClick(video)}
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
                  <Link
                    href={`/channel/${video.snippet.channelId}`}
                    style={{
                      color: "#606060",
                      fontSize: "12px",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                    }}
                  >
                    <Image
                      src={
                        video.channelImageUrl || "/default-channel-image.png"
                      }
                      alt="channel"
                      width={26}
                      height={26}
                      style={{ borderRadius: "50%" }}
                    />
                    <span>{video.snippet.channelTitle}</span>
                  </Link>
                  {video.contentDetails.caption == "true" ? (
                    <div
                      style={{
                        cursor: "pointer",
                        width: "100%",
                      }}
                      onClick={() => handleVideoClick(video)}
                    >
                      <span
                        style={{
                          backgroundColor: "#f2f2f2",
                          color: "#606060",
                          padding: "0 4px",
                          borderRadius: "2px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        CC
                      </span>
                    </div>
                  ) : null}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="rgba(0,0,0,0.8)"
                    className="bi bi-three-dots-vertical dots"
                    viewBox="0 0 16 16"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "24px",
                      cursor: "pointer",
                    }}
                  >
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                  </svg>
                </div>
              </div>
            </li>
          ))
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "20px",
            }}
          >
            {randomVideos.map((video) => (
              <div
                key={isVideoIdObject(video.id) ? video.id.videoId : video.id}
                style={{
                  cursor: "pointer",
                  maxWidth: "400px",
                  marginBottom: "5px",
                }}
                onClick={() => handleVideoClick(video)}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <div className="video-image">
                    <Image
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      width={390}
                      height={210}
                    />
                    <div className="watch-later-btn">
                      <MdOutlineWatchLater
                        style={{ width: "21px", height: "21px" }}
                      />
                    </div>
                  </div>

                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "9px",
                      color: "white",
                      background: "rgba(0,0,0,0.65)",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "3px",
                      borderRadius: "4px",
                    }}
                  >
                    {convertDuration(video.contentDetails.duration)}
                  </span>
                </div>
                <div
                  style={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <div>
                    <Image
                      src={
                        video.channelImageUrl || "/default-channel-image.png"
                      }
                      alt="channel"
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{video.snippet.title}</p>
                    <p
                      style={{
                        color: "#676767",
                        fontSize: "13px",
                        marginTop: "-10px",
                        marginBottom: "2px",
                      }}
                    >
                      {video.snippet.channelTitle}
                    </p>
                    <div
                      style={{
                        color: "#676767",
                        fontSize: "15px",
                        display: "flex",
                        cursor: "pointer",
                        width: "100%",
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
                </div>
              </div>
            ))}
          </div>
        )}
      </ul>

      <style jsx>{`
        .video-container button {
          border-radius: 12px;
        }
        .video-container:hover button,
        .video-image:hover {
          border-radius: 0;
          transition: 0.3s;
        }
        .video-info .dots {
          display: none;
        }
        .video-info:hover .dots {
          display: block;
        }
        .video-image {
          border-radius: 10px;
          overflow: hidden;
          height: 210px;
        }
        .video-image:hover .watch-later-btn {
          display: block;
        }
        .watch-later-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.65);
          font-size: 12px;
          padding: 1px 3px;
          border-radius: 4px;
          display: none;
        }
      `}</style>
    </div>
  );
}
