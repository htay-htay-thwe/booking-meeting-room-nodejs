const app = require("./app");
const { PORT } = require("./config");
const { connectDb } = require("./db"); // Import the connection function

async function startServer() {
  try {
    // 1. Wait for DB connection
    await connectDb();
    console.log("Database connected successfully");

    // 2. Only start listening AFTER DB is ready
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Critical error: Database connection failed", error);
    process.exit(1);
  }
}

// Execute the startup
startServer();