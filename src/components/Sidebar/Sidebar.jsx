import { SettingsInputComponentSharp } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, List, ListItem } from "@mui/material";
import Devider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = () => {
  const [state, setstate] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    setstate({ ...state, [anchor]: open });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    window.location.href = "/";
  };
  const list = () => (
    <div style={{ width: "300px" }} role="presentation">
      <List>
        <ListItem className=" list_item_image">
          <img
            src=".././images/medical.png"
            alt=""
            className="header_logo"
            width={"150px"}
          />
        </ListItem>

        <Devider />
        <NavLink to="/dd" className="navlink">
          <ListItem className="list_item">
            <SettingsInputComponentSharp />
            <h4>Categories</h4>
          </ListItem>
        </NavLink>
        <Devider />

        <Devider />
        {/*  <NavLink to="/common-question" className="navlink">
          <ListItem className="list_item">
            <QuickreplySharp />
            <h4>Common Question</h4>
          </ListItem>
        </NavLink> 

         <NavLink to="/home" className="navlink">
          <ListItem className="list_item">
            <Home />
            <h4>Home</h4>
          </ListItem>
        </NavLink>
        */}

        <NavLink to="/addcategory" className="navlink">
          <ListItem className="list_item">
            <CategoryIcon /> {/* Replace AccountCircleIcon with CategoryIcon */}
            <h4>Add Category</h4>
          </ListItem>
        </NavLink>

        <NavLink to="/profile" className="navlink">
          <ListItem className="list_item">
            <AccountCircleIcon />{" "}
            {/* Use AccountCircleIcon for the Profile tab */}
            <h4>Profile</h4>
          </ListItem>
        </NavLink>
        <NavLink to="/" className="navlink" onClick={handleLogout}>
          <ListItem className="list_item">
            <LogoutIcon />
            <h4>Logout</h4>
          </ListItem>
        </NavLink>
      </List>
    </div>
  );

  return (
    <div>
      <>
        <IconButton onClick={toggleDrawer("left", true)}>
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          {list("left")}
        </Drawer>
      </>
    </div>
  );
};

export default Sidebar;
