const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

//@desc login a user
//@route POST user/login
//@access public
const loginController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // check for all fields
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //find user with username
  const user = await User.findOne({ username });

  if (!user) {
    res.status(401);
    throw new Error("Invalid username or password");
  }
  const result = await bcrypt.compare(password, user.password);
  if (result) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

//@desc Register a user
//@route POST /user/register
//@access public
const registerController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //check for all fields
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //check for pre-existing user
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(405);
    throw new Error("Email is already taken");
  }

  //check for existing username
  const userNameExist = await User.findOne({ username });
  if (userNameExist) {
    res.status(406);
    throw new Error("Username is already taken");
  }

  //hashing password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  // create an entry in the db
  const user = await User.create({ username, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Registration Error");
  }
});

//@desc Register a user
//@route POST /user/register
//@access public
const fetchUsersController = asyncHandler(async (req, res) => {
  console.log(req.query.keyword);
  const keyword = req.query.search
    ? {
        $or: [
          {
            username: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});
module.exports = { loginController, registerController, fetchUsersController };
