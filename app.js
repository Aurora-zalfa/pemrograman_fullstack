

const express = require("express");
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const distribusiRoutes = require("./routes/distribusiRoutes");
const laporanRoutes = require('./routes/laporan');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// app.use('/uploads', express.static('uploads'));
// app.use('/api/upload', uploadRoutes);

// routes
app.use('/api/auth', authRoutes);
app.use("/api/distribusi", distribusiRoutes);
app.use('/laporan-harian', laporanRoutes);

// route utama
app.get("/", (req, res) => {
  res.send("API Monitoring Sawit Running");
});

// server jalan
app.listen(3000, () => {
  console.log("Server running on port 3000");
});