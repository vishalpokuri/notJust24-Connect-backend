const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Remove dotenv config as Vercel handles env variables differently
// require("dotenv").config();

const {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
} = require("../services/authService");

// Helper function to verify environment variables
const verifyEnvVariables = () => {
  const required = ["SECRET_KEY", "NODEMAILER_EMAIL", "NODEMAILER_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

// Helper function to create transporter with error handling
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  } catch (error) {
    console.error("Error creating mail transporter:", error);
    throw new Error("Failed to initialize email service");
  }
};

exports.signup = async (req, res) => {
  try {
    verifyEnvVariables();

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    // Use explicit number for expiresIn and add algorithm specification
    const otpToken = jwt.sign(
      { email, password, otp },
      process.env.SECRET_KEY,
      {
        expiresIn: 600,
        algorithm: "HS256",
      }
    );

    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "[Connect] Verify your Connect account",
      html: `<!DOCTYPE html>
      // ... (your existing email template HTML)
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        message: "OTP sent to your email",
        otpToken,
        debug: process.env.NODE_ENV === "development" ? { otp } : undefined,
      });
    } catch (e) {
      console.error("Error sending mail:", e);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    verifyEnvVariables();

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User doesn't exist, create an account first",
      });
    }

    if (!comparePassword(password, existingUser.password)) {
      return res.status(401).json({
        message: "Email and Password combination didn't match",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const otpToken = jwt.sign(
      { email, password, otp },
      process.env.SECRET_KEY,
      {
        expiresIn: 600,
        algorithm: "HS256",
      }
    );

    const transporter = createTransporter();
    // ... (rest of the signin email sending logic)

    return res.status(200).json({
      message: "OTP sent to your email",
      otpToken,
      debug: process.env.NODE_ENV === "development" ? { otp } : undefined,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp, otpToken } = req.body;
    if (!otp || !otpToken) {
      return res.status(400).json({ message: "OTP and token are required" });
    }

    const decoded = jwt.verify(otpToken, process.env.SECRET_KEY, {
      algorithms: ["HS256"],
    });

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ... (rest of your verification logic)
  } catch (error) {
    console.error("OTP verification error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "OTP token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid OTP token" });
    }
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
