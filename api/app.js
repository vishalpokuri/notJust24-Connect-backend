require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/authMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");

const userDataRoutes = require("./routes/userDataRoutes");
const allQRConnectionRoutes = require("./routes/AllQRConnectionRoutes");
const presignedURLroutes = require("./routes/generatePresignedURL");
const listRoutes = require("./routes/listRoutes");
const noteRoutes = require("./routes/noteRoutes");

//Connection Initiation
const app = express();
connectDB();

app.use(
  cors({
    origin: "*", //TODO: Need to modify the origin later
  })
);
// hello {-_-}
app.use(bodyParser.json());

app.use("/api/aws", presignedURLroutes);
app.use("/api/auth", authRoutes);
app.use("/api/sociallinks", socialMediaRoutes);

app.use("/api/userData", userDataRoutes);
app.use("/api/QR", allQRConnectionRoutes);
app.use("/api/list", listRoutes);
app.use("/api/notes", noteRoutes);

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
