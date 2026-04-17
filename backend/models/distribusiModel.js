// models/distribusiModel.js
const db = require("../config/database");

// ============================================
// FUNGSI YANG SUDAH ADA (JANGAN DIHAPUS)
// ============================================

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

// UPDATE STATUS
exports.updateStatus = (id, status, callback)=>{
  const query = "UPDATE distribusi SET status=? WHERE iddistribusi=?";
  db.query(query, [status, id], callback);
};

// ============================================
// FUNGSI BARU YANG DITAMBAHKAN (Sprint 5)
// ============================================

// GET BY ID dengan JOIN
exports.getById = (id, callback) => {
  const query = `
    SELECT 
      d.*,
      k.nama_kebun,
      s.nama_supir,
      t.no_polisi,
      p.nama_pabrik,
      u.username
    FROM distribusi d
    LEFT JOIN kebun k ON d.kebun_idkebun = k.idkebun
    LEFT JOIN supir s ON d.supir_idsupir = s.idsupir
    LEFT JOIN truk t ON d.truk_idtruk = t.idtruk
    LEFT JOIN pabrik p ON d.pabrik_idpabrik = p.idpabrik
    LEFT JOIN users u ON d.users_idusers = u.idusers
    WHERE d.iddistribusi = ?
  `;
  db.query(query, [id], callback);
};

// UPDATE distribusi (termasuk upload ulang)
exports.updateDistribusi = (id, data, callback) => {
  const query = `
    UPDATE distribusi 
    SET 
      tanggal_kirim = COALESCE(?, tanggal_kirim),
      berat_tbs = COALESCE(?, berat_tbs),
      surat_jalan = COALESCE(?, surat_jalan),
      bukti_timbang = COALESCE(?, bukti_timbang),
      status = COALESCE(?, status),
      users_idusers = COALESCE(?, users_idusers),
      supir_idsupir = COALESCE(?, supir_idsupir),
      truk_idtruk = COALESCE(?, truk_idtruk),
      kebun_idkebun = COALESCE(?, kebun_idkebun),
      pabrik_idpabrik = COALESCE(?, pabrik_idpabrik),
      updated_at = NOW()
    WHERE iddistribusi = ?
  `;

  const values = [
    data.tanggal_kirim,
    data.berat_tbs,
    data.surat_jalan,
    data.bukti_timbang,
    data.status,
    data.users_idusers,
    data.supir_idsupir,
    data.truk_idtruk,
    data.kebun_idkebun,
    data.pabrik_idpabrik,
    id
  ];

  db.query(query, values, callback);
};

// DELETE distribusi
exports.deleteDistribusi = (id, callback) => {
  // Pertama cek data ada
  const checkQuery = "SELECT surat_jalan, bukti_timbang FROM distribusi WHERE iddistribusi = ?";
  
  db.query(checkQuery, [id], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(new Error("Data tidak ditemukan"), null);
    
    // Hapus dari database
    const deleteQuery = "DELETE FROM distribusi WHERE iddistribusi = ?";
    db.query(deleteQuery, [id], callback);
  });
};

// GET by status
exports.getByStatus = (status, callback) => {
  const query = `
    SELECT 
      d.*,
      k.nama_kebun,
      s.nama_supir,
      t.no_polisi,
      p.nama_pabrik
    FROM distribusi d
    LEFT JOIN kebun k ON d.kebun_idkebun = k.idkebun
    LEFT JOIN supir s ON d.supir_idsupir = s.idsupir
    LEFT JOIN truk t ON d.truk_idtruk = t.idtruk
    LEFT JOIN pabrik p ON d.pabrik_idpabrik = p.idpabrik
    WHERE d.status = ?
    ORDER BY d.created_at DESC
  `;
  db.query(query, [status], callback);
};

// GET ALL dengan JOIN (untuk response lebih lengkap)
exports.getAllWithJoin = (callback) => {
  const query = `
    SELECT 
      d.*,
      k.nama_kebun,
      s.nama_supir,
      t.no_polisi,
      p.nama_pabrik,
      u.username
    FROM distribusi d
    LEFT JOIN kebun k ON d.kebun_idkebun = k.idkebun
    LEFT JOIN supir s ON d.supir_idsupir = s.idsupir
    LEFT JOIN truk t ON d.truk_idtruk = t.idtruk
    LEFT JOIN pabrik p ON d.pabrik_idpabrik = p.idpabrik
    LEFT JOIN users u ON d.users_idusers = u.idusers
    ORDER BY d.created_at DESC
  `;
  db.query(query, callback);
};