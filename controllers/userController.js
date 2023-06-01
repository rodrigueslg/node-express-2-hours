const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Register a user
//@route GET /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed passowrd: ", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log(`User created ${user}`);
  if (!user) {
    res.status(400);
    throw new Error("User data is not valid");
  }

  res.status(201).json({ _id: user._id, email: user.email });
});

//@desc Login user
//@route GET /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //compare password with hashed password
  const user = await User.findOne({ email });
  if (user && !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Email or password is not valid");
  }

  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  res.status(200).json({
    accessToken,
  });
});

//@desc Current user info
//@route GET /api/users/current
//@access private
const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current user information" });
});

module.exports = { registerUser, loginUser, getCurrentUser };
