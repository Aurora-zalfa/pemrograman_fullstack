const express = require("express");
const router = express.Router();
const db = require("../config/database");
// Menggunakan destructuring karena auth.js sudah mengekspor verifyToken dan isManager
const { verifyToken, isManager } = require("../middleware/auth");

/**
 * HELPER FUNCTION: Centralized Error Handling
 */
const handleError = (res, err) => {
  console.error("Database Error:", err);
  return res.status(500).json({
    status: "Error",
    message: "Terjadi kesalahan pada server",
    details: err.message
  });
};

/**
 * TUGAS ZAINAB: DATA MASTER & SOFT DELETE
 * Fokus pada pengelolaan data pondasi dan Audit Trail (updated_at).
 */

/////////////////////////
// SUPIR
/////////////////////////

// A. Tambah Data Supir (Tugas Zainab)
router.post("/supir", verifyToken, async (req, res) => {
  try {
    const { nama_supir, no_hp } = req.body;
    const [result] = await db.query(
      "INSERT INTO supir (nama_supir, no_hp) VALUES (?, ?)",
      [nama_supir, no_hp]
    );
    res.status(201).json({
      status: "Success",
      message: "Data supir berhasil ditambahkan",
      id: result.insertId
    });
  } catch (err) {
    handleError(res, err);
  }
});

// B. Tampil Data Supir (Tugas Zainab)
router.get("/supir", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM supir WHERE is_deleted = 0");
    res.json({ 
      status: "Success", 
      narasi: "Saya mengelola data master. Perhatikan bahwa semua data yang saya panggil hanya yang memiliki is_deleted = 0.",
      data: rows 
    });
  } catch (err) {
    handleError(res, err);
  }
});

// C. Update Data Supir (TAMBAHAN - TUGAS ZAINAB)
router.put("/supir/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_supir, no_hp } = req.body;
    const [result] = await db.query(
      "UPDATE supir SET nama_supir = ?, no_hp = ? WHERE idsupir = ? AND is_deleted = 0",
      [nama_supir, no_hp, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "Fail", message: "Data supir tidak ditemukan" });
    }
    res.json({ status: "Success", message: "Data supir berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

// D. Soft Delete Supir (Tugas Zainab - Auth Manajer)
router.delete("/supir/:id", verifyToken, isManager, async (req, res) => {
  try {
    const { id } = req.params;

    // Cek relasi ke tabel distribusi (untuk Audit Trail/Keamanan Histori)
    const isUsed = await db.checkRelation("distribusi", "supir_idsupir", id);

    const [result] = await db.query(
      "UPDATE supir SET is_deleted = 1 WHERE idsupir = ?", 
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "Fail", message: "Data supir tidak ditemukan" });
    }

    res.json({ 
      status: "Success", 
      message: "Saat data dihapus, kami menggunakan Soft Delete. Kolom is_deleted berubah jadi 1 dan updated_at mencatat waktu eksekusinya. Ini penting agar histori transaksi tidak hilang.",
      audit_info: isUsed ? "Data memiliki relasi transaksi, diamankan via Soft Delete." : "Data berhasil dihapus."
    });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// KEBUN
/////////////////////////

// POST - Tambah Kebun (TAMBAHAN)
router.post("/kebun", verifyToken, async (req, res) => {
  try {
    const { nama_kebun, lokasi } = req.body;
    const [result] = await db.query(
      "INSERT INTO kebun (nama_kebun, lokasi) VALUES (?, ?)",
      [nama_kebun, lokasi]
    );
    res.status(201).json({
      status: "Success",
      message: "Data kebun berhasil ditambahkan",
      id: result.insertId
    });
  } catch (err) {
    handleError(res, err);
  }
});

// GET - Tampil Kebun
router.get("/kebun", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kebun WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

// PUT - Update Kebun (TAMBAHAN - TUGAS ZAINAB)
router.put("/kebun/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kebun, lokasi } = req.body;
    const [result] = await db.query(
      "UPDATE kebun SET nama_kebun = ?, lokasi = ? WHERE idkebun = ? AND is_deleted = 0",
      [nama_kebun, lokasi, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "Fail", message: "Data kebun tidak ditemukan" });
    }
    res.json({ status: "Success", message: "Data kebun berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE - Soft Delete Kebun
router.delete("/kebun/:id", verifyToken, isManager, async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await db.checkRelation("distribusi", "kebun_idkebun", id);
    await db.query("UPDATE kebun SET is_deleted = 1 WHERE idkebun = ?", [id]);
    res.json({ status: "Success", message: isUsed ? "Kebun diarsipkan" : "Kebun dihapus" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// PABRIK
/////////////////////////

// POST - Tambah Pabrik (TAMBAHAN)
router.post("/pabrik", verifyToken, async (req, res) => {
  try {
    const { nama_pabrik, lokasi } = req.body;
    const [result] = await db.query(
      "INSERT INTO pabrik (nama_pabrik, lokasi) VALUES (?, ?)",
      [nama_pabrik, lokasi]
    );
    res.status(201).json({
      status: "Success",
      message: "Data pabrik berhasil ditambahkan",
      id: result.insertId
    });
  } catch (err) {
    handleError(res, err);
  }
});

// GET - Tampil Pabrik
router.get("/pabrik", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pabrik WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

// PUT - Update Pabrik (TAMBAHAN - TUGAS ZAINAB)
router.put("/pabrik/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pabrik, lokasi } = req.body;
    const [result] = await db.query(
      "UPDATE pabrik SET nama_pabrik = ?, lokasi = ? WHERE idpabrik = ? AND is_deleted = 0",
      [nama_pabrik, lokasi, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "Fail", message: "Data pabrik tidak ditemukan" });
    }
    res.json({ status: "Success", message: "Data pabrik berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE - Soft Delete Pabrik
router.delete("/pabrik/:id", verifyToken, isManager, async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await db.checkRelation("distribusi", "pabrik_idpabrik", id);
    await db.query("UPDATE pabrik SET is_deleted = 1 WHERE idpabrik = ?", [id]);
    res.json({ status: "Success", message: isUsed ? "Pabrik diarsipkan" : "Pabrik dihapus" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// TRUK
/////////////////////////

// POST - Tambah Truk (TAMBAHAN)
router.post("/truk", verifyToken, async (req, res) => {
  try {
    const { no_polisi, kapasitas_ton } = req.body;
    const [result] = await db.query(
      "INSERT INTO truk (no_polisi, kapasitas_ton) VALUES (?, ?)",
      [no_polisi, kapasitas_ton]
    );
    res.status(201).json({
      status: "Success",
      message: "Data truk berhasil ditambahkan",
      id: result.insertId
    });
  } catch (err) {
    handleError(res, err);
  }
});

// GET - Tampil Truk
router.get("/truk", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM truk WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

// PUT - Update Truk (TAMBAHAN - TUGAS ZAINAB)
router.put("/truk/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { no_polisi, kapasitas_ton } = req.body;
    const [result] = await db.query(
      "UPDATE truk SET no_polisi = ?, kapasitas_ton = ? WHERE idtruk = ? AND is_deleted = 0",
      [no_polisi, kapasitas_ton, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "Fail", message: "Data truk tidak ditemukan" });
    }
    res.json({ status: "Success", message: "Data truk berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE - Soft Delete Truk
router.delete("/truk/:id", verifyToken, isManager, async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await db.checkRelation("distribusi", "truk_idtruk", id);
    const [result] = await db.query("UPDATE truk SET is_deleted = 1 WHERE idtruk = ?", [id]);
    
    if (result.affectedRows === 0) return res.status(404).json({ message: "Truk tidak ditemukan" });
    
    res.json({ 
      status: "Success", 
      message: isUsed ? "Truk dinonaktifkan (histori terjaga)" : "Truk berhasil dihapus" 
    });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// USERS
/////////////////////////

router.get("/users", verifyToken, isManager, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT idusers, username, role FROM users WHERE status = 'active'");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;