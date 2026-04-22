// app.js
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Import Routes
const masterRoutes = require("./routes/master");
const distribusiRoutes = require("./routes/distribusi");
const laporanRoutes = require("./routes/laporan");
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/master", masterRoutes);
app.use("/api/distribusi", distribusiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/laporan", laporanRoutes);

// Test endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Server Monitoring Sawit Berjalan!",
    timestamp: new Date().toISOString()
  });
});

// 404 Handler - JANGAN DIHAPUS (fitur penting!)
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: `Endpoint ${req.originalUrl} tidak ditemukan!`
  });
});

// Global Error Handler - JANGAN DIHAPUS (fitur penting!)
app.use((err, req, res, next) => {
  console.error("Fatal Error:", err.stack);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "Error",
    message: "Terjadi kesalahan internal pada server",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});