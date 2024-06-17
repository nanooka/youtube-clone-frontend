import { useRouter } from "next/router";
import { ReactNode, createContext, useContext, useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
  userID: string;
  token: string;
}

interface LoginContextProps {
  loginData: LoginFormData;
  setLoginData: React.Dispatch<React.SetStateAction<LoginFormData>>;
  handleNext: () => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    userID: "",
    token: "",
  });

  const router = useRouter();

  const handleNext = () => {
    if (loginData.email) {
      router.push("/signin/password");
    }
  };

  console.log(loginData);

  return (
    <LoginContext.Provider value={{ loginData, setLoginData, handleNext }}>
      {children}
    </LoginContext.Provider>
  );
};
