import React from "react";
import NotAvailable from "./ui/NotAvailable";
import MessageSelf from "./MessageBox/MessageSelf";
import MessageOthers from "./MessageBox/MessageOthers";
import { useSelector } from "react-redux";

const MessageArea = ({ allMessages, userData }) => {
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <>
      <div className={"ca-message-area" + (lightTheme ? "" : " dark")}>
        {allMessages.length === 0 && (
          <NotAvailable display="No previous Messages, start a new chat" />
        )}

        {allMessages
          .slice(0)
          .reverse()
          .map((message, index) => {
            const sender = message.sender;
            const self_id = userData.data._id;
            if (sender._id === self_id) {
              return <MessageSelf props={message} key={index} />;
            } else {
              return <MessageOthers props={message} key={index} />;
            }
          })}
        {/* {messagesEndRef.current?.scrollHeight >
            messagesEndRef.current?.clientHeight && (
            <IconButton className="down-btn" onClick={scrollToBottom}>
              <ExpandCircleDownIcon
                className={"icon" + (lightTheme ? "" : " dark")}
              />
            </IconButton>
          )} */}
      </div>
    </>
  );
};

export default MessageArea;
