import Link from "next/link";
// import GoogleIcon from "../../app/components/static/google_icon.svg";
import GoogleIcon from "../../../app/components/static/google_icon.svg";
import Image from "next/image";
import { useForm } from "@/app/context/FormContext";
import { useRouter } from "next/router";
import React from "react";

export default function NameStep() {
  const { formData, setFormData, nextStep } = useForm();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
    router.push("/signup/birthdaygender");
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
          <h1 style={{ fontSize: "35px", fontWeight: 400 }}>
            Create a Youtube Account
          </h1>
          <p>Enter your name</p>
        </div>
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            marginTop: "50px",
          }}
        > */}
        <form
          onSubmit={handleNext}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            marginTop: "50px",
          }}
        >
          <input
            type="text"
            placeholder="First name"
            className="name-input"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Last name (optional)"
            className="name-input"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <div
            style={{
              alignSelf: "end",
              display: "flex",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            {/* <Link href={"/"}> */}
            <button className="btn next-btn" onClick={handleNext}>
              Next
            </button>
            {/* </Link> */}
          </div>
        </form>
        {/* </div> */}
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
        .name-input {
          padding: 20px 15px;
          border-radius: 5px;
          border: 1px solid #747775;
          width: 400px;
          margin-top: 20px;
        }
        .name-input:focus,
        .date-inputs:focus,
        select:focus {
          outline: 1px solid #0b57d0;
        }

        ::placeholder {
          color: #000;
        }

        .date-inputs,
        select {
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #747775;
        }

        .link-btn {
          border: none;
          background-color: transparent;
          padding: 4px 4px 6px 0;
          border-radius: 10px;
          margin-top: 5px;
          cursor: pointer;
        }
        .link-btn:hover {
          background-color: #f0f4f9;
        }

        .btn {
          border: none;
          border-radius: 40px;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
        }
        .next-btn {
          background-color: #0b57d0;
          color: #fff;
        }
        .next-btn:hover {
          background-color: #0e4eb5;
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
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
