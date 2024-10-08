import { AppProps } from "next/app";
// import "../styles/globals.css"; // Import global styles if any
import Header from "../app/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Video } from "@/app/types/types";
import SideBar from "@/app/components/SideBar";
import nProgress from "nprogress";
import "../styles/nprogress.css";

import { Roboto } from "next/font/google";
import { FormProvider } from "@/app/context/FormContext";
import { LoginProvider } from "@/app/context/LoginContext";
import { UserProvider } from "@/app/context/UserContext";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

function isVideoIdObject(
  id: string | { videoId: string }
): id is { videoId: string } {
  return (id as { videoId: string }).videoId !== undefined;
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const apiKey = process.env.apiKey;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const handleStart = () => {
  //     nProgress.start();
  //   };

  //   const handleStop = () => {
  //     nProgress.done();
  //   };

  //   router.events.on("routeChangeStart", handleStart);
  //   router.events.on("routeChangeComplete", handleStop);
  //   router.events.on("routeChangeError", handleStop);

  //   return () => {
  //     router.events.off("routeChangeStart", handleStart);
  //     router.events.off("routeChangeComplete", handleStop);
  //     router.events.off("routeChangeError", handleStop);
  //   };
  // }, [router]);

  useEffect(() => {
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);
    router.events.on("routeChangeError", stopLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
      router.events.off("routeChangeError", stopLoading);
    };
  }, [router]);

  useEffect(() => {
    if (loading) {
      nProgress.start();
    } else {
      nProgress.done();
    }
  }, [loading]);

  // ........................................
  // useEffect(() => {
  //   const handleRouteChange = (
  //     url: string,
  //     { shallow }: { shallow: boolean }
  //   ) => {
  //     if (!shallow && router.asPath !== "/" && url === "/") {
  //       setSearchResults([]);
  //     }
  //   };
  //   // const handleRouteChange = (url: string) => {
  //   //   if (router.pathname !== "/" && url === "/") {
  //   //     setSearchResults([]);
  //   //   }
  //   // };

  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router.asPath, router.events]);

  useEffect(() => {
    const handleRouteChange = (
      url: string,
      { shallow }: { shallow: boolean }
    ) => {
      if (!shallow && router.asPath !== "/" && url === "/") {
        setSearchResults([]);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.asPath, router.events]);

  console.log("_app", router.pathname);
  // ........................................

  const handleSearchResults = async (
    results: Video[],
    isSearchOperation: boolean
  ) => {
    try {
      setLoading(true);
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
            channelImageUrl:
              channelInfo?.snippet?.thumbnails?.default?.url || "",
          };
        })
      );
      // console.log("updated", updatedResults);
      setSearchResults(updatedResults);
      // router.push("/");
      router.push("/", "/", { shallow: !isSearchOperation });
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelInfo = async (channelId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/youtube/channels/${channelId}?${apiKey}&part=snippet`
      );
      // console.log("new", response.data.items[0]);
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  };

  const fetchVideoInfo = async (videoId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/youtube/videos/${videoId}?${apiKey}&part=snippet,statistics,player,contentDetails`
      );
      return response.data.items[0];
    } catch (error) {
      console.error("Error fetching channel info:", error);
      return null;
    }
  };

  // console.log("_app", searchResults);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <FormProvider>
      <LoginProvider>
        <UserProvider>
          <div className={roboto.className}>
            {router.pathname !== "/signin/identifier" &&
              router.pathname !== "/signin/password" &&
              router.pathname !== "/signup/name" &&
              router.pathname !== "/signup/birthdaygender" &&
              router.pathname !== "/signup/username" &&
              router.pathname !== "/signup/password" &&
              router.pathname !== "/confirmation" && (
                <>
                  <Header
                    // onSearchResults={handleSearchResults}
                    onSearchResults={(results: Video[]) =>
                      handleSearchResults(results, true)
                    }
                    toggleSidebar={toggleSidebar}
                  />
                  <SideBar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                </>
              )}
            {/* <Header
        // onSearchResults={handleSearchResults}
        onSearchResults={(results: Video[]) =>
          handleSearchResults(results, true)
        }
        toggleSidebar={toggleSidebar}
      />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
            <div
              className={`main-container ${
                isSidebarOpen ? "sidebar-open" : "sidebar-closed"
              } ${
                router.pathname == "/signin/identifier" ||
                router.pathname == "/signin/password" ||
                router.pathname == "/signup/name" ||
                router.pathname == "/signup/birthdaygender" ||
                router.pathname == "/signup/username" ||
                router.pathname == "/signup/password" ||
                router.pathname == "/confirmation"
                  ? "signin-page"
                  : ""
              }`}
            >
              <Component {...pageProps} searchResults={searchResults} />
            </div>
            <style jsx>{`
              // .main-container {
              //   transition: margin-left 0.3s ease-in-out;
              // }

              body {
                // font-family: "Roboto", sans-serif;
              }
              .main-container.sidebar-open {
                margin-left: 100px; /* Adjust the value to match the width of your sidebar */
              }

              .main-container.sidebar-closed {
                margin-left: 0;
              }
              .main-container.signin-page {
                margin: -8px;
              }
            `}</style>
          </div>
        </UserProvider>
      </LoginProvider>
    </FormProvider>
  );
}

export default MyApp;
