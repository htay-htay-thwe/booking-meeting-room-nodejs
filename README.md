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

PORT=4000
MONGO_URI=mongodb://localhost:27017/

---

### Run the project

npm run dev

Server runs at:
http://localhost:4000

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


## Author

Htay Htay Thwe  
GitHub: https://github.com/htay-htay-thwe
