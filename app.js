const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

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