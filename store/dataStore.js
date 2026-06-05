const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameLower: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner", "user"], required: true }
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

async function seedAdmin() {
  const count = await User.countDocuments({ role: "admin" });
  if (count > 0) {
    return;
  }
  await addUser({ name: "admin", password: "admin123", role: "admin" });
}

async function resetData() {
  await Booking.deleteMany({});
  await User.deleteMany({});
  await seedAdmin();
}

async function listUsers() {
  return User.find().lean();
}

async function listBookings() {
  return Booking.find().lean();
}

async function listBookingsWithUsers() {
  return Booking.find().populate("userId").lean();
}

async function listBookingsWithspecificUsers(id) {
  return Booking.find({ userId: id }).populate("userId").lean();
}

async function findUserById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return User.findById(id).lean();
}

async function findUserByName(name) {
  const normalized = name.toLowerCase();
  return User.findOne({ nameLower: normalized }).lean();
}

async function addUser({ name, password, role }) {
  const normalized = name.toLowerCase();
  const user = await User.create({
    name,
    nameLower: normalized,
    passwordHash: bcrypt.hashSync(password, 10),
    role
  });
  return user.toObject();
}

async function updateUserRole(id, role) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return User.findByIdAndUpdate(id, { role }, { new: true, lean: true });
}

async function deleteUser(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return false;
  }
  await Booking.deleteMany({ userId: id });
  return true;
}

async function findBookingById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return Booking.findById(id).lean();
}

async function addBooking({ userId, startTime, endTime }) {
  const booking = await Booking.create({
    userId,
    startTime,
    endTime,
    createdAt: new Date()
  });
  return booking.toObject();
}

async function deleteBooking(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }
  return Booking.findByIdAndDelete(id).lean();
}

module.exports = {
  seedAdmin,
  resetData,
  listUsers,
  listBookings,
  listBookingsWithUsers,
  listBookingsWithspecificUsers,
  findUserById,
  findUserByName,
  addUser,
  updateUserRole,
  deleteUser,
  findBookingById,
  addBooking,
  deleteBooking
};
