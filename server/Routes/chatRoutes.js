const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChat,
  fetchGroup,
  createGroupChat,
  groupExit,
  addSelfToGroup,
} = require("../controllers/chatController");

const Router = express.Router();

Router.route("/").post(protect, accessChat);
Router.route("/").get(protect, fetchChat);
Router.route("/createGroup").post(protect, createGroupChat);
Router.route("/fetchGroup").get(protect, fetchGroup);
Router.route("/groupExit").put(protect, groupExit);
Router.route("/addSelfToGroup").put(protect,addSelfToGroup);
module.exports = Router;
