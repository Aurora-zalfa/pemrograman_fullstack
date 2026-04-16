// app.js
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Import Routes
const masterRoutes = require("./routes/master");
const distribusiRoutes = require("./routes/distribusi");
<<<<<<< HEAD
=======
const authRoutes = require("./routes/authRoutes");
>>>>>>> 65ba645d9de50d0088039516b79dc7a5909bed05
const laporanRoutes = require("./routes/laporan");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
<<<<<<< HEAD
// ✅ PERBAIKAN: Tambahkan prefix /api/ untuk konsistensi API
app.use("/master", masterRoutes);                    // Tetap /master (bisa diubah jadi /api/master jika mau konsisten)
app.use("/api/distribusi", distribusiRoutes);        // ✅ UBAH: /distribusi → /api/distribusi
app.use("/api/laporan", laporanRoutes);              // ✅ UBAH: /laporan → /api/laporan
=======
app.use("/api/master", masterRoutes);
app.use("/api/distribusi", distribusiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/laporan", laporanRoutes);
>>>>>>> 65ba645d9de50d0088039516b79dc7a5909bed05

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