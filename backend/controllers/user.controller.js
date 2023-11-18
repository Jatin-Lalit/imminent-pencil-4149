const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const store = require("store");
const { uuidv4 } = require("../configs/uuidGenerator");
const { UserModel } = require("../models/user.model");
const { BlacklistModel } = require("../models/blacklist.model");
const { redisClient } = require("../configs/redis");

const registerUser = async (req, res) => {
  const userData = req.body;

  try {
    req.body.uniqueUserId = uuidv4();
    let alreadyPresent = await UserModel.findOne({ email: userData.email });
    if (alreadyPresent) {
      return res.status(400).send({
        msg: "User is already present. Please use a different email.",
      });
    } else {
      const hash = bcrypt.hashSync(userData.password, 4);
      userData.password = hash;
      const user = new UserModel(userData);
      await user.save();
      res.status(200).send({ msg: "New user added" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Cannot add new user" });
  }
};

const userLogin = async (req, res) => {
  const user = req.body;

  try {
    const myUser = await UserModel.findOne({ email: user.email });
    if (myUser) {
      bcrypt.compare(user.password, myUser.password, function (err, result) {
        // Token generation logic
        var token = jwt.sign({ userId: myUser._id }, process.env.TOKEN_SECRET, {
          expiresIn: "7d",
        });
        var refreshToken = jwt.sign(
          { userId: myUser._id },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "24d" }
        );
        redisClient.set("jwttoken", token);
        redisClient.set("refreshtoken", refreshToken);
        store.set("barberUser", myUser, token, refreshToken);
        res.status(200).send({
          msg: "User logged in",
          token,
          refreshToken,
          usernameforchat: myUser.name,
          userId: myUser._id,
        });
      });
    } else {
      res.status(400).send({ msg: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message || "Error logging in");
  }
};

const userLogout = async (req, res) => {
  try {
    const token = await redisClient.get("jwttoken");
    const blacklist = new BlacklistModel({ token });
    await blacklist.save();
    store.remove("barberUser");
    res.status(200).send({ msg: "Logged out" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: "Cannot logout" });
  }
};

const generateNewToken = async (req, res) => {
  const refreshToken = req.headers.authorization;

  try {
    var decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decoded) {
      var token = jwt.sign(
        { userId: decoded.userId },
        process.env.TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      redisClient.set("jwttoken", token);
      res.send({ msg: "New token generated", token });
    }
  } catch (error) {
    console.log(error);
    res.send(error.message || "Error generating new token");
  }
};

const updateUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    res.status(200).send({ msg: "User details updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal server error" });
  }
};
module.exports = {
  registerUser,
  userLogin,
  userLogout,
  generateNewToken,
  updateUserDetails,
  getAllUsers,
};
