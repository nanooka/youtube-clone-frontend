import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useLogin } from "./LoginContext";

interface LikedVideo {
  userID: string;
  id: string;
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
}

interface UserContextProps {
  user: User | null;
  fetchUser: (id: string) => void;
  fetchLikedVideos: (userID: string) => void;
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

  const fetchUser = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchLikedVideos = async () => {
    try {
      const requestData = {
        userID: loginData.userID,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      };
      const response = await fetch(
        `http://localhost:3000/liked-videos/user-liked-videos`,
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
  };

  useEffect(() => {
    if (loginData.token) {
      fetchLikedVideos();
    }
  }, [loginData.token]);

  console.log("user context", user);

  return (
    <UserContext.Provider value={{ user, fetchUser, fetchLikedVideos }}>
      {children}
    </UserContext.Provider>
  );
};
