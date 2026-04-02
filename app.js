const express = require("express");
const cors = require("cors");
const laporanRoutes = require('./routes/laporan');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/laporan-harian', laporanRoutes);

app.get("/", (req,res)=>{
  res.send("API Monitoring Sawit Running");
});

app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});

