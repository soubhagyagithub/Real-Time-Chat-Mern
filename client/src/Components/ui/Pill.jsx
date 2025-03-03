import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSelector } from "react-redux";

const Pill = ({ text, onClick }) => {
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <span
      className={"user-pill" + (lightTheme ? "" : " dark")}
      onClick={onClick}
    >
      <span>{text}</span>
      <CloseRoundedIcon fontSize="extraSmall" />
    </span>
  );
};

export default Pill;
