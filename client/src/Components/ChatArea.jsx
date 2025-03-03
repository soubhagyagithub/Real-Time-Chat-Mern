import React, { useEffect, useRef, useState } from "react";
import { IconButton, Tooltip, Zoom } from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/chatapi";
import { io } from "socket.io-client";
import { setRefresh } from "../Features/refreshSlice";
import Welcome from "./ui/Welcome";
import { setNotifications, setSelectedChat } from "../Features/chatSlice";
import Toaster from "./ui/Toaster";
import ChatAreaSkeleton from "./ui/ChatAreaSkeleton";
import MessageArea from "./MessageArea";
import MessageInput from "./MessageInput";

const ENDPOINT = "https://real-time-chat-backend-five.vercel.app/";
var socket, selectedChatCompare;
function ChatArea() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const inputRef = useRef(null);
  const [groupExitStatus, setGroupExitStatus] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  const notifications = useSelector((state) => state.chatSlice.notifications);
  // const messagesEndRef = useRef(null);
  const refresh = useSelector((state) => state.refreshKey);
  const userData = JSON.parse(localStorage.getItem("UserData") || "");
  const navigate = useNavigate();
  if (!userData) {
    navigate("/");
  }
  const [allMessages, setAllMessages] = useState([]);
  const [loaded, setloaded] = useState(false);

  // Fetching messages
  const fetchMessages = async () => {
    if (!selectedChat) return;
    setloaded(false);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };

      const { data } = await api.get("message/" + selectedChat?._id, config);
      setAllMessages(data);
    } catch (error) {
      console.error(error?.message);
    } finally {
      setloaded(true);
    }
  };

  // Sending messages
  const sendMessage = async () => {
    try {
      socket.emit("stop typing", selectedChat?._id);
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      const { data } = await api.post(
        "message/",
        {
          content: messageContent,
          chatId: selectedChat?._id,
        },
        config
      );
      socket.emit("newMessage", data);
      setAllMessages([...allMessages, data]);
      dispatch(setRefresh(!refresh));
    } catch (error) {
      console.error(error?.message);
    }
  };

  // Handle typing
  const typingHandler = (e) => {
    setMessageContent(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();

    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDiff = currentTime - lastTypingTime;
      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  // Exit from group
  const HandleGroupExit = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };

      await api.put(
        "chat/groupExit",
        {
          chatId: selectedChat._id,
          userId: userData.data._id,
        },
        config
      );
      setGroupExitStatus({
        msg: `You have successfully left the group "${selectedChat.chatName}"`,
        key: Math.random(),
      });
      dispatch(setSelectedChat(null));
    } catch (error) {
      setGroupExitStatus({
        msg: `Something went wrong :/`,
        key: Math.random(),
      });
      console.error(error?.message);
    }
  };
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  // };
  // connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  // focus on input field
  useEffect(() => {
    inputRef.current?.focus();
  }, [loaded]);

  //fetch chats
  useEffect(() => {
    if (!selectedChat || selectedChat === null) {
      navigate("/app/chat/welcome");
    }
    fetchMessages();
    socket.emit("join chat", selectedChat?._id);
    selectedChatCompare = selectedChat?._id;
    inputRef.current?.focus();
    return () => {
      setIsTyping(false);
      socket.emit("leave chat", selectedChat?._id);
    };
    // scrollToBottom();
  }, [selectedChat, userData.data.token]);

  // new message received
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!selectedChatCompare || selectedChatCompare !== newMessage.chat._id) {
        // notification logic will go here
        dispatch(setNotifications([...notifications, newMessage]));
      } else {
        const updatedMessages = [...allMessages, newMessage];
        setAllMessages(updatedMessages);
        dispatch(setRefresh(!refresh));
      }
    });
  });

  if (!selectedChat) {
    return (
      <>
        {groupExitStatus ? (
          <Toaster
            key={groupExitStatus.key}
            message={groupExitStatus.msg}
            type="success"
          />
        ) : (
          <></>
        )}
        <Welcome />
      </>
    );
  } else if (!loaded) {
    return <ChatAreaSkeleton />;
  } else {
    let conName;
    if (selectedChat.isGroupChat) {
      conName = selectedChat.chatName;
    } else {
      conName =
        selectedChat.users[0]._id === userData.data._id
          ? selectedChat.users[1]?.username
          : selectedChat.users[0].username;
    }
    return (
      <div className={"chat-area-container" + (lightTheme ? "" : " dark")}>
        <div className={"ca-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {conName[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {conName}
            </p>
            {isTyping &&
              (selectedChat.isGroupChat ? (
                <div>Someone is typing...</div>
              ) : (
                <div>{conName} is typing...</div>
              ))}
          </div>
          {selectedChat.isGroupChat &&
          !(
            selectedChat?.groupAdmin?._id?.toString() ===
            userData.data._id.toString()
          ) ? (
            <Tooltip TransitionComponent={Zoom} title="Exit Group" arrow>
              <IconButton onClick={HandleGroupExit}>
                <ExitToAppIcon
                  className={"icon" + (lightTheme ? "" : " dark")}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
        </div>
        {/* Message area */}
        <MessageArea allMessages={allMessages} userData={userData} />
        {/* Message input */}
        <MessageInput
          messageContent={messageContent}
          typingHandler={typingHandler}
          sendMessage={sendMessage}
          setMessageContent={setMessageContent}
          inputRef={inputRef}
          refresh={refresh}
        />
      </div>
    );
  }
}

export default ChatArea;
