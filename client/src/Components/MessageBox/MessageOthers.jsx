import React from "react";
import { useSelector } from "react-redux";

const MessageOthers = ({ props }) => {
  const lightTheme = useSelector((state) => state.themeKey);
  const createTime = props?.createdAt;
  const timestampDate = createTime ? new Date(createTime) : null;
  const timeString = timestampDate
    ? timestampDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className={"other-message-container" + (lightTheme ? "" : " dark")}>
      <div className={"conversation-card" + (lightTheme ? "" : " dark")}>
        <p className={"con-icon" + (lightTheme ? "" : " lessdark")}>
          {props.sender.username[0]}
        </p>
        <div
          className={"other-text-content" + (lightTheme ? "" : " lessdark ")}
        >
          <p className={"con-title" + (lightTheme ? "" : " lessdark")}>
            {props.sender.username}
          </p>
          <p className={"con-lastmassege" + (lightTheme ? "" : " lessdark")}>
            {props.content}
          </p>
          {timeString && (
            <p className={"self-timeStamp" + (lightTheme ? "" : " lessdark")}>
              {timeString}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageOthers;
