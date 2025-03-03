import React, { useEffect, useRef, useState } from "react";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import { Button, IconButton, ThemeProvider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/chatapi";
import "../Styles/Components.css";
import { setRefresh } from "../Features/refreshSlice";
import Pill from "./ui/Pill";
import { motion } from "framer-motion";
import ListHeader from "./ui/ListHeader";
import Loading from "./ui/Loading";
import theme from "../assets/theme/theme.js";
import NotAvailable from "./ui/NotAvailable.jsx";
import CreateGroupModal from "./ui/CreateGroupModal.jsx";

const CreateGroup = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const refresh = useSelector((state) => state.refreshKey);
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!userData) {
    navigate("/");
  }
  const user = userData.data;

  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loaded, setloaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedMembersSet, setSelectedMembersSet] = useState(new Set());

  const inputRef = useRef();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createGroup = async () => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    if (selectedMembers.length > 0 && groupName !== "") {
      await api.post(
        "/chat/createGroup",
        {
          name: groupName,
          users: selectedMembers,
        },
        config
      );
      dispatch(setRefresh(!refresh));
      navigate("/app/groups");
    }
  };

  const handleSelectMembers = (selectedMember) => {
    setSelectedMembers([...selectedMembers, selectedMember]);
    setSelectedMembersSet(new Set([...selectedMembersSet, selectedMember._id]));
    setSearchTerm("");
    inputRef.current.focus();
  };

  const handleRemoveUser = (userRemove) => {
    const updatedMembers = selectedMembers.filter(
      (selectedMember) => selectedMember._id !== userRemove._id
    );
    setSelectedMembers(updatedMembers);
    const updatedId = new Set(selectedMembersSet);
    updatedId.delete(userRemove._id);
    setSelectedMembersSet(updatedId);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedMembers.length > 0
    ) {
      const lastMember = selectedMembers[selectedMembers.length - 1];
      handleRemoveUser(lastMember);
    }
  };

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    api.get("user/fetchUsers", config).then((response) => {
      const searchUsers = response.data.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(searchUsers);
      setloaded(true);
    });
  }, [refresh, searchTerm]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ease: "anticipate",
          duration: "0.3",
        }}
        className={"list-container" + (lightTheme ? "" : " dark")}
      >
        <ListHeader title="Create Group" />

        <div className={"createGroup-box" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Enter Group Name"
            className={"search-box" + (lightTheme ? "" : " dark")}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              handleClickOpen();
            }}
            disabled={selectedMembers.length === 0 || groupName === ""}
          >
            <DoneOutlineRoundedIcon />
          </IconButton>
        </div>

        <div className={"cg-search" + (lightTheme ? "" : " dark")}>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <SearchIcon />
          </IconButton>
          {selectedMembers.map((selectedMember) => {
            return (
              <Pill
                key={selectedMember._id}
                text={selectedMember.username}
                onClick={() => handleRemoveUser(selectedMember)}
              />
            );
          })}
          <input
            placeholder="Add members"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            value={searchTerm}
            className={"cg-search-box" + (lightTheme ? "" : " dark")}
          />
        </div>

        <div className={"ug-list" + (lightTheme ? "" : " dark")}>
          {!loaded && <Loading />}
          {loaded && users.length === 0 && (
            <NotAvailable display="No users available" />
          )}
          {loaded &&
            users.map((user) => {
              return !selectedMembersSet.has(user._id) ? (
                <div
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
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: "10px" }}
                      onClick={() => handleSelectMembers(user)}
                    >
                      Add
                    </Button>
                  </ThemeProvider>
                </div>
              ) : (
                <></>
              );
            })}
        </div>
      </motion.div>
      <CreateGroupModal
        open={open}
        handleClose={handleClose}
        groupName={groupName}
        createGroup={createGroup}
      />
    </>
  );
};

export default CreateGroup;
