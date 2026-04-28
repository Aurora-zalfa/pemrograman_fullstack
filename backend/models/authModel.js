// models/authModel.js
const db = require("../config/database");

// Register sudah benar gaya kodingannya
exports.register = async (data) => {
  const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  const [result] = await db.query(query, [
    data.username,
    data.password,
    data.role
  ]);
  return result;
};

// Ubah Login jadi seperti ini (Hapus Promise manualnya)
exports.login = async (data) => {
  const query = "SELECT * FROM users WHERE username = ?";
  // Pakai await langsung, jangan campur dengan callback (err, result)
  const [rows] = await db.query(query, [data.username]);
  return rows; // rows ini adalah hasil SELECT-nya
};