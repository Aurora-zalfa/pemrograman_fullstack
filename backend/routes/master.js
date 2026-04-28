const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { verifyToken } = require("../middleware/auth");
const authorizeRoles = require("../middleware/authRole");

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
 * CATATAN UTS:
 * 1. verifyToken: Mengecek identitas user.
 * 2. authorizeRoles('manajer'): Membatasi fitur hapus hanya untuk Manajer (RBAC).
 * 3. updated_at = NOW(): Mencatat waktu perubahan untuk audit trail (Tracking).
 * 4. is_deleted = 1: Strategi Soft Delete agar histori transaksi aman.
 */

/////////////////////////
// 1. SUPIR
/////////////////////////

router.get("/supir", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM supir WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/supir/:id", verifyToken, authorizeRoles('manajer'), async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await db.checkRelation("distribusi", "supir_idsupir", id);

    // Soft Delete + Tracking Timestamp
    const [result] = await db.query(
      "UPDATE supir SET is_deleted = 1, updated_at = NOW() WHERE idsupir = ?", 
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ 
      status: "Success", 
      message: isUsed ? "Supir dinonaktifkan untuk menjaga histori transaksi" : "Supir berhasil dihapus" 
    });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// 2. TRUK
/////////////////////////

router.get("/truk", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM truk WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/truk/:id", verifyToken, authorizeRoles('manajer'), async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await db.checkRelation("distribusi", "truk_idtruk", id);

    const [result] = await db.query(
      "UPDATE truk SET is_deleted = 1, updated_at = NOW() WHERE idtruk = ?", 
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Truk tidak ditemukan" });

    res.json({ status: "Success", message: "Data truk berhasil diarsipkan" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// 3. KEBUN
/////////////////////////

router.get("/kebun", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kebun WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/kebun/:id", verifyToken, authorizeRoles('manajer'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE kebun SET is_deleted = 1, updated_at = NOW() WHERE idkebun = ?", [id]);
    res.json({ status: "Success", message: "Kebun dinonaktifkan" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// 4. PABRIK
/////////////////////////

router.get("/pabrik", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pabrik WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/pabrik/:id", verifyToken, authorizeRoles('manajer'), async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE pabrik SET is_deleted = 1, updated_at = NOW() WHERE idpabrik = ?", [id]);
    res.json({ status: "Success", message: "Pabrik dinonaktifkan" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// 5. USERS (Hanya Manajer yang bisa lihat daftar user)
/////////////////////////

router.get("/users", verifyToken, authorizeRoles('manajer'), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT idusers, username, role FROM users");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;