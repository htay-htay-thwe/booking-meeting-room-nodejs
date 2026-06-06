require('dotenv').config();
const { connectDb } = require('./db'); 
const db = require('./store/dataStore');

async function runSeed() {
    try {
        await connectDb(); 
        console.log("Connected to MongoDB...");

        await db.resetData(); 
        console.log("Database reset and Admin user seeded successfully.");

        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
}

runSeed();