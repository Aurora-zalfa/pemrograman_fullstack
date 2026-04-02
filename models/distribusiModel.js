const db = require("../config/database");

// GET semua data
exports.getDistribusi = (callback) => {
  const query = "SELECT * FROM distribusi";
  db.query(query, callback);
};

// INSERT data
exports.createDistribusi = (data, callback) => {
  const query = "INSERT INTO distribusi SET ?";
  db.query(query, data, callback);
};