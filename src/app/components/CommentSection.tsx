import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLike } from "react-icons/ai";
import { BiDislike } from "react-icons/bi";
import { CommentThread, Video } from "@/app/types/types";
import { dateCalculation } from "@/app/formulas/dateCalculation";
import { formatNumberWithCommas } from "@/pages/watch/[v]";

interface CommentSectionProps {
  comments: CommentThread[];
  videoInfo: Video;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  videoInfo,
}) => {
  return (
    <>
      {+videoInfo.statistics.commentCount > 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <h3>
              {formatNumberWithCommas(+videoInfo.statistics.commentCount)}{" "}
              Comments
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-filter-left"
                viewBox="0 0 16 16"
              >
                <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
              </svg>
              <span style={{ fontSize: "15px", fontWeight: 600 }}>Sort by</span>
            </div>
          </div>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment-author">
                  <Link href={`/channel/${videoInfo.snippet.channelId}`}>
                    <Image
                      src={
                        comment.snippet.topLevelComment.snippet
                          .authorProfileImageUrl
                      }
                      alt="author"
                      width={38}
                      height={38}
                      style={{ borderRadius: "50%" }}
                    />
                  </Link>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span style={{ fontSize: "14px", fontWeight: 600 }}>
                        <Link
                          href={`/channel/${videoInfo.snippet.channelId}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          {
                            comment.snippet.topLevelComment.snippet
                              .authorDisplayName
                          }
                        </Link>
                      </span>
                      <span style={{ color: "#676767", fontSize: "12px" }}>
                        {dateCalculation(
                          comment.snippet.topLevelComment.snippet.publishedAt
                        )}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "14.5px",
                        marginTop: "4px",
                        maxWidth: "90%",
                      }}
                    >
                      {comment.snippet.topLevelComment.snippet.textDisplay}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <div className="like-dislike-comment">
                          <AiOutlineLike
                            style={{
                              width: "21px",
                              height: "21px",
                            }}
                          />
                        </div>
                        {comment.snippet.topLevelComment.snippet.likeCount >
                          0 && (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#676767",
                              position: "absolute",
                              right: "-8px",
                              top: 0,
                            }}
                          >
                            {comment.snippet.topLevelComment.snippet.likeCount}
                          </span>
                        )}
                      </div>
                      <div className="like-dislike-comment">
                        <BiDislike style={{ width: "21px", height: "21px" }} />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600 }}>
                        Reply
                      </span>
                    </div>
                  </div>
                </div>
                {/* <div className="comment-actions">
        <span className="like-count">
          {comment.snippet.topLevelComment.snippet.likeCount}
        </span>
      </div> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="rgba(0,0,0,0.8)"
                  className="bi bi-three-dots-vertical"
                  viewBox="0 0 16 16"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "10px",
                    cursor: "pointer",
                  }}
                >
                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ marginLeft: "200px", marginTop: "100px" }}>
          Comments are turned off.{" "}
          <Link
            href={"https://support.google.com/youtube/answer/9706180?hl=en"}
            style={{ textDecoration: "none", color: "#065fd4" }}
            target="_blank"
          >
            Learn more
          </Link>
        </p>
      )}

      <style jsx>{`
        .comment {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          margin-left: -40px;
          max-width: 100%;
          position: relative;
        }
        .comment-author {
          display: flex;
          // align-items: center;
          gap: 10px;
        }

        .bi-three-dots-vertical {
          display: none;
        }
        .comment:hover .bi-three-dots-vertical {
          display: block;
        }

        .like-dislike-comment {
          cursor: pointer;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: -10px 0 0 -8px;
        }
        .like-dislike-comment:hover {
          background-color: #e5e5e5;
        }

        // .comment-actions {
        //   display: flex;
        //   align-items: center;
        //   gap: 5px;
        // }

        // .like-count {
        //   display: flex;
        //   align-items: center;
        //   gap: 5px;
        // }
      `}</style>
    </>
  );
};

export default CommentSection;
