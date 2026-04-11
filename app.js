// app.js
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Import Routes
const masterRoutes = require("./routes/master");
const distribusiRoutes = require("./routes/distribusi");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/master", masterRoutes);
app.use("/distribusi", distribusiRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Server Monitoring Sawit Berjalan!",
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});