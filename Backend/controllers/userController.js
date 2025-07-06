const User = require("../models/userModel");
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

    return res.status(200).json({
      message: "login successful",
      success: true,
      user: existingUser
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

    await newUser.save();

    return res.status(200).json({
      message: "user created",
      success: true,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = { login, signup };
