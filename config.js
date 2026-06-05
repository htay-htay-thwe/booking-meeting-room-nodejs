const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/";
const DB_NAME = process.env.DB_NAME || "meeting_room";

module.exports = {
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MONGO_URI,
  DB_NAME
};
