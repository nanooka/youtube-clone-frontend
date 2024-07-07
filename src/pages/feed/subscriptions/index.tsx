import { useUser } from "@/app/context/UserContext";
import { useLogin } from "@/app/context/LoginContext";
import { MdOutlineSubscriptions } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import SignInIcon from "@/app/components/static/web.png";

export default function Subscriptions() {
  const { user } = useUser();
  const { loginData } = useLogin();

  return (
    <div style={{ margin: "200px" }}>
      {loginData.token === "" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MdOutlineSubscriptions style={{ width: "130px", height: "130px" }} />
          <h2>Don’t miss new videos</h2>
          <p>Sign in to see updates from your favorite YouTube channels</p>
          <Link href={"/signin/identifier"} style={{ textDecoration: "none" }}>
            <button className="sign-in">
              <Image src={SignInIcon} alt="sign-in" width={26} height={26} />
              <span>Sign in</span>
            </button>
          </Link>
        </div>
      ) : (
        <p>subscriptions</p>
      )}

      <style jsx>{`
        .sign-in {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #d2d4d6;
          border-radius: 30px;
          padding: 4px 12px;
          cursor: pointer;
          background-color: transparent;
          // width: 220px;
          margin-right: 40px;
        }
        .sign-in:hover {
          background-color: #def1ff;
          border: 1px solid #def1ff;
        }
      `}</style>
    </div>
  );
}
