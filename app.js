<<<<<<< HEAD
// app.js
const express = require('express');
=======
const express = require("express");
>>>>>>> cf14864cd6465470099a75a450c46bdb700e5e65
const app = express();
const cors = require('cors');
require('dotenv').config();

<<<<<<< HEAD
// ⚠️ IMPORT ROUTES - HURUF KECIL SESUAI NAMA FILE
const distribusiRoutes = require('./routes/distribusi');

// Middleware
app.use(cors());
=======
const masterRoutes = require("./routes/master");

>>>>>>> cf14864cd6465470099a75a450c46bdb700e5e65
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
// ⚠️ MOUNT ROUTES
app.use('/api/distribusi', distribusiRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server Monitoring Sawit Berjalan!',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
=======
app.use("/master", masterRoutes);

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
>>>>>>> cf14864cd6465470099a75a450c46bdb700e5e65
});