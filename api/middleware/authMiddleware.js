const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    if (decoded.id) {
      req.userId = decoded.id;
      return next();
    } else {
      res.status(403).json({
        message: "userId unable to decode",
      });
    }
  });
};

module.exports = verifyToken;
