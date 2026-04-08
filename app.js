const express = require("express");
const app = express();

const masterRoutes = require("./routes/master");

app.use(express.json());

app.use("/master", masterRoutes);

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});