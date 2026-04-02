const express = require("express");
const cors = require("cors");
const db = require("./config/database"); // Tambahkan ini
const masterRoutes = require("./routes/master"); // Tambahkan ini

const app = express();

app.use(cors());
app.use(express.json());

// Daftarkan route di sini
app.use("/api", masterRoutes); 

app.get("/", (req,res)=>{
  res.send("API Monitoring Sawit Running");
});

app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});