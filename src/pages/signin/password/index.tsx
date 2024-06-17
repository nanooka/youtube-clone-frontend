import Link from "next/link";
import GoogleIcon from "../../../app/components/static/google_icon.svg";
import Image from "next/image";
import { useReducer, useState } from "react";
import { useLogin } from "@/app/context/LoginContext";
import { useRouter } from "next/router";
import { useUser } from "@/app/context/UserContext";

export default function Password() {
  const { loginData, setLoginData } = useLogin();
  const { fetchUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  const handleShowPasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNextClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // handle successful login, e.g., redirect or save token
        console.log("Login successful:", data);
        setLoginData((prevData) => ({
          ...prevData,
          userID: data.userID,
          token: data.token,
        }));
        setPasswordError(null); // clear any previous errors
        await fetchUser(data.userID);
        router.push("/");
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.error);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setPasswordError("Internal server error");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f4f9",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          display: "flex",
          // alignItems: "center",
          justifyContent: "space-between",
          width: "60%",
          marginLeft: "50%",
          transform: "translate(-50%, 50%)",
          borderRadius: "40px",
        }}
      >
        <div>
          <Image src={GoogleIcon} alt="google-icon" width={70} height={70} />
          <h1 style={{ fontSize: "35px", fontWeight: 400 }}>Hi</h1>
          <p>to continue to YouTube</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "start",
            // justifyContent: "start",
          }}
        >
          <span style={{ fontSize: "15px", marginTop: "40px" }}>
            To continue, first verify it’s you
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          />
          <span style={{ color: "Red" }}>{passwordError}</span>
          <div style={{ marginTop: "10px" }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handleShowPasswordToggle}
            />
            <label>Show password</label>
          </div>
          <div
            style={{
              alignSelf: "end",
              display: "flex",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            {/* <Link href={"/"}> */}
            <button className="btn create-btn">Forgot password?</button>
            {/* </Link> */}
            {/* <Link href={"/"}> */}
            <button className="btn next-btn" onClick={handleNextClick}>
              Next
            </button>
            {/* </Link> */}
          </div>
        </div>
        <div
          className="more-div"
          style={{
            position: "absolute",
            right: "10px",
            bottom: "-40px",
            display: "flex",
            gap: "8px",
          }}
        >
          <Link
            target="_blank"
            style={{ textDecoration: "none", color: "#000" }}
            href={
              "https://support.google.com/accounts?hl=en&visit_id=638537034591626591-661262634&rd=2&p=account_iph#topic=3382296"
            }
          >
            <span>Help</span>
          </Link>
          <Link
            target="_blank"
            style={{ textDecoration: "none", color: "#000" }}
            href={"https://policies.google.com/privacy?gl=GE&hl=en"}
          >
            <span>Privacy</span>
          </Link>
          <Link
            target="_blank"
            style={{ textDecoration: "none", color: "#000" }}
            href={"https://policies.google.com/terms?gl=GE&hl=en"}
          >
            <span>Terms</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        input[type="text"],
        input[type="password"] {
          padding: 20px 15px;
          border-radius: 5px;
          border: 1px solid #747775;
          width: 400px;
          margin-top: 40px;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
          outline: 1px solid #0b57d0;
        }

        .btn {
          border: none;
          border-radius: 40px;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
        }

        .create-btn {
          color: #0b57d0;
          background-color: #fff;
        }
        .create-btn:hover {
          background-color: #f0f4f9;
        }
        .next-btn {
          background-color: #0b57d0;
          color: #fff;
        }
        .next-btn:hover {
          background-color: #0e4eb5;
        }
        .forgot-btn {
          color: #0b57d0;
          font-weight: 600;
          margin-top: 6px;
          cursor: pointer;
        }
        .guest-mode-link,
        .forgot-btn {
          border: none;
          background-color: transparent;
          padding: 4px 4px 6px 0;
          border-radius: 10px;
        }
        .guest-mode-link:hover,
        .forgot-btn:hover {
          background-color: #f0f4f9;
        }
        .more-div span {
          padding: 10px 14px;
          cursor: pointer;
          font-size: 12px;
        }
        .more-div span:hover {
          background-color: #e2e7eb;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
