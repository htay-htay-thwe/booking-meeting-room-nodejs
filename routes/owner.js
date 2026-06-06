const express = require("express");
const { authRequired, requireRole } = require("../middleware/auth");
const { listBookings, listUsers } = require("../store/dataStore");

const router = express.Router();

// 1. GET /owner/summary - Summary of total booking counts per user (excluding admins)
router.get("/owner/summary", authRequired, requireRole(["owner", "admin"]), async (req, res) => {
  try {
    const bookings = await listBookings();
    const allUsers = await listUsers();

    const users = allUsers.filter((user) => user.role !== "admin");

    const summary = users.map((user) => {
      const totalBookings = bookings.filter((booking) => {
        const bookingUserIdStr = booking.userId ? booking.userId.toString() : "";
        const userIdStr = user._id ? user._id.toString() : (user.id ? user.id.toString() : "");
        return bookingUserIdStr === userIdStr;
      }).length;

      return {
        userId: user._id ? user._id.toString() : user.id,
        name: user.name,
        role: user.role,
        totalBookings
      };
    });

    res.json(summary);
  } catch (error) {
    console.error("Error generating owner summary:", error);
    res.status(500).json({ error: "Failed to generate dashboard summary" });
  }
});

// 2. GET /owner/bookings-by-user - Full breakdown lists grouped by user (excluding admins)
router.get(
  "/owner/bookings-by-user",
  authRequired,
  requireRole(["owner", "admin"]),
  async (req, res) => {
    try {
      const bookings = await listBookings();
      const allUsers = await listUsers();
      
      const users = allUsers.filter((user) => user.role !== "admin");

      const grouped = users.map((user) => {
        const userBookings = bookings.filter((booking) => {
          const bookingUserIdStr = booking.userId ? booking.userId.toString() : "";
          const userIdStr = user._id ? user._id.toString() : (user.id ? user.id.toString() : "");
          return bookingUserIdStr === userIdStr;
        });

        return {
          userId: user._id ? user._id.toString() : user.id,
          name: user.name,
          role: user.role,
          bookings: userBookings.map(b => ({
            ...b,
            _id: b._id ? b._id.toString() : b.id,
            userId: b.userId ? b.userId.toString() : b.userId
          }))
        };
      });

      res.json(grouped);
    } catch (error) {
      console.error("Error grouping owner bookings:", error);
      res.status(500).json({ error: "Failed to generate nested booking logs" });
    }
  }
);

module.exports = router;