const express = require("express");
const router = express.Router();
const db = require("../config/database");

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
 * CATATAN PENTING: 
 * Gunakan Soft Delete (is_deleted = 1) untuk semua data master 
 * agar tidak merusak INTEGRITAS REFERENSI pada tabel transaksi.
 */

/////////////////////////
// SUPIR
/////////////////////////

router.get("/supir", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM supir WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/supir/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Gunakan Helper checkRelation dari database.js
    const isUsed = await db.checkRelation("pengiriman", "idsupir", id);

    // Apapun kondisinya, kita gunakan Soft Delete agar data tetap ada di DB
    const [result] = await db.query("UPDATE supir SET is_deleted = 1 WHERE idsupir = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "Fail", message: "Data supir tidak ditemukan" });
    }

    res.json({ 
      status: "Success", 
      message: isUsed 
        ? "Supir dinonaktifkan (Data tetap tersimpan untuk histori)" 
        : "Supir berhasil dihapus" 
    });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// TRUK
/////////////////////////

router.get("/truk", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM truk WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/truk/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Cek relasi di tabel pengiriman
    const isUsed = await db.checkRelation("pengiriman", "idtruk", id);

    const [result] = await db.query("UPDATE truk SET is_deleted = 1 WHERE idtruk = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Truk tidak ditemukan" });

    res.json({ 
      status: "Success", 
      message: isUsed ? "Truk dinonaktifkan dari sistem" : "Truk berhasil dihapus" 
    });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// KEBUN
/////////////////////////

router.get("/kebun", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kebun WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/kebun/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await db.checkRelation("pengiriman", "idkebun", id);

    await db.query("UPDATE kebun SET is_deleted = 1 WHERE idkebun = ?", [id]);
    
    res.json({ 
      status: "Success", 
      message: isUsed ? "Kebun diarsipkan" : "Kebun dihapus" 
    });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// PABRIK
/////////////////////////

router.get("/pabrik", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pabrik WHERE is_deleted = 0");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/pabrik/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isUsed = await db.checkRelation("pengiriman", "idpabrik", id);

    await db.query("UPDATE pabrik SET is_deleted = 1 WHERE idpabrik = ?", [id]);

    res.json({ 
      status: "Success", 
      message: isUsed ? "Pabrik diarsipkan" : "Pabrik dihapus" 
    });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// USERS
/////////////////////////

router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT idusers, username, role FROM users WHERE status = 'active'");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;