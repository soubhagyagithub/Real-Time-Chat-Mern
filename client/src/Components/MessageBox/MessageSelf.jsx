import React from "react";

const MessageSelf = ({ props }) => {
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
    <div className="self-message-container">
      <div className="messageBox">
        <p className="con-lastmassege" style={{ color: "black" }}>
          {props.content}
        </p>
        {timeString && <p className="self-timeStamp">{timeString}</p>}
      </div>
    </div>
  );
};

export default MessageSelf;
