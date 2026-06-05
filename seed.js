require('dotenv').config();
const { connectDb } = require('./db'); // Import your connection manager
const db = require('./store/dataStore'); // Import your data layer code above

async function runSeed() {
    try {
        await connectDb(); // Ensure DB is connected first
        console.log("Connected to MongoDB...");

        await db.resetData(); // Calls your function
        console.log("Database reset and Admin user seeded successfully.");

        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

runSeed();