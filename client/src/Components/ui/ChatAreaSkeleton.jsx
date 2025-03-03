import { Skeleton } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const ChatAreaSkeleton = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <>
      <div className="ca-skeleton">
        <Skeleton
          variant="rectangular"
          sx={{ width: "98%", borderRadius: "10px" }}
          height={60}
          className={lightTheme ? "" : "dark"}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "98%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
          className={lightTheme ? "" : "dark"}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "98%",
            borderRadius: "10px",
          }}
          height={60}
          className={lightTheme ? "" : "dark"}
        />
      </div>
    </>
  );
};

export default ChatAreaSkeleton;
