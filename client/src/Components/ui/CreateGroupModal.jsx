import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const CreateGroupModal = ({ open, handleClose, groupName, createGroup }) => {
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          className={lightTheme ? "" : " dark"}
        >
          {`Do you want to create a group "${groupName}"`}
        </DialogTitle>
        <DialogContent className={lightTheme ? "" : " dark"}>
          <DialogContentText
            id="alert-dialog-description"
            className={lightTheme ? "" : " dark"}
          >
            This will create a create group in which you will be the admin and
            other will be able to join this group.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={lightTheme ? "" : " dark"}>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => {
              createGroup();
              handleClose();
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateGroupModal;
