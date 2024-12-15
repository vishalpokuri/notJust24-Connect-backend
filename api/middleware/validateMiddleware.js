const { signupSchema } = require("../validators/authValidator");

const validateSignup = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (e) {
    res.status(400).json(e);
  }
};

module.exports = { validateSignup };
