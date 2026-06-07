function parseTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function hasOverlap(startMs, endMs, bookings) {
  return bookings.find((booking) => {
    const bookingStart = new Date(booking.startTime).getTime();
    const bookingEnd = new Date(booking.endTime).getTime();
    return startMs < bookingEnd && endMs > bookingStart;
  });
}

function validateBookingTimes(startTime, endTime, bookings) {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  if (!start || !end) {
    return { error: "Invalid startTime or endTime", status: 400 };
  }
  if (start.getTime() >= end.getTime()) {
    return { error: "startTime must be before endTime", status: 400 };
  }
  const overlap = hasOverlap(start.getTime(), end.getTime(), bookings);
  if (overlap) {
    const formattedStart = new Date(overlap.startTime).toLocaleString("en-US");
    const formattedEnd = new Date(overlap.endTime).toLocaleString("en-US");

    return {
      error: `Booking overlaps with existing booking from ${formattedStart} to ${formattedEnd}`,
      status: 409,
    };
  }
  return { start, end };
}

module.exports = {
  validateBookingTimes
};
