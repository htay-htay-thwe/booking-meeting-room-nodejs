const express = require("express");
const { authRequired } = require("../middleware/auth");
const {
  addBooking,
  deleteBooking,
  findBookingById,
  listBookings,
  listUsers,
  listBookingsWithUsers,
  listBookingsWithspecificUsers
} = require("../store/dataStore");
const { validateBookingTimes } = require("../services/bookingService");

const router = express.Router();

// 1. GET /bookings - Fetch all bookings 

router.get("/bookings", authRequired, async (req, res) => {
  try {

    bookings = await listBookingsWithUsers();

    const response = bookings.map((booking) => ({
      ...booking,
      _id: booking._id?.toString() || booking.id,
      userId: booking.userId?._id?.toString() || booking.userId,
      userName: booking.userId?.name
    }));

    res.json(response);
  } catch (error) {
    console.error("Error formatting bookings metadata:", error);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

// 2. POST /bookings - Create a new booking slot
router.post("/bookings", authRequired, async (req, res) => {
  try {
    const { startTime, endTime } = req.body || {};

    // Await the promise array snapshot so the validator receives the data array
    const bookings = await listBookings();
    const validation = validateBookingTimes(startTime, endTime, bookings);

    if (validation.error) {
      return res.status(validation.status || 400).json({ error: validation.error });
    }

    const booking = await addBooking({
      userId: req.user.id,
      startTime: validation.start.toISOString(),
      endTime: validation.end.toISOString()
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// 3. DELETE /bookings/:id - Remove a booking by ID
router.delete("/bookings/:id", authRequired, async (req, res) => {
  try {
    const booking = await findBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const isOwnerOrAdmin = req.user.role === "owner" || req.user.role === "admin";
    if (!isOwnerOrAdmin && booking.userId?.toString() !== req.user.id?.toString()) {
      return res.status(403).json({ error: "Cannot delete other users' bookings" });
    }

    await deleteBooking(req.params.id);
    res.json({ status: "deleted" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

module.exports = router;