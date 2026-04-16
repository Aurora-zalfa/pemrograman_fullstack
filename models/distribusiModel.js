const db = require("../config/database");

// ================= GET semua data =================
exports.getDistribusi = (callback) => {
  const query = "SELECT * FROM distribusi";

  db.query(query, (err, result) => {
    if (err) {
      return callback(err, null);
    }

    return callback(null, result);
  });
};

// ================= INSERT data =================
exports.createDistribusi = (data, callback) => {
  // VALIDASI TAMBAHAN DI MODEL (optional tapi bagus)
  if (!data.tanggal_kirim || !data.berat_tbs) {
    return callback(new Error("Data tidak lengkap"), null);
  }

  const query = "INSERT INTO distribusi (tanggal_kirim, berat_tbs) VALUES (?, ?)";

  db.query(query, [data.tanggal_kirim, data.berat_tbs], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    return callback(null, result);
  });
};

// ================= UPDATE STATUS =================
exports.updateStatus = (id, status, callback) => {
  const query = "UPDATE distribusi SET status = ? WHERE iddistribusi = ?";

  db.query(query, [status, id], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    //  CEK DATA ADA / TIDAK
    if (result.affectedRows === 0) {
      return callback(new Error("Data tidak ditemukan"), null);
    }

    return callback(null, result);
  });
};