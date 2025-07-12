const User = require("../models/userModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const salt = 10;

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(200).json({
        message: "user not found",
        success: false,
      });
    }

    const passwordCheck = await bcrypt.compare(password, existingUser.password);

    if (!passwordCheck) {
      return res.status(200).json({
        message: "wrong password",
        success: false,
      });
    }

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    existingUser.refreshToken = refreshToken;
    existingUser.save();

    return res.status(200).json({
      message: "login successful",
      success: true,
      user: existingUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        message: "user already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    return res.status(200).json({
      message: "user created",
      success: true,
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const home = (req, res) => {
  try {
    res.json({
      message: "hello",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const user = await User.findById(payload.userId);

    if (!user || user.refreshToken !== refreshToken) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh token verification failed:", err.message);
    res.sendStatus(403);
  }
};

module.exports = { login, signup, home, refresh };
