require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/authMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");
const userSelfieRoutes = require("./routes/userSelfieRoutes");
const userDataRoutes = require("./routes/userDataRoutes");
const app = express();
const presignedURLroutes = require("./routes/generatePresignedURL");
connectDB();

app.use(
  cors({
    origin: "*",
  })
);
// hello {-_-}
app.use(bodyParser.json());

app.use("/api/aws", presignedURLroutes);
app.use("/api/auth", authRoutes);
app.use("/api/sociallinks", socialMediaRoutes);
app.use("/api/userphoto", userSelfieRoutes);
app.use("/api/userData", userDataRoutes);

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    userId: req.userId,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
