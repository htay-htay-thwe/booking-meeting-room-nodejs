const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { findUserById } = require("../store/dataStore");

async function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing auth token" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
    req.user = {
      id: user._id.toString(),
      name: user.name,
      role: user.role
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid auth token" });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

module.exports = {
  authRequired,
  requireRole
};
