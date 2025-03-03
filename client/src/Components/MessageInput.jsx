import React from "react";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { setRefresh } from "../Features/refreshSlice";
const MessageInput = ({
  messageContent,
  typingHandler,
  sendMessage,
  setMessageContent,
  inputRef,
  refresh,
}) => {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <>
      <div className={"ca-text-input" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Type a Message"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={messageContent}
          onChange={typingHandler}
          onKeyDown={(event) => {
            if (event.code == "Enter") {
              sendMessage();
              setMessageContent("");
              dispatch(setRefresh(!refresh));
            }
          }}
          ref={inputRef}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={() => {
            sendMessage();
            setMessageContent("");
            dispatch(setRefresh(!refresh));
          }}
        >
          <SendIcon />
        </IconButton>
      </div>
    </>
  );
};

export default MessageInput;
