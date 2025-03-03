const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");
const Router = express.Router();

Router.route("/:chatId").get(protect, allMessages);
Router.route("/").post(protect, sendMessage);

module.exports = Router;
