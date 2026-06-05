const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

function issueToken(user) {
  return jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, {
    expiresIn: "7d"
  });
}

function validatePassword(user, password) {
  return bcrypt.compareSync(password, user.passwordHash);
}

module.exports = {
  issueToken,
  validatePassword
};
