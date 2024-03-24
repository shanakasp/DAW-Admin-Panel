import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import React, { useRef } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Sidebar from "../Sidebar/Sidebar";
import "./Header.css";

const Header = (props) => {
  const inputRef = useRef("");
  const location = useLocation(); // Get current location

  const passValue = () => {
    props.setSearch(inputRef.current.value);
  };

  const shouldShowSearch = location.pathname === "/dd"; // Check if the route is "/dd"

  return (
    <div className="header">
      <div className="header_info">
        <Sidebar />
        <div className="info">
          <img
            src=".././images/medical.png"
            alt=""
            className="header_logo"
            width={"120px"}
          />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {shouldShowSearch && (
          <div className="header_search">
            <IconButton>
              <SearchIcon />
            </IconButton>
            <input
              type="text"
              placeholder="Search"
              ref={inputRef}
              onChange={() => passValue()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
