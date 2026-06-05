const express = require("express");
const { NODE_ENV } = require("../config");
const { resetData } = require("../store/dataStore");

const router = express.Router();

router.post("/test/reset", (req, res) => {
  if (NODE_ENV !== "test") {
    return res.status(404).json({ error: "Not found" });
  }
  resetData();
  res.json({ status: "reset" });
});

module.exports = router;
