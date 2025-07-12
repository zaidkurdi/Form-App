const jwt = require("jsonwebtoken");

const authinticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

module.exports = authinticate;
