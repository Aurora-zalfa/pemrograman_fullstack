const db = require("../config/database");

exports.register = async (data) => {
  const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
  const [result] = await db.query(query, [
    data.username,
    data.password,
    data.role
  ]);

  return result;
};

exports.login = async (data) => {
  const query = "SELECT * FROM users WHERE username=? AND password=?";
  const [rows] = await db.query(query, [
    data.username,
    data.password
  ]);

  return rows;
};