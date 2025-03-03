import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/chatapi";
import { useMediaQuery } from "@mui/material";
import { setRefresh } from "../Features/refreshSlice";
import { setChats, setSelectedChat } from "../Features/chatSlice";
import { AnimatePresence, motion } from "framer-motion";
import NotAvailable from "./ui/NotAvailable";
import ListHeader from "./ui/ListHeader";
import Loading from "./ui/Loading";
const MobileChats = () => {
  const matches = useMediaQuery("(min-width:40em)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  const chats = useSelector((state) => state.chatSlice.chats);
  const refresh = useSelector((state) => state.refreshKey);
  const userData = JSON.parse(localStorage.getItem("UserData") || null);
  const [loaded, setLoaded] = useState(false);
  if (!userData) {
    navigate("/");
  } else if (matches) {
    navigate("/app/chat/Welcome");
  }
  const user = userData.data;
  useEffect(() => {
    const fetchChat = async () => {
      const config = {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };
      await api.get("/chat/", config).then(({ data }) => {
        dispatch(setChats(data));
      });
      setLoaded(true);
    };
    fetchChat();
  }, [refresh, selectedChat]);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ease: "anticipate",
          duration: "0.3",
        }}
        className="list-container"
      >
        <ListHeader title="Chats" />
        <div
          className={"sb-conversations-mobile" + (lightTheme ? "" : " dark")}
        >
          {!loaded && <Loading />}
          {loaded && chats.length === 0 && (
            <NotAvailable
              display="No previous chats, go to available users and click on user to
            start chat."
            />
          )}
          {loaded &&
            chats.map((chat, index) => {
              let conName;
              if (chat.isGroupChat) {
                conName = chat.chatName;
              } else {
                conName =
                  chat.users[0]._id === user._id
                    ? chat.users[1]?.username
                    : chat.users[0].username;
              }
              if (chat.users.length === 1) {
                // if (conversation.users.length === 1) {
                //   return <div key={index}></div>;
                // } else {
                return <div key={index}></div>;
              }
              if (chat.latestMessage === undefined) {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      dispatch(setRefresh(!refresh));
                    }}
                  >
                    <div
                      key={index}
                      className={
                        "conversation-container" + (lightTheme ? "" : " dark")
                      }
                      onClick={() => {
                        dispatch(setSelectedChat(chat));
                        navigate(conName);
                      }}
                      // dispatch change to refresh so as to update chatArea
                    >
                      <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                        {conName[0]}
                      </p>
                      <p className={"con-title" + (lightTheme ? "" : " dark")}>
                        {conName}
                      </p>

                      <p
                        className={
                          "con-lastMessage" + (lightTheme ? "" : " dark")
                        }
                      >
                        No previous Messages, click here to start a new chat
                      </p>
                      {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                  {conversation.timeStamp}
                </p> */}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className={
                      "conversation-container" + (lightTheme ? "" : " dark")
                    }
                    onClick={() => {
                      dispatch(setSelectedChat(chat));
                      navigate(conName);
                    }}
                  >
                    <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                      {conName[0]}
                    </p>
                    <p className={"con-title" + (lightTheme ? "" : " dark")}>
                      {conName}
                    </p>

                    <p
                      className={
                        "con-lastMessage" + (lightTheme ? "" : " dark")
                      }
                    >
                      {chat.latestMessage.content}
                    </p>
                    {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                  {conversation.timeStamp}
                </p> */}
                  </div>
                );
              }
            })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileChats;
