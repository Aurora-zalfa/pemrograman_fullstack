// app.js
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// 1. IMPORT ROUTES (Menghubungkan logika CRUD Master yang sudah kamu perbaiki)
const masterRoutes = require("./routes/master");
const distribusiRoutes = require("./routes/distribusi");
const laporanRoutes = require("./routes/laporan");
const authRoutes = require('./routes/authRoutes');

// 2. MIDDLEWARE UTAMA (Krusial untuk Validasi Input)
app.use(cors());
// express.json() sangat penting agar req.body (no_hp, lokasi, dll) bisa terbaca saat divalidasi
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. PREFIX ROUTES
// Tugas sinkronisasi kamu diakses melalui endpoint /api/master
app.use("/api/master", masterRoutes);
app.use("/api/distribusi", distribusiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/laporan", laporanRoutes);

// Test endpoint untuk cek koneksi awal
app.get("/api", (req, res) => {
  res.json({
    message: "Server Monitoring Sawit Berjalan!",
    timestamp: new Date().toISOString()
  });
});

// 4. 404 HANDLER (Menangani jika endpoint salah atau sinkronisasi URL tidak pas)
app.use((req, res, next) => {
  res.status(404).json({
    status: "Error",
    message: `Endpoint ${req.originalUrl} tidak ditemukan! Pastikan URL sudah benar.`
  });
});

// 5. GLOBAL ERROR HANDLER (Menangani sinkronisasi error database secara aman)
app.use((err, req, res, next) => {
  console.error("Fatal Error:", err.stack);

  // Jika validasi di master.js gagal secara sistem, ini akan menangkapnya
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "Error",
    message: "Terjadi kesalahan internal pada server",
    // Hanya tampilkan detail error di mode development untuk keamanan skema database
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

// 6. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
  console.log(`Sinkronisasi Database Master aktif di: http://localhost:${PORT}/api/master`);
});