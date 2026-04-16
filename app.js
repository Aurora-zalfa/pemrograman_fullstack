// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. IMPORT ROUTES
const distribusiRoutes = require('./routes/distribusi');
const masterRoutes = require("./routes/master");

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. MOUNT ROUTES
app.use('/api/distribusi', distribusiRoutes);
app.use('/master', masterRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server Monitoring Sawit Berjalan!',
    timestamp: new Date().toISOString()
  });
});

// 4. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});