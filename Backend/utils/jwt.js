const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: "1m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
