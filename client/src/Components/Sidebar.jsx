import React, { useEffect, useState } from "react";
import "../Styles/Components.css";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import {
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import api from "../api/chatapi";
import {
  setChats,
  setNotifications,
  setSelectedChat,
} from "../Features/chatSlice";
import { setRefresh } from "../Features/refreshSlice";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "./ui/Loading";
import theme from "../assets/theme/theme.js";
import NotAvailable from "./ui/NotAvailable.jsx";
const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "100%" },
};

const Sidebar = () => {
  const matches = useMediaQuery("(min-width:40em)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const selectedChat = useSelector((state) => state.chatSlice.selectedChat);
  const chats = useSelector((state) => state.chatSlice.chats);
  const notifications = useSelector((state) => state.chatSlice.notifications);
  const refresh = useSelector((state) => state.refreshKey);
  const userData = JSON.parse(localStorage.getItem("UserData") || null);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toggleMoreOptions, setToggleMoreOptions] = useState(false);
  const handleClick = () => {
    setToggleMoreOptions(!toggleMoreOptions);
  };
  const handleClose = () => {
    setToggleMoreOptions(!toggleMoreOptions);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  if (!userData) {
    navigate("/");
  }
  const user = userData.data;
  const handleLogout = () => {
    localStorage.removeItem("UserData");
    dispatch(setSelectedChat(null));
    navigate("/");
  };
  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("theme")) === false &&
      lightTheme === true
    ) {
      dispatch(toggleTheme());
    }
    const fetchChat = async () => {
      const config = {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };
      await api.get("chat/", config).then(({ data }) => {
        const filterChat = data.filter((chat) =>
          chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        dispatch(setChats(filterChat));
      });
      setLoaded(true);
    };
    if (matches) {
      fetchChat();
    }
  }, [refresh, selectedChat, matches, searchTerm]);

  return (
    <div className="Sidebar-area">
      <div className={"sb-header" + (lightTheme ? "" : " dark")}>
        <div>
          <Tooltip TransitionComponent={Zoom} title={user.username} arrow>
            <IconButton
              onClick={() => {
                navigate("/app/chat/welcome");
              }}
            >
              <AccountCircleSharpIcon
                className={"icon" + (lightTheme ? "" : " dark")}
              />
            </IconButton>
          </Tooltip>
        </div>
        <div className="other-icons">
          <div className="forMobile">
            <Tooltip TransitionComponent={Zoom} title="Profile" arrow>
              <IconButton
                onClick={() => {
                  navigate("/app/chat");
                }}
              >
                <ChatIcon className={"icon" + (lightTheme ? "" : " dark")} />
              </IconButton>
            </Tooltip>
          </div>

          {!toggleMoreOptions && (
            <>
              <Tooltip TransitionComponent={Zoom} title="Users" arrow>
                <IconButton
                  onClick={() => {
                    navigate("users");
                  }}
                >
                  <PersonAddIcon
                    className={"icon" + (lightTheme ? "" : " dark")}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip TransitionComponent={Zoom} title="Groups" arrow>
                <IconButton
                  onClick={() => {
                    navigate("groups");
                  }}
                >
                  <GroupAddIcon
                    className={"icon" + (lightTheme ? "" : " dark")}
                  />
                </IconButton>
              </Tooltip>

              <div>
                <ThemeProvider theme={theme}>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Notifications"
                    arrow
                  >
                    <IconButton
                      id="notification-button"
                      aria-controls={open ? "notification-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleNotificationClick}
                    >
                      <Badge
                        badgeContent={notifications.length}
                        color="themeColor"
                      >
                        <NotificationsIcon
                          className={"icon" + (lightTheme ? "" : " dark")}
                        />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </ThemeProvider>

                <Menu
                  id="notification-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleNotificationClose}
                  MenuListProps={{
                    "aria-labelledby": "notification-button",
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  {notifications.length === 0 && (
                    <MenuItem onClick={handleNotificationClose}>
                      <Typography variant="inherit" noWrap>
                        No New Messages
                      </Typography>
                    </MenuItem>
                  )}
                  {notifications.map((newMessage) => {
                    let conName;
                    if (newMessage.chat.isGroupChat) {
                      conName = newMessage.chat.chatName;
                    } else {
                      conName = newMessage.sender.username;
                    }
                    return (
                      <MenuItem
                        key={newMessage._id}
                        onClick={() => {
                          dispatch(setSelectedChat(newMessage.chat));
                          navigate(`chat/${conName}`);
                          const updateNotifications = notifications.filter(
                            (notification) =>
                              notification._id !== newMessage._id
                          );
                          dispatch(setNotifications(updateNotifications));
                          handleNotificationClose();
                        }}
                      >
                        <Typography variant="inherit" noWrap>
                          New Message in
                          <span style={{ color: "#63d7b0" }}> {conName}</span>
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Menu>
              </div>
            </>
          )}

          <AnimatePresence>
            <motion.div
              animate={toggleMoreOptions ? "open" : "closed"}
              variants={variants}
              className={
                "sb-more-options" + (toggleMoreOptions ? "" : " close")
              }
            >
              <Tooltip TransitionComponent={Zoom} title="Create group" arrow>
                <IconButton onClick={() => navigate("create-groups")}>
                  <AddCircleIcon
                    className={"icon" + (lightTheme ? "" : " dark")}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip TransitionComponent={Zoom} title="Theme" arrow>
                <IconButton
                  onClick={() => {
                    dispatch(toggleTheme());
                  }}
                >
                  {lightTheme ? (
                    <NightlightIcon
                      className={"icon" + (lightTheme ? "" : " dark")}
                    />
                  ) : (
                    <LightModeIcon
                      className={"icon" + (lightTheme ? "" : " dark")}
                    />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip TransitionComponent={Zoom} title="Logout" arrow>
                <IconButton onClick={handleLogout}>
                  <LogoutIcon
                    className={"icon" + (lightTheme ? "" : " dark")}
                  />
                </IconButton>
              </Tooltip>
            </motion.div>
          </AnimatePresence>
        </div>
        <div>
          {toggleMoreOptions ? (
            <Tooltip TransitionComponent={Zoom} title="Close" arrow>
              <IconButton onClick={handleClose}>
                <CloseRoundedIcon
                  className={"icon" + (lightTheme ? "" : " dark")}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip TransitionComponent={Zoom} title="More" arrow>
              <IconButton onClick={handleClick}>
                <MoreVertIcon
                  className={"icon" + (lightTheme ? "" : " dark")}
                />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </div>

      <div className={"sb-search" + (lightTheme ? "" : " dark")}>
        <IconButton>
          <SearchIcon className={"icon" + (lightTheme ? "" : " dark")} />
        </IconButton>

        <input
          placeholder="search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setLoaded(false);
          }}
          className={"search-box" + (lightTheme ? "" : " dark")}
        />
      </div>
      <div className={"sb-conversations" + (lightTheme ? "" : " dark")}>
        {!loaded && <Loading />}
        {loaded && chats.length === 0 && (
          <div style={{ padding: "20px" }}>
            <NotAvailable
              display="No previous chats, go to available users and click on user to start
          chat."
            />
          </div>
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
                      navigate(`chat/${conName}`);
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
                    navigate(`chat/${conName}`);
                  }}
                >
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                    {conName[0]}
                  </p>
                  <p className={"con-title" + (lightTheme ? "" : " dark")}>
                    {conName}
                  </p>

                  <p
                    className={"con-lastMessage" + (lightTheme ? "" : " dark")}
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
    </div>
  );
};

export default Sidebar;
