// import { useRouter } from "next/router";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { useLogin } from "./LoginContext";
// // import LikedVideos from "@/pages/playlist/LL";
// // import WatchLaterVideos from "@/pages/playlist/WL";

// interface LikedVideo {
//   userID: string;
//   id: string;
// }

// interface WatchLaterVideo {
//   userID: string;
//   id: string;
// }

// interface Subscription {
//   userID: string;
//   channelID: string;
// }

// interface User {
//   _id: string;
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   day: string;
//   month: string;
//   year: string;
//   gender: string;
//   userDate: number;
//   likedVideos: LikedVideo[];
//   watchLaterVideos: WatchLaterVideo[];
//   subscriptions: Subscription[];
// }

// interface UserContextProps {
//   user: User | null;
//   fetchUser: (id: string) => void;
//   fetchLikedVideos: () => void;
//   fetchWatchLaterVideos: () => void;
//   fetchSubscriptions: () => void;
// }

// const UserContext = createContext<UserContextProps | undefined>(undefined);

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const { loginData } = useLogin();
//   const router = useRouter();

//   const fetchUser = async (id: string) => {
//     try {
//       const response = await fetch(`http://localhost:8080/users/${id}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const userData = await response.json();
//       setUser(userData);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   };

//   const fetchLikedVideos = async () => {
//     try {
//       const requestData = {
//         userID: loginData.userID,
//       };
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${loginData.token}`,
//       };
//       const response = await fetch(
//         `http://localhost:8080/liked-videos/user-liked-videos`,
//         {
//           method: "POST",
//           headers: headers,
//           body: JSON.stringify(requestData),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const likedVideos = await response.json();
//       setUser((prevUser) => (prevUser ? { ...prevUser, likedVideos } : null));
//     } catch (error) {
//       console.error("Error fetching liked videos", error);
//     }
//   };

//   const fetchWatchLaterVideos = async () => {
//     try {
//       const requestData = {
//         userID: loginData.userID,
//       };
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${loginData.token}`,
//       };
//       const response = await fetch(
//         `http://localhost:8080/watch-later-videos/user-watch-later-videos`,
//         {
//           method: "POST",
//           headers: headers,
//           body: JSON.stringify(requestData),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const watchLaterVideos = await response.json();
//       setUser((prevUser) =>
//         prevUser ? { ...prevUser, watchLaterVideos } : null
//       );
//     } catch (error) {
//       console.error("Error fetching liked videos", error);
//     }
//   };

//   const fetchSubscriptions = async () => {
//     try {
//       const requestData = {
//         userID: loginData.userID,
//       };
//       const headers = {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${loginData.token}`,
//       };
//       const response = await fetch(
//         `http://localhost:8080/subscriptions/user-subscriptions`,
//         {
//           method: "POST",
//           headers: headers,
//           body: JSON.stringify(requestData),
//         }
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const subscriptions = await response.json();
//       setUser((prevUser) => (prevUser ? { ...prevUser, subscriptions } : null));
//     } catch (error) {
//       console.error("Error fetching subscriptions", error);
//     }
//   };

//   useEffect(() => {
//     if (loginData.token) {
//       fetchLikedVideos();
//       fetchWatchLaterVideos();
//       fetchSubscriptions();
//     }
//   }, [loginData.token]);

//   console.log("user context", user);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         fetchUser,
//         fetchLikedVideos,
//         fetchWatchLaterVideos,
//         fetchSubscriptions,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useLogin } from "./LoginContext";

interface LikedVideo {
  userID: string;
  id: string;
}

interface WatchLaterVideo {
  userID: string;
  id: string;
}

interface Subscription {
  userID: string;
  channelID: string;
}

interface User {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  userDate: number;
  likedVideos: LikedVideo[];
  watchLaterVideos: WatchLaterVideo[];
  subscriptions: Subscription[];
}

interface UserContextProps {
  user: User | null;
  fetchUser: (id: string) => void;
  fetchLikedVideos: () => void;
  fetchWatchLaterVideos: () => void;
  fetchSubscriptions: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { loginData } = useLogin();
  const router = useRouter();

  const fetchUser = useCallback(async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  const fetchLikedVideos = useCallback(async () => {
    try {
      const requestData = {
        userID: loginData.userID,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      };
      const response = await fetch(
        `http://localhost:8080/liked-videos/user-liked-videos`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const likedVideos = await response.json();
      setUser((prevUser) => (prevUser ? { ...prevUser, likedVideos } : null));
    } catch (error) {
      console.error("Error fetching liked videos", error);
    }
  }, [loginData.userID, loginData.token]);

  const fetchWatchLaterVideos = useCallback(async () => {
    try {
      const requestData = {
        userID: loginData.userID,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      };
      const response = await fetch(
        `http://localhost:8080/watch-later-videos/user-watch-later-videos`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const watchLaterVideos = await response.json();
      setUser((prevUser) =>
        prevUser ? { ...prevUser, watchLaterVideos } : null
      );
    } catch (error) {
      console.error("Error fetching watch later videos", error);
    }
  }, [loginData.userID, loginData.token]);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const requestData = {
        userID: loginData.userID,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      };
      const response = await fetch(
        `http://localhost:8080/subscriptions/user-subscriptions`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const subscriptions = await response.json();
      setUser((prevUser) => (prevUser ? { ...prevUser, subscriptions } : null));
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    }
  }, [loginData.userID, loginData.token]);

  useEffect(() => {
    if (loginData.token) {
      fetchLikedVideos();
      fetchWatchLaterVideos();
      fetchSubscriptions();
    }
  }, [
    loginData.token,
    loginData.userID,
    fetchLikedVideos,
    fetchWatchLaterVideos,
    fetchSubscriptions,
  ]);

  return (
    <UserContext.Provider
      value={{
        user,
        fetchUser,
        fetchLikedVideos,
        fetchWatchLaterVideos,
        fetchSubscriptions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
