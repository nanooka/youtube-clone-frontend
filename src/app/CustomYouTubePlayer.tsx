import React, { useRef, useEffect } from "react";

interface CustomYouTubePlayerProps {
  videoId: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

const CustomYouTubePlayer: React.FC<CustomYouTubePlayerProps> = ({
  videoId,
}) => {
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "360",
        width: "640",
        videoId: videoId,
        playerVars: {
          modestbranding: 1, // Hide YouTube logo
          controls: 1, // Show player controls
          disablekb: 1, // Disable keyboard control
          fs: 0, // Disable fullscreen button
          rel: 0, // Disable related videos at end
          loop: 0, // Do not loop video
          iv_load_policy: 3, // Hide video annotations
          autoplay: 0, // Do not autoplay
          playsinline: 1, // Play video inline on mobile devices
        },
        events: {
          onReady: () => {
            // You can perform additional actions when the player is ready
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return <div id="youtube-player" />;
};

export default CustomYouTubePlayer;
