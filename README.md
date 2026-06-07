# Meeting Room Booking System (Node.js + Express)

A simple backend API for booking meeting rooms with **overlap prevention logic**.

---

## Features

- Create meeting room bookings
- Prevent overlapping bookings
- Validate start and end time
- Proper error handling (400, 409)
- REST API structure

---

## Business Logic

A booking is invalid when:

- Start time is after or equal to end time
- Booking overlaps with an existing booking

### Overlap Rule

newStart < existingEnd AND newEnd > existingStart

---

## Project Structure

booking-meeting-room-nodejs/
├── src/
│   ├── controllers/
│   │   └── bookingController.js
│   ├── services/
│   │   └── bookingService.js
│   ├── utils/
│   │   ├── validateBookingTimes.js
│   │   ├── hasOverlap.js
│   │   └── formatDate.js
│   ├── routes/
│   │   └── bookingRoutes.js
│   ├── app.js
│   └── server.js
├── package.json
├── .env
└── README.md

---

## Tech Stack

- Node.js
- Express.js
- JavaScript (ES6)
- REST API

---

## Installation

### Clone the repository

git clone https://github.com/htay-htay-thwe/booking-meeting-room-nodejs.git

cd booking-meeting-room-nodejs

---

### Install dependencies

npm install

---

### Setup environment variables

Create a `.env` file:

PORT=5000

---

### Run the project

npm run dev

Server runs at:
http://localhost:5000

---

## API Endpoints

### Create Booking

POST /api/bookings

---

### Request Body

{
  "startTime": "2026-06-07T10:00:00.000Z",
  "endTime": "2026-06-07T11:00:00.000Z"
}

---

### Success Response

{
  "message": "Booking created successfully"
}

---

### Overlap Response (409)

{
  "message": "Booking overlaps with existing booking",
  "overlap": {
    "startTime": "2026-06-07T10:00:00.000Z",
    "endTime": "2026-06-07T11:00:00.000Z"
  }
}

---

## Error Codes

400 → Invalid input  
409 → Overlapping booking  
500 → Server error  

---

## Example Scenario

Existing booking:
10:00 AM → 11:00 AM

New booking:
10:30 AM → 11:30 AM ❌ rejected

---

## Future Improvements

- Add authentication (JWT)
- Connect database (MongoDB / MySQL)
- Calendar UI view
- Real-time availability check
- Unit testing (Jest)

---

## Author

Htay Htay Thwe  
GitHub: https://github.com/htay-htay-thwe
