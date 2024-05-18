import { AppProps } from "next/app";
// import "../styles/globals.css"; // Import global styles if any
import Header from "../app/components/Header";
import { useState } from "react";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    description: string;
    publishTime: string;
    thumbnails: { medium: { height: number; url: string; width: number } };
  };
}

function MyApp({ Component, pageProps }: AppProps) {
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  const handleSearchResults = (results: Video[]) => {
    setSearchResults(results);
  };
  console.log("_app", searchResults);

  return (
    <>
      <Header onSearchResults={handleSearchResults} />
      <Component {...pageProps} searchResults={searchResults} />
    </>
  );
}

export default MyApp;
