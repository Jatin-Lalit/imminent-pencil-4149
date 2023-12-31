const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const { redisClient } = require("../configs/redis");
const { BlacklistModel } = require("../models/blacklist.model");
const store = require("store"); // for cross browser local storage
const { uuidv4 } = require("../configs/uuidGenerator");
const { authMiddleware } = require("../middlewares/authMiddleware.middleware");
const {
  registerUser,
  userLogin,
  userLogout,
  generateNewToken,
  updateUserDetails,
  getAllUsers,
  resetPassword,
  saveNewPassword,
  verifyOtp,
} = require("../controllers/user.controller");
// const cors =  require("cors")

require("dotenv").config();

const userRouter = express();

userRouter.use(express.json());
userRouter.post("/login", userLogin);

userRouter.post("/register", registerUser);

userRouter.get("/resetUserPassword", authMiddleware, resetPassword);

userRouter.post("/saveNewPassword", authMiddleware, saveNewPassword);

userRouter.post("/verifyOtp", authMiddleware, verifyOtp);

userRouter.post("/logout", authMiddleware, userLogout);

userRouter.get("/newtoken", authMiddleware, generateNewToken);

userRouter.patch("/update/:id", authMiddleware, updateUserDetails);

userRouter.get("/get", getAllUsers);
