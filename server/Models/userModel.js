const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
      unique: [true, "Username already taken!"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken!"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userModel);
module.exports = User;
