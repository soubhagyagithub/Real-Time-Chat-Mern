import React from "react";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
const Welcome = () => {
  const lightTheme = useSelector((state) => state.themeKey);

  return (
    <div className={"welcome-container" + (lightTheme ? " " : " dark")}>
      <img
        src={logo}
        alt="logo"
        className={"welcom-logo" + (lightTheme ? " " : " dark")}
      />
      <p className={"welcome-text" + (lightTheme ? " " : " dark")}>
        View and chat directly to people present in the chat Rooms.
      </p>
    </div>
  );
};

export default Welcome;
