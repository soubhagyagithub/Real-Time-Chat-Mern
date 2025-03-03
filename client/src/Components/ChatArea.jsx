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
var socket;

function ChatArea() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const inputRef = useRef(null);
  const lastTypingTime = useRef(null);
  const [groupExitStatus, setGroupExitStatus] = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  const notifications = useSelector((state) => state.chatSlice.notifications);
  const refresh = useSelector((state) => state.refreshKey);
  const userData = JSON.parse(localStorage.getItem("UserData") || "");
  const navigate = useNavigate();

  if (!userData) {
    navigate("/");
  }

  const [allMessages, setAllMessages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket", "polling"] });
    socket.emit("setup", userData);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [userData]);

  useEffect(() => {
    if (!selectedChat) {
      navigate("/app/chat/welcome");
      return;
    }

    fetchMessages();
    socket.emit("join chat", selectedChat._id);

    return () => {
      setIsTyping(false);
      socket.emit("leave chat", selectedChat._id);
    };
  }, [selectedChat, userData.data.token]);

  useEffect(() => {
    const messageListener = (newMessage) => {
      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        dispatch(setNotifications([...notifications, newMessage]));
      } else {
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
        dispatch(setRefresh(!refresh));
      }
    };

    socket.on("message received", messageListener);
    return () => {
      socket.off("message received", messageListener);
    };
  }, [selectedChat, notifications, refresh]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoaded(false);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      const { data } = await api.get("message/" + selectedChat._id, config);
      setAllMessages(data);
    } catch (error) {
      console.error(error?.message);
    } finally {
      setLoaded(true);
    }
  };

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
        { content: messageContent, chatId: selectedChat?._id },
        config
      );
      socket.emit("newMessage", data);
      setAllMessages([...allMessages, data]);
      dispatch(setRefresh(!refresh));
    } catch (error) {
      console.error(error?.message);
    }
  };

  const typingHandler = (e) => {
    setMessageContent(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    lastTypingTime.current = new Date().getTime();

    setTimeout(() => {
      let timeDiff = new Date().getTime() - lastTypingTime.current;
      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  const handleGroupExit = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };

      await api.put(
        "chat/groupExit",
        { chatId: selectedChat._id, userId: userData.data._id },
        config
      );
      setGroupExitStatus({
        msg: `You left "${selectedChat.chatName}"`,
        key: Math.random(),
      });
      dispatch(setSelectedChat(null));
    } catch (error) {
      console.error(error?.message);
      setGroupExitStatus({
        msg: "Something went wrong :/",
        key: Math.random(),
      });
    }
  };

  if (!selectedChat) {
    return groupExitStatus ? (
      <Toaster
        key={groupExitStatus.key}
        message={groupExitStatus.msg}
        type="success"
      />
    ) : (
      <Welcome />
    );
  } else if (!loaded) {
    return <ChatAreaSkeleton />;
  } else {
    let conName = selectedChat.isGroupChat
      ? selectedChat.chatName
      : selectedChat.users.find((user) => user._id !== userData.data._id)
          ?.username;

    return (
      <div className={`chat-area-container${lightTheme ? "" : " dark"}`}>
        <div className={`ca-header${lightTheme ? "" : " dark"}`}>
          <p className={`con-icon${lightTheme ? "" : " dark"}`}>{conName[0]}</p>
          <div className={`header-text${lightTheme ? "" : " dark"}`}>
            <p className={`con-title${lightTheme ? "" : " dark"}`}>{conName}</p>
            {isTyping && (
              <div>
                {selectedChat.isGroupChat ? "Someone" : conName} is typing...
              </div>
            )}
          </div>
          {selectedChat.isGroupChat &&
            selectedChat.groupAdmin?._id !== userData.data._id && (
              <Tooltip TransitionComponent={Zoom} title="Exit Group" arrow>
                <IconButton onClick={handleGroupExit}>
                  <ExitToAppIcon
                    className={`icon${lightTheme ? "" : " dark"}`}
                  />
                </IconButton>
              </Tooltip>
            )}
        </div>
        <MessageArea allMessages={allMessages} userData={userData} />
        <MessageInput
          messageContent={messageContent}
          typingHandler={typingHandler}
          sendMessage={sendMessage}
          setMessageContent={setMessageContent}
          inputRef={inputRef}
        />
      </div>
    );
  }
}

export default ChatArea;
