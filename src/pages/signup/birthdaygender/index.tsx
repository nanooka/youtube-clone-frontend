import Link from "next/link";
// import GoogleIcon from "../../app/components/static/google_icon.svg";
import GoogleIcon from "../../../app/components/static/google_icon.svg";
import Image from "next/image";

export default function index() {
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
            Basic information
          </h1>
          <p>Enter your birthday and gender</p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            marginTop: "50px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 100px 100px",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <select name="month" id="month">
              <option value="" selected disabled hidden>
                Month
              </option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">Julyuary</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <input type="number" placeholder="Day" className="date-inputs" />
            <input type="number" placeholder="Year" className="date-inputs" />
          </div>
          <select
            name="gender"
            id="gender"
            style={{ width: "100%", marginTop: "15px" }}
          >
            <option value="" selected disabled hidden>
              Gender
            </option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Rather-not-say">Rather not say</option>
            <option value="Custom">Custom</option>
          </select>
          <button className="link-btn">
            <Link
              target="_blank"
              style={{
                textDecoration: "none",
                color: "#0b57d0",
                fontWeight: 600,
              }}
              href={"https://support.google.com/accounts/answer/1733224?hl=en"}
            >
              Why we ask for birthday and gender
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
            <Link href={"/"}>
              <button className="btn next-btn">Next</button>
            </Link>
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
