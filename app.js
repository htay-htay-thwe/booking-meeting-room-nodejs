const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const healthRoutes = require("./routes/health");
const ownerRoutes = require("./routes/owner");
const testRoutes = require("./routes/test");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors({
  origin: [
    'https://booking-meeting-room-react.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true
}));
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", bookingRoutes);
app.use("/api", ownerRoutes);
app.use("/api", testRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;
