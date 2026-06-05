const mongoose = require("mongoose");
const { MONGO_URI, DB_NAME } = require("./config");

function getMongoUri() {
  if (MONGO_URI) {
    return MONGO_URI;
  }
  return `mongodb://127.0.0.1:27017/${DB_NAME}`;
}

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  const uri = getMongoUri();
  await mongoose.connect(uri);
}

async function disconnectDb() {
  if (mongoose.connection.readyState === 0) {
    return;
  }
  await mongoose.disconnect();
}

module.exports = {
  connectDb,
  disconnectDb
};
