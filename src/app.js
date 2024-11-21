// src/app.js
const express = require("express");
const { connectDB } = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
require("dotenv").config();

const app = express();
app.use(express.json()); // Middleware for parsing JSON requests

// Set up routes
app.use(transactionRoutes);

// Connect to the database
connectDB();

// Define the server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
