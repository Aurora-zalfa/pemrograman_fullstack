const db = require("../config/database");

exports.register = (data, callback)=>{
  const query = "INSERT INTO users SET ?";
  db.query(query, data, callback);
};

exports.login = (data, callback)=>{
  const query = "SELECT * FROM users WHERE username=? AND password=?";
  db.query(query, [data.username, data.password], callback);
};