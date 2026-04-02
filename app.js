const express = require("express");
const cors = require("cors");

// import routes dari Rum
//const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// biar file upload bisa diakses
//app.use('/uploads', express.static('uploads'));

// daftarin endpoint upload
//app.use('/api/upload', uploadRoutes);

app.get("/", (req,res)=>{
  res.send("API Monitoring Sawit Running");
});

app.listen(3000, ()=>{
  console.log("Server running on port 3000");
});