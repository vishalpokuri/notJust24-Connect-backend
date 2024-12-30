//routes/AllQRConnectionRoutes.js

const express = require("express");

const {
  fetchUserAfterScan,
  uploadSelfieConnection,
} = require("../controllers/allQRConnectionController");

const router = express.Router();

router.get("/userFetch", fetchUserAfterScan);
router.post("/uploadSelfieConnection", uploadSelfieConnection);

module.exports = router;
