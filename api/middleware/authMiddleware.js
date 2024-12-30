const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  verifyRefreshToken,
  generateAccessToken,
} = require("../services/authService");
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({
        message: "No token provided",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded.id;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        const refreshToken = req.headers["x-refresh-token"];

        if (!refreshToken) {
          return res.status(401).json({
            message: "Access token expired and no refresh token provided",
            needsRefresh: true,
          });
        }

        const refreshDecoded = verifyRefreshToken(refreshToken);

        if (!refreshDecoded) {
          return res.status(401).json({
            message: "Invalid refresh token",
            needsLogin: true,
          });
        }
        // Generate new access token
        const newAccessToken = generateAccessToken(refreshDecoded.id);

        // Attach new token to response headers
        res.setHeader("X-New-Access-Token", newAccessToken);

        req.userId = refreshDecoded.id;
        return next();
      }
      return res.status(401).json({
        message: "Invalid token",
        needsLogin: true,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = verifyToken;
