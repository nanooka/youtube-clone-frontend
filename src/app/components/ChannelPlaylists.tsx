import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Playlist } from "../types/types";
import { MdPlaylistPlay } from "react-icons/md";
import { IoMdPlay } from "react-icons/io";

interface ChannelPlaylistsProps {
  channelId: string | string[] | undefined;
}

const ChannelPlaylists: React.FC<ChannelPlaylistsProps> = ({ channelId }) => {
  const apiUrl = "http://localhost:3000/api/youtube";
  const [channelPlaylists, setChannelPlaylists] = useState<Playlist[] | null>(
    null
  );
  const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelPlaylists = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/channel-playlists/${channelId}`
        );
        setChannelPlaylists(response.data.items);
      } catch (error) {
        console.error("Error fetching YouTube playlists:", error);
      }
    };
    fetchChannelPlaylists();
  }, [channelId]);

  return (
    <div style={{ marginTop: "30px" }}>
      <p>Created playlists</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        {channelPlaylists?.map((playlist) => (
          <div
            key={playlist.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredPlaylist(playlist.id)}
            onMouseLeave={() => setHoveredPlaylist(null)}
          >
            <div style={{ position: "relative" }}>
              <div
                style={{
                  backgroundColor: "rgba(200,200,200,0.5)",
                  borderRadius: "100px 100px 0 0",
                  width: "210px",
                  height: "5px",
                  position: "absolute",
                  bottom: "1px",
                  left: "10px",
                }}
              ></div>

              <Image
                src={playlist.snippet.thumbnails.medium.url}
                alt={playlist.snippet.title}
                width={210}
                height={5}
                style={{
                  marginLeft: "10px",
                  marginBottom: "-3px",
                  borderRadius: "100px 100px 0 0",
                }}
              />
            </div>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Image
                src={playlist.snippet.thumbnails.medium.url}
                alt={playlist.snippet.title}
                width={230}
                height={130}
                style={{ borderRadius: "10px" }}
              />
              <div
                style={{
                  backgroundColor: "rgba(0,0,0, 0.5)",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "13px",
                  position: "absolute",
                  top: "100px",
                  right: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MdPlaylistPlay style={{ width: "18px", height: "18px" }} />
                <span>{playlist.contentDetails.itemCount} videos</span>
              </div>
              {hoveredPlaylist === playlist.id && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    height: "130px",
                  }}
                >
                  <IoMdPlay style={{ width: "20px", height: "20px" }} />
                  PLAY ALL
                </div>
              )}
            </div>
            <p style={{ fontWeight: 600 }}>{playlist.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ChannelPlaylists;
