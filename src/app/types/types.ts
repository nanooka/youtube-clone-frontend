export interface Video {
  id:
    | {
        videoId: string;
      }
    | string;
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
  brandingSettings: {
    channel: {
      defaultLanguage: string;
      title: string;
      unsubscribedTrailer: string;
    };
    image: { bannerExternalUrl: string };
  };
  // ...
}

export interface CommentSnippet {
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
}

export interface TopLevelComment {
  id: string;
  snippet: CommentSnippet;
}

export interface CommentThreadSnippet {
  videoId: string;
  topLevelComment: TopLevelComment;
  totalReplyCount: number;
  canReply: boolean;
  isPublic: boolean;
}

export interface CommentThread {
  id: string;
  snippet: CommentThreadSnippet;
}

export interface CommentsResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: CommentThread[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface Playlist {
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    localized: {
      title: string;
      description: string;
    };
  };
  contentDetails: {
    itemCount: number;
  };
}
