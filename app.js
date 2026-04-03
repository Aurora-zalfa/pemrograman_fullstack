const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const distribusiRoutes = require("./routes/distribusiRoutes");


// const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/distribusi", distribusiRoutes);

// app.use('/uploads', express.static('uploads'));
// app.use('/api/upload', uploadRoutes);

// import routes
const distribusiRoutes = require("./routes/distribusiRoutes");

// route utama
app.get("/", (req, res) => {
  res.send("API Monitoring Sawit Running");
});

// route distribusi
app.use("/api/distribusi", distribusiRoutes);

// server jalan
app.listen(3000, () => {
  console.log("Server running on port 3000");
});