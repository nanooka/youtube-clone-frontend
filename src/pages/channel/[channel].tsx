import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChannelInfo } from "@/app/types/types";

export default function ChannelPage() {
  const apiKey = "AIzaSyCB_jwO0CDx7oIHM3wUXTlU0zwiJOh12x8";
  const router = useRouter();
  const channelId = router.query.channel;
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);

  const fetchChannel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/channels/${router.query.channel}?${apiKey}&part="snippet,id,statistics"`
      );
      //   console.log(response);
      setChannelInfo(response.data.items[0]);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };
  console.log(channelInfo);

  //   fetch();
  // }, [channelId]);

  useEffect(() => {
    if (channelId) {
      fetchChannel();
    }
  }, [channelId]);

  return <div>channel page</div>;
}
