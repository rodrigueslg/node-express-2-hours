const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/userController");

const router = express.Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get("/current", validateToken, getCurrentUser);

module.exports = router;
