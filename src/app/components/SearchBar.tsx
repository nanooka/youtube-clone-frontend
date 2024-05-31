import React, { useState } from "react";
import axios from "axios";
import { Video } from "../types/types";
import { CiSearch } from "react-icons/ci";

interface Props {
  onSearchResults: (results: Video[]) => void;
}

export default function SearchBar({ onSearchResults }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const hydrate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/youtube/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      onSearchResults(response.data.items);
    } catch (error) {
      console.error("Error searching YouTube:", error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      hydrate();
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSearch}
        style={{ position: "relative", marginTop: "4px", display: "flex" }}
      >
        <input
          type="text"
          value={searchQuery}
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <div onClick={() => setSearchQuery("")} className="clear-search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </div>
        )}

        <button type="submit" className="search-btn">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#575859"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg> */}
          <CiSearch style={{ width: "26px", height: "26px" }} />
        </button>
      </form>

      <style jsx>{`
        input {
          width: 450px;
          // height: 40px;
          border-radius: 30px 0% 0% 30px;
          border: 1px solid #d2d4d6;
          font-size: 16px;
          padding: 10px 16px;
          // margin-left: 300px;
        }
        input:focus {
          outline: none;
        }
        .search-btn {
          // position: absolute;
          background-color: #f8f8f8;
          border: 1px solid #d2d4d6;
          border-radius: 0 30px 30px 0;
          width: 66px;
          height: 41px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .search-btn:hover {
          background-color: #ededed;
        }

        .clear-search {
          position: absolute;
          left: 464px;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .clear-search:hover {
          background-color: #ededed;
        }
      `}</style>
    </div>
  );
}
