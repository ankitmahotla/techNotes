const express = require("express");
const router = express.Router();
const path = require("path");

// Root route used to serve index.html for "/" route
router.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
