import Link from "next/link";
import GoogleIcon from "../../../app/components/static/google_icon.svg";
import Image from "next/image";
import { useLogin } from "@/app/context/LoginContext";
import { useState } from "react";

export default function SignIn() {
  const { loginData, setLoginData, handleNext } = useLogin();
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailRegistered, setIsEmailRegistered] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const checkEmailRegistered = async (email: string) => {
    try {
      const response = await fetch("http://localhost:3000/users/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data.registered;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleNextClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email) {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(true);
      const isRegistered = await checkEmailRegistered(loginData.email);
      if (!isRegistered) {
        setIsEmailRegistered(false);
      } else {
        setIsEmailRegistered(true);
        handleNext();
      }
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
          justifyContent: "space-between",
          width: "60%",
          marginLeft: "50%",
          transform: "translate(-50%, 50%)",
          borderRadius: "40px",
        }}
      >
        <div>
          <Image src={GoogleIcon} alt="google-icon" width={70} height={70} />
          <h1 style={{ fontSize: "35px", fontWeight: 400 }}>Sign in</h1>
          <p>to continue to YouTube</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
          }}
        >
          <form onSubmit={handleNextClick}>
            <input
              type="text"
              placeholder="Email or phone"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              style={{
                borderColor: isEmailValid ? "#747775" : "red",
              }}
            />
          </form>
          {!isEmailRegistered && (
            <span style={{ color: "red", marginTop: "10px" }}>
              Email not registered.
            </span>
          )}
          <button className="forgot-btn">Forgot email?</button>
          <span style={{ fontSize: "15px", marginTop: "40px" }}>
            Not your computer? Use a private browsing window to sign in.
          </span>
          <button className="guest-mode-link">
            <Link
              style={{
                textDecoration: "none",
                color: "#0b57d0",
                fontWeight: 600,
              }}
              target="_blank"
              href={
                "https://support.google.com/accounts/answer/2917834?visit_id=638537005805426248-3694366440&p=signin_privatebrowsing&hl=en&rd=1"
              }
            >
              Learn more about using Guest mode
            </Link>
          </button>
          <div
            style={{
              alignSelf: "end",
              display: "flex",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            {/* <Link href={"/"}> */}
            <button className="btn create-btn">Create account</button>
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
        input {
          padding: 20px 15px;
          border-radius: 5px;
          border: 1px solid #747775;
          width: 400px;
          margin-top: 50px;
        }
        input:focus {
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
