import React, { useEffect, useState } from "react";
import { Button, IconButton, ThemeProvider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/chatapi";
import { setRefresh } from "../Features/refreshSlice";
import ListHeader from "./ui/ListHeader";
import Loading from "./ui/Loading";
import NotAvailable from "./ui/NotAvailable";
import theme from "../assets/theme/theme.js";

const Groups = () => {
  const refresh = useSelector((state) => state.refreshKey);
  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();

  const [groups, setGroups] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const userData = JSON.parse(localStorage.getItem("UserData"));

  const navigate = useNavigate();

  if (!userData) {
    navigate("/");
  }

  const user = userData.data;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    api.get("/chat/fetchGroup", config).then((response) => {
      setGroups(response.data);
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
        <ListHeader title="Available Groups" />

        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <SearchIcon />
          </IconButton>
          <input
            placeholder="Search"
            className={"search-box" + (lightTheme ? "" : " dark")}
          />
        </div>

        <div className={"ug-list" + (lightTheme ? "" : " dark")}>
          {!loaded && <Loading />}
          {loaded && groups.length === 0 && (
            <NotAvailable display="No groups available" />
          )}
          {groups.map((group, index) => {
            return (
              <motion.div
                className={"list-tem" + (lightTheme ? "" : " dark")}
                key={index}
              >
                <div className="user-list-name">
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>T</p>
                  <p className={"con-title" + (lightTheme ? "" : " dark")}>
                    {group.chatName}
                  </p>
                </div>
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    color="themeColor"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: "10px" }}
                    onClick={async () => {
                      const config = {
                        headers: {
                          authorization: `Bearer ${userData.data.token}`,
                        },
                      };
                      await api.put(
                        "chat/addSelfToGroup",
                        {
                          chatId: group._id,
                          userId: userData.data._id,
                        },
                        config
                      );
                      dispatch(setRefresh(!refresh));
                    }}
                  >
                    Join
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

export default Groups;
