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
  verifyRefreshToken,
} = require("../services/authService");

const test = "testconnectapp@gmail.com";
exports.signup = async (req, res) => {
  const { email, password } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  if (email == test) {
    otp = 123456;
  }

  try {
    //Changed major flaw
    const otpToken = jwt.sign(
      { email, password, otp },
      process.env.SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );
    if (email == test) {
      console.log(otp);
      return res
        .status(200)
        .json({ message: "OTP sent to your email", otpToken });
    }

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
      res.status(200).json({ message: "OTP sent to your email", otpToken });
      console.log(otp);
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log("Error sending mail", e);
    }
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
      subject: "[Connect] Verify your account",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f7f7f7; padding: 40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px; width: 100%; margin: 0 auto;">
          <tr>
            <td>
              <!-- Main Content Container -->
              <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <!-- Logo Section -->
                <div style="padding: 32px 0; text-align: center; background: linear-gradient(135deg, #2563eb, #1d4ed8);">
                  <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Connect</h1>
                </div>
                
                <!-- Content Section -->
                <div style="padding: 40px 48px; text-align: center;">
                  <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Verify your email address</h2>
                  
                  <p style="margin: 0 0 32px 0; color: #4b5563; font-size: 16px; line-height: 24px;">
                    To complete your account setup, please enter the verification code below:
                  </p>
                  
                  <!-- OTP Container -->
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 0 auto 32px auto; max-width: 280px;">
                    <div style="font-family: monospace; font-size: 32px; font-weight: 700; color: #1d4ed8; letter-spacing: 4px;">
                      ${otp}
                    </div>
                  </div>
                  
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px;">
                    This code will expire in 10 minutes for security purposes.
                  </p>
                </div>
                
                <!-- Footer Section -->
                <div style="padding: 24px 48px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px; text-align: center;">
                    If you didn't request this code, you can safely ignore this email.
                  </p>
                </div>
              </div>
              
              <!-- Footer Links -->
              <div style="text-align: center; padding: 24px 0 0 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px;">
                  © 2025 Connect. All rights reserved.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    };

    try {
      res.status(200).json({ message: "OTP sent to your email", otpToken });
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log("Error sending mail", e);
    }
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
      subject: "[Connect] Verify your account",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7; -webkit-font-smoothing: antialiased;">
  <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #f7f7f7; padding: 40px 0;">
    <tr>
      <td>
        <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px; width: 100%; margin: 0 auto;">
          <tr>
            <td>
              <!-- Main Content Container -->
              <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <!-- Logo Section -->
                <div style="padding: 32px 0; text-align: center; background: linear-gradient(135deg, #2563eb, #1d4ed8);">
                  <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 600;">Connect</h1>
                </div>
                
                <!-- Content Section -->
                <div style="padding: 40px 48px; text-align: center;">
                  <h2 style="margin: 0 0 24px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Verify your email address</h2>
                  
                  <p style="margin: 0 0 32px 0; color: #4b5563; font-size: 16px; line-height: 24px;">
                    To complete your account setup, please enter the verification code below:
                  </p>
                  
                  <!-- OTP Container -->
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 0 auto 32px auto; max-width: 280px;">
                    <div style="font-family: monospace; font-size: 32px; font-weight: 700; color: #1d4ed8; letter-spacing: 4px;">
                      ${otp}
                    </div>
                  </div>
                  
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px;">
                    This code will expire in 10 minutes for security purposes.
                  </p>
                </div>
                
                <!-- Footer Section -->
                <div style="padding: 24px 48px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px; text-align: center;">
                    If you didn't request this code, you can safely ignore this email.
                  </p>
                </div>
              </div>
              
              <!-- Footer Links -->
              <div style="text-align: center; padding: 24px 0 0 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px;">
                  © 2025 Connect. All rights reserved.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
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
