const express = require("express");
const { issueToken, validatePassword } = require("../services/authService");
const { addUser, findUserByName } = require("../store/dataStore");

function toPublicUser(user) {
  return { id: user._id.toString(), name: user.name, role: user.role };
}

const router = express.Router();

router.post("/auth/register", async (req, res) => {
  const { name, password } = req.body || {};
  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }
  if (await findUserByName(name)) {
    return res.status(400).json({ error: "Name already in use" });
  }
  const user = await addUser({ name, password, role: "user" });
  const token = issueToken(user);
  res.status(201).json({
    token,
    user: toPublicUser(user)
  });
});

router.post("/auth/login", async (req, res) => {
  const { name, password } = req.body || {};
  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }
  const user = await findUserByName(name);
  if (!user || !validatePassword(user, password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = issueToken(user);
  res.json({
    token,
    user: toPublicUser(user)
  });
});

module.exports = router;
