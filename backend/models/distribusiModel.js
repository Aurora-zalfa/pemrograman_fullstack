const db = require("../config/database");

/**
 * STRATEGI MODEL:
 * 1. Filter WHERE is_deleted = 0 pada semua fungsi GET.
 * 2. Ubah DELETE menjadi Soft Delete (UPDATE is_deleted = 1).
 * 3. Pastikan kolom is_deleted sudah ada di database.
 */

// ================= GET semua data (Filter Aktif) =================
exports.getDistribusi = (callback) => {
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
    (tanggal_kirim, berat_tbs, status, users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik, surat_jalan, bukti_timbang, is_deleted, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())
  `;

  const values = [
    data.tanggal_kirim,
    data.berat_tbs,
    data.status || 'menunggu_memuat',
    data.users_idusers || null,
    data.supir_idsupir || null,
    data.truk_idtruk || null,
    data.kebun_idkebun || null,
    data.pabrik_idpabrik || null,
    data.surat_jalan || null,
    data.bukti_timbang || null
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

// ================= GET BY ID (Callback version) =================
exports.getDistribusiById = (id, callback) => {
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
  
  db.query(query, [id], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

// ================= ✅ UPDATE DISTRIBUSI (Simple - untuk TabelDistribusi) =================
exports.updateDistribusiSimple = (id, data, callback) => {
  console.log("📝 [MODEL] Update ID:", id);
  console.log("📦 [MODEL] Data:", data);

  const query = `
    UPDATE distribusi 
    SET 
      nama_supir = ?,
      no_polisi = ?,
      berat_tbs = ?,
      status = ?,
      updated_at = NOW()
    WHERE iddistribusi = ? AND is_deleted = 0
  `;

  const values = [
    data.nama_supir || null,
    data.no_polisi || null,
    data.berat_tbs || null,
    data.status || 'menunggu_memuat',
    id
  ];

  console.log("🔍 [MODEL] Query values:", values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ [MODEL] DB Error:", err);
      return callback(err, null);
    }
    console.log("✅ [MODEL] Update result:", result);
    return callback(null, result);
  });
};

// ================= ✅ UPDATE DISTRIBUSI (Full - dengan file) =================
exports.updateDistribusi = (id, data, callback) => {
  console.log("📝 [MODEL] Update Full ID:", id);
  console.log("📦 [MODEL] Data Full:", data);

  const query = `
    UPDATE distribusi 
    SET 
      tanggal_kirim = ?,
      berat_tbs = ?,
      status = ?,
      supir_idsupir = ?,
      truk_idtruk = ?,
      kebun_idkebun = ?,
      pabrik_idpabrik = ?,
      surat_jalan = ?,
      bukti_timbang = ?,
      updated_at = NOW()
    WHERE iddistribusi = ? AND is_deleted = 0
  `;

  const values = [
    data.tanggal_kirim || null,
    data.berat_tbs || null,
    data.status || 'menunggu_memuat',
    data.supir_idsupir || null,
    data.truk_idtruk || null,
    data.kebun_idkebun || null,
    data.pabrik_idpabrik || null,
    data.surat_jalan || null,
    data.bukti_timbang || null,
    id
  ];

  console.log("🔍 [MODEL] Query values:", values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ [MODEL] DB Error:", err);
      return callback(err, null);
    }
    console.log("✅ [MODEL] Update result:", result);
    return callback(null, result);
  });
};

// ================= UPDATE STATUS =================
exports.updateStatus = async (id, status) => {
  const query = "UPDATE distribusi SET status = ? WHERE iddistribusi = ? AND is_deleted = 0";
  const [result] = await db.query(query, [status, id]);
  return result;
};

// ================= SOFT DELETE =================
exports.deleteDistribusi = (id, callback) => {
  const query = "UPDATE distribusi SET is_deleted = 1 WHERE iddistribusi = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

// ================= HARD DELETE =================
exports.deleteDistribusiPermanent = (id, callback) => {
  const query = "DELETE FROM distribusi WHERE iddistribusi = ?";
  
  db.query(query, [id], (err, result) => {
    if (err) return callback(err, null);
    return callback(null, result);
  });
};

// ================= GET by status =================
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

// ================= GET ALL JOIN =================
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

// ================= CEK STATUS SUPIR =================
exports.checkSupirStatus = async (id) => {
  const query = "SELECT status FROM supir WHERE idsupir = ?";
  const [rows] = await db.query(query, [id]);
  return rows[0];
};

// ================= CEK STATUS TRUK =================
exports.checkTrukStatus = async (id) => {
  const query = "SELECT status FROM truk WHERE idtruk = ?";
  const [rows] = await db.query(query, [id]);
  return rows[0];
};
// ================= UPDATE DISTRIBUSI (LANGSUNG PAKAI QUERY) =================
exports.updateDistribusiDirect = (id, data, callback) => {
  console.log("📝 [DIRECT UPDATE] ID:", id);
  console.log("📦 [DIRECT UPDATE] Data:", data);

  // Query UPDATE langsung tanpa join
  const query = `
    UPDATE distribusi 
    SET 
      nama_supir = ?,
      no_polisi = ?,
      berat_tbs = ?,
      status = ?
    WHERE iddistribusi = ?
  `;

  const values = [
    data.nama_supir,
    data.no_polisi,
    data.berat_tbs,
    data.status,
    id
  ];

  console.log("🔍 [DIRECT UPDATE] Values:", values);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ [DIRECT UPDATE] Error:", err);
      return callback(err, null);
    }
    console.log("✅ [DIRECT UPDATE] Result:", result);
    return callback(null, result);
  });
};