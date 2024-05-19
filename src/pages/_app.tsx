import { AppProps } from "next/app";
// import "../styles/globals.css"; // Import global styles if any
import Header from "../app/components/Header";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Video } from "@/app/types/types";

// export interface Video {
//   id: {
//     videoId: string;
//   };
//   snippet: {
//     title: string;
//     channelTitle: string;
//     channelId: string;
//     description: string;
//     publishedAt: string;
//     thumbnails: {
//       default: { height: number; url: string; width: number };
//       high: { height: number; url: string; width: number };
//       medium: { height: number; url: string; width: number };
//     };
//   };
//   statistics: {
//     commentCount: string;
//     favoriteCount: string;
//     likeCount: string;
//     viewCount: string;
//   };
//   player: {
//     embedHtml: string;
//   };
//   contentDetails: {
//     caption: string;
//     licensedContent: boolean;
//   };
// }

// export interface ExtendedVideo extends Video {
//   channelImageUrl?: string;
// }

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";

  const handleSearchResults = async (results: Video[]) => {
    const updatedResults = await Promise.all(
      // results.map(async (video) => {
      //   const channelInfo = await fetchChannelInfo(video.snippet.channelId);
      //   return {
      //     ...video,
      //     channelImageUrl: channelInfo?.snippet?.thumbnails?.default?.url || "",
      //   };
      // })
      results.map(async (video) => {
        const [channelInfo, videoInfo] = await Promise.all([
          fetchChannelInfo(video.snippet.channelId),
          fetchVideoInfo(video.id.videoId),
        ]);
        return {
          ...video,
          ...videoInfo,
          channelImageUrl: channelInfo?.snippet?.thumbnails?.default?.url || "",
        };
      })
    );
    console.log("updated", updatedResults);
    setSearchResults(updatedResults);
    router.push("/");
  };

  const fetchChannelInfo = async (channelId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/channels/${channelId}?${apiKey}&part=snippet`
      );
      console.log("new", response.data.items[0]);
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  };

  const fetchVideoInfo = async (videoId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/videos/${videoId}?${apiKey}&part=snippet,statistics,player,contentDetails`
      );
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  };

  // console.log("_app", searchResults);

  return (
    <>
      <Header onSearchResults={handleSearchResults} />
      <Component {...pageProps} searchResults={searchResults} />
    </>
  );
}

export default MyApp;
