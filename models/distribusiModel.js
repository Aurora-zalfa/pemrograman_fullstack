const db = require("../config/database");

exports.updateStatus = (id, status, callback)=>{
  const query = "UPDATE distribusi SET status=? WHERE iddistribusi=?";
  db.query(query, [status, id], callback);
};