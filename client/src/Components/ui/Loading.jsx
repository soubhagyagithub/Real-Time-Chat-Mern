import { CircularProgress } from "@mui/material";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="progress-container">
        <CircularProgress color="inherit" />
      </div>
    </>
  );
};

export default Loading;
