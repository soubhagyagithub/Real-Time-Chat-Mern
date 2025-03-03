import React, { useEffect, useState } from "react";
import { Button, IconButton, ThemeProvider } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import api from "../api/chatapi";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRefresh } from "../Features/refreshSlice";

import { setSelectedChat } from "../Features/chatSlice";
import ListHeader from "./ui/ListHeader";
import Loading from "./ui/Loading";
import NotAvailable from "./ui/NotAvailable";
import theme from "../assets/theme/theme.js";

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);

  const refresh = useSelector((state) => state.refreshKey);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("UserData") || "");
  const [loaded, setLoaded] = useState(false);
  if (!userData) {
    navigate(-1);
  }
  useEffect(() => {
    const config = {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${userData.data.token}`,
      },
    };
    api.get("user/fetchUsers", config).then((response) => {
      setUsers(response.data);
      setLoaded(true);
    });
  }, [refresh]);

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
        <ListHeader title="Available Users" />
        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <IconButton className="icon">
            <SearchIcon />
          </IconButton>
          <input
            placeholder="Search"
            className={"search-box" + (lightTheme ? "" : " dark")}
          />
        </div>
        <div className={"ug-list" + (lightTheme ? "" : " dark")}>
          {!loaded && <Loading />}
          {loaded && users.length === 0 && (
            <NotAvailable display="No users available" />
          )}
          {loaded &&
            users.map((user) => {
              return (
                <motion.div
                  className={"list-tem" + (lightTheme ? "" : " dark")}
                  key={user._id}
                >
                  <div
                    className={"user-list-name" + (lightTheme ? "" : " dark")}
                  >
                    <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                      {user.username[0]}
                    </p>
                    <p
                      className={"con-title" + (lightTheme ? "" : " dark")}
                      style={{ marginLeft: "10px" }}
                    >
                      {user.username}
                    </p>
                  </div>
                  <ThemeProvider theme={theme}>
                    <Button
                      variant="contained"
                      color="themeColor"
                      endIcon={<SendRoundedIcon />}
                      sx={{ borderRadius: "10px" }}
                      onClick={async () => {
                        const config = {
                          headers: {
                            authorization: `Bearer ${userData.data.token}`,
                          },
                        };
                        const { data } = await api.post(
                          "chat/",
                          {
                            userId: user._id,
                          },
                          config
                        );

                        console.log(data);
                        let conName;
                        if (data.isGroupChat) {
                          conName = data.chatName;
                        } else {
                          conName =
                            data.users[0]._id === userData.data._id
                              ? data.users[1]?.username
                              : data.users[0].username;
                        }
                        dispatch(setRefresh(!refresh));
                        dispatch(setSelectedChat(data));
                        navigate(`../chat/${conName}`);
                      }}
                    >
                      Start chat
                    </Button>
                  </ThemeProvider>
                </motion.div>
              );
            })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Users;
