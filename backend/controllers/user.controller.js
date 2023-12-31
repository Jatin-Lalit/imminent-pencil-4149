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
      return res.status(400).json({
        message: "User is already present. Please use a different email.",
        success: false,
      });
    } else {
      const hash = bcrypt.hashSync(userData.password, 4);
      userData.password = hash;
      const user = new UserModel(userData);
      await user.save();
      return res.status(200).json({ message: "New user added", success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Cannot add new user",
      success: false,
      error: error.message,
    });
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
        return res.status(200).json({
          message: "User logged in",
          token,
          refreshToken,
          usernameforchat: myUser.name,
          userId: myUser._id,
          success: true,
        });
      });
    } else {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message || "Error logging in",
      success: false,
    });
  }
};

const userLogout = async (req, res) => {
  try {
    const token = await redisClient.get("jwttoken");
    const blacklist = new BlacklistModel({ token });
    await blacklist.save();
    store.remove("barberUser");
    return res.status(200).json({ message: "Logged out", success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Cannot logout", success: false });
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
      return res.status(200).json({
        message: "New token generated",
        token,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Error generating new token",
      success: false,
    });
  }
};

const updateUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndUpdate(id, req.body);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User details updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({ users, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const resetToken = generateResetToken(); // Replace with your reset token generation logic

    await sendResetToken(user.email, resetToken); // Replace with logic to send reset token via email or SMS

    user.resetToken = resetToken;
    await user.save();

    return res.status(200).json({
      message: "Password reset link sent successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const saveNewPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const hash = bcrypt.hashSync(newPassword, 4);
    user.password = hash;
    await user.save();

    return res.status(200).json({
      message: "New password saved successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    user.otp = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  registerUser,
  userLogin,
  userLogout,
  generateNewToken,
  updateUserDetails,
  getAllUsers,
  resetPassword,
  saveNewPassword,
  verifyOtp,
};
