import React from "react";
import "../Styles/Components.css";
import Sidebar from "../Components/Sidebar";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const isLoggedIn = JSON.parse(localStorage.getItem("UserData") || null)
    ? true
    : false;
  return (
    <>
      <div
        className={
          "main-container" + (lightTheme && isLoggedIn ? "" : " dark-container")
        }
      >
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default ChatPage;
