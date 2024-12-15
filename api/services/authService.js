const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateAccessToken = (userId, username) => {
  return jwt.sign({ id: userId, username }, process.env.SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
};

const generateRefreshToken = (userId, username) => {
  return jwt.sign({ id: userId, username }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 8);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
};
