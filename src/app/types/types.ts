export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { height: number; url: string; width: number };
      high: { height: number; url: string; width: number };
      medium: { height: number; url: string; width: number };
    };
  };
  statistics: {
    commentCount: string;
    favoriteCount: string;
    likeCount: string;
    viewCount: string;
  };
  player: {
    embedHtml: string;
  };
  contentDetails: {
    caption: string;
    licensedContent: boolean;
    duration: string;
  };
}

export interface ExtendedVideo extends Video {
  channelImageUrl?: string;
}

export interface ChannelInfo {
  snippet: {
    customUrl: string;
    thumbnails: { medium: { height: number; url: string; width: number } };
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
  // ...
}
