import React from "react";
import { setRefresh } from "../../Features/refreshSlice";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton } from "@mui/material";
const ListHeader = ({ title }) => {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const refresh = useSelector((state) => state.refreshKey);
  return (
    <>
      <div className={"ug-header" + (lightTheme ? "" : " dark")}>
        <img
          src={logo}
          style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
        />
        <p className={"ug-title" + (lightTheme ? "" : " dark")}>{title}</p>
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={() => {
            dispatch(setRefresh(!refresh));
          }}
        >
          <RefreshIcon />
        </IconButton>
      </div>
    </>
  );
};

export default ListHeader;
