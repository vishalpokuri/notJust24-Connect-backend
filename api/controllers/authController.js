const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
} = require("../services/authService");

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    //Changed major flaw
    const otpToken = jwt.sign(
      { email, password, otp },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "[Connect] Verify your Connect account",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .email-header {
      text-align: center;
      background-color: #4caf50;
      color: #ffffff;
      padding: 10px 0;
      border-radius: 8px 8px 0 0;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      text-align: center;
    }
    .otp-code {
      font-size: 28px;
      font-weight: bold;
      color: #4caf50;
      margin: 20px 0;
    }
    .email-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4caf50;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
    }
    .button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to Connect!</h1>
    </div>
    <div class="email-body">
      <p>We’re thrilled to have you here! Use the OTP below to verify your account:</p>
      <div class="otp-code">${otp}</div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      
    </div>
    <div class="email-footer">
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log("Error sending mail", e);
    }
    res.status(200).json({ message: "OTP sent to your email", otpToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    throw error;
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      return res.status(500).json({
        message: "User doesnt exist, create an account first",
      });
    }
    //TODO: OTP console removal
    if (existingUser && !comparePassword(password, existingUser.password)) {
      return res.status(500).json({
        message: "Email and Password combination didnt match",
      });
    }
  } catch (err) {
    console.log(err);
  }
  const otp = crypto.randomInt(100000, 999999).toString();
  
  try {
    //Changed major flaw
    const otpToken = jwt.sign(
      { email, password, otp },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "[Connect] Verify your Connect account",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .email-header {
      text-align: center;
      background-color: #4caf50;
      color: #ffffff;
      padding: 10px 0;
      border-radius: 8px 8px 0 0;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      text-align: center;
    }
    .otp-code {
      font-size: 28px;
      font-weight: bold;
      color: #4caf50;
      margin: 20px 0;
    }
    .email-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4caf50;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
    }
    .button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to Connect!</h1>
    </div>
    <div class="email-body">
      <p>We’re thrilled to have you here! Use the OTP below to verify your account:</p>
      <div class="otp-code">${otp}</div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      
    </div>
    <div class="email-footer">
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log("Error sending mail", e);
    }
    res.status(200).json({ message: "OTP sent to your email", otpToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    throw error;
  }
};

exports.resendOTP = async (req, res) => {
  const { otpToken } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.SECRET_KEY);

    const otp = crypto.randomInt(100000, 999999).toString();
    const newOtpToken = jwt.sign(
      { email: decoded.email, password: decoded.password, otp },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: decoded.email,
      subject: "[Connect] Verify your Connect account",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .email-header {
      text-align: center;
      background-color: #4caf50;
      color: #ffffff;
      padding: 10px 0;
      border-radius: 8px 8px 0 0;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      text-align: center;
    }
    .otp-code {
      font-size: 28px;
      font-weight: bold;
      color: #4caf50;
      margin: 20px 0;
    }
    .email-footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      background-color: #4caf50;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
    }
    .button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to Connect!</h1>
    </div>
    <div class="email-body">
      <p>We’re thrilled to have you here! Use the OTP below to verify your account:</p>
      <div class="otp-code">${otp}</div>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      
    </div>
    <div class="email-footer">
      <p>If you didn’t request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Resent OTP to your email",
      otpToken: newOtpToken,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Unable to resend OTP" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { otp, otpToken } = req.body;

  try {
    const decoded = jwt.verify(otpToken, process.env.SECRET_KEY);

    if (decoded.otp === otp) {
      const existingUser = await User.findOne({ email: decoded.email });

      if (existingUser) {
        const accessToken = generateAccessToken(existingUser._id);
        const refreshToken = generateRefreshToken(existingUser._id);

        if (existingUser.onboardingLevel > 3) {
          return res.status(200).json({
            message: "User fully signed up, redirect to login",
            level: existingUser.onboardingLevel,
            accessToken,
            refreshToken,
            userId: existingUser._id,
          });
        }

        return res.status(200).json({
          message: "User already exists, sending onboarding level",
          level: existingUser.onboardingLevel,
          accessToken,
          refreshToken,
          userId: existingUser._id,
        });
      }

      const newUser = new User({
        email: decoded.email,
        password: hashPassword(decoded.password),
        onboardingLevel: 1,
      });

      await newUser.save();

      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);

      res.status(201).json({
        message: "User registered successfully",
        userId: newUser._id,
        accessToken,
        refreshToken,
        level: 1,
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: `Invalid or expired OTP token: ${error}` });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !comparePassword(password, user.password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      userId: user._id,
      accessToken,
      refreshToken,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No refresh token provided",
      needsLogin: true,
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid refresh token",
        needsLogin: true,
      });
    }

    const newAccessToken = generateAccessToken(decoded.id);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
