const express = require("express");
const { authRequired, requireRole } = require("../middleware/auth");
const {
  addUser,
  deleteUser,
  listUsers,
  updateUserRole,
  findUserByName
} = require("../store/dataStore");

function toPublicUser(user) {
  return { id: user._id.toString(), name: user.name, role: user.role };
}

const router = express.Router();

router.get("/users", authRequired, requireRole(["admin"]), async (req, res) => {
  const response = (await listUsers()).map((user) => toPublicUser(user));
  res.json(response);
});

router.post("/users", authRequired, requireRole(["admin"]), async (req, res) => {
  const { name, password, role } = req.body || {};
  if (!name || !password || !role) {
    return res.status(400).json({ error: "Name, password, and role are required" });
  }
  if (!["admin", "owner", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  if (await findUserByName(name)) {
    return res.status(400).json({ error: "Name already in use" });
  }
  const user = await addUser({ name, password, role });
  res.status(201).json(toPublicUser(user));
});

router.patch("/users/:id/role", authRequired, requireRole(["admin"]), async (req, res) => {
  const { role } = req.body || {};
  if (!["admin", "owner", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const user = await updateUserRole(req.params.id, role);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(toPublicUser(user));
});

router.delete("/users/:id", authRequired, requireRole(["admin"]), async (req, res) => {
  const deleted = await deleteUser(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ status: "deleted" });
});

module.exports = router;
