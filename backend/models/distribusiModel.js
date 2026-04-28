const db = require("../config/database");

/**
 * STRATEGI MODEL:
 * 1. Filter WHERE is_deleted = 0 pada semua fungsi GET.
 * 2. Ubah DELETE menjadi Soft Delete (UPDATE is_deleted = 1).
 * 3. Pastikan kolom is_deleted sudah ada di database.
 */

// ================= GET semua data (Filter Aktif) =================
exports.getDistribusi = (callback) => {
  // Ditambahkan WHERE is_deleted = 0
  const query = "SELECT * FROM distribusi WHERE is_deleted = 0";

  db.query(query, (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

// ================= INSERT data =================
exports.createDistribusi = (data, callback) => {
  const query = `
    INSERT INTO distribusi 
    (tanggal_kirim, berat_tbs, status, users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik, is_deleted, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())
  `;

  const values = [
    data.tanggal_kirim,
    data.berat_tbs,
    data.status || 'menunggu_memuat',
    data.users_idusers,
    data.supir_idsupir,
    data.truk_idtruk,
    data.kebun_idkebun,
    data.pabrik_idpabrik
  ];

  db.query(query, values, (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

// ================= GET BY ID dengan JOIN (Async/Await) =================
exports.getById = async (id) => {
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
    WHERE d.iddistribusi = ? AND d.is_deleted = 0
  `;
  
  const [rows] = await db.query(query, [id]);
  return rows; 
};

// ================= UPDATE STATUS =================
exports.updateStatus = async (id, status) => {
  const query = "UPDATE distribusi SET status = ? WHERE iddistribusi = ? AND is_deleted = 0";
  const [result] = await db.query(query, [status, id]);
  return result;
};

// ================= SOFT DELETE distribusi =================
exports.deleteDistribusi = (id, callback) => {
  // Diubah dari DELETE fisik menjadi UPDATE status is_deleted
  const query = "UPDATE distribusi SET is_deleted = 1 WHERE iddistribusi = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

// ================= GET by status (Filter Aktif) =================
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
    WHERE d.status = ? AND d.is_deleted = 0
    ORDER BY d.created_at DESC
  `;
  db.query(query, [status], callback);
};

// ================= GET ALL JOIN (Filter Aktif) =================
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
    WHERE d.is_deleted = 0
    ORDER BY d.created_at DESC
  `;
  db.query(query, callback);
};