import Link from "next/link";
// import GoogleIcon from "../../app/components/static/google_icon.svg";
import GoogleIcon from "../../../app/components/static/google_icon.svg";
import Image from "next/image";

import { useForm } from "@/app/context/FormContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function UsernameStep() {
  const { formData, setFormData, nextStep } = useForm();
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState("");
  const [emailExamples, setEmailExamples] = useState<string[]>([]);
  const [customEmail, setCustomEmail] = useState("");
  const [createCustomEmail, setCreateCustomEmail] = useState(false);

  useEffect(() => {
    if (!formData.firstName || !formData.lastName) {
      router.push("/signup/name");
    } else {
      const getRandomNumber = () => Math.floor(Math.random() * 9000) + 1000;
      const examples = [
        `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}${getRandomNumber()}@gmail.com`,
        `${formData.firstName[0].toLowerCase()}${formData.lastName.toLowerCase()}${getRandomNumber()}@gmail.com`,
      ];
      setEmailExamples(examples);
    }
  }, [formData, router]);

  const handleEmailSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmail(e.target.value);
    setCreateCustomEmail(false); // Deselect create custom email option
    setCustomEmail(""); // Clear custom email input
  };

  const handleCustomEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomEmail(e.target.value);
    setSelectedEmail(""); // Deselect any selected example email
  };

  const handleNext = () => {
    const email = createCustomEmail ? customEmail : selectedEmail;
    setFormData((prev) => ({ ...prev, email }));
    nextStep();
    router.push("/signup/password");
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
            Choose your Gmail address
          </h1>
          <p>Pick a Gmail address or create your own</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            marginTop: "50px",
          }}
        >
          {emailExamples.map((email) => (
            <div key={email} style={{ marginBottom: "10px" }}>
              <input
                type="radio"
                id={email}
                name="email"
                value={email}
                checked={selectedEmail === email}
                onChange={handleEmailSelection}
              />
              <label htmlFor={email} style={{ marginLeft: "10px" }}>
                {email}
              </label>
            </div>
          ))}
          <div style={{ marginBottom: "10px" }}>
            <input
              type="radio"
              id="customEmail"
              name="email"
              checked={createCustomEmail}
              onChange={() => setCreateCustomEmail(true)}
            />
            <label htmlFor="customEmail" style={{ marginLeft: "10px" }}>
              Create your own Gmail address
            </label>
            {createCustomEmail && (
              <input
                type="text"
                value={customEmail}
                onChange={handleCustomEmailChange}
                placeholder="Enter your custom email"
                style={{ marginLeft: "10px", width: "300px" }}
              />
            )}
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
            <button className="btn next-btn" onClick={handleNext}>
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
