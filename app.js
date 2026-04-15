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

// --- BAGIAN TUGAS KAMU: ERROR HANDLING ---

// 1. Middleware untuk menangani Route yang tidak terdaftar (404 Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: `Endpoint ${req.originalUrl} tidak ditemukan!`
  });
});

// 2. Global Error Handling Middleware (Menangkap error dari query atau logic yang crash)
app.use((err, req, res, next) => {
  console.error("Fatal Error:", err.stack); // Log error di konsol untuk debugging

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "Error",
    message: "Terjadi kesalahan internal pada server",
    error: process.env.NODE_ENV === "development" ? err.message : {} // Detail error hanya muncul di mode dev
  });
});

// ------------------------------------------

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});