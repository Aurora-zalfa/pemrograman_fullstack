const express = require("express");
const router = express.Router();
const db = require("../config/database");

/**
 * HELPER FUNCTION: Untuk mengurangi duplikasi kode error handling
 */
const handleError = (res, err) => {
  console.error("Database Error:", err);
  return res.status(500).json({ 
    status: "Error", 
    message: "Terjadi kesalahan pada server", 
    details: err.message 
  });
};

/////////////////////////
// SUPIR
/////////////////////////

// GET Supir
router.get("/supir", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM supir");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

// POST Supir
router.post("/supir", async (req, res) => {
  try {
    const { nama_supir, no_telp } = req.body;

    if (!nama_supir || !no_telp) {
      return res.status(400).json({ message: "Nama supir dan nomor telepon wajib diisi" });
    }

    await db.query("INSERT INTO supir (nama_supir, no_telp) VALUES (?, ?)", [nama_supir, no_telp]);
    res.status(201).json({ message: "Supir berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

// UPDATE Supir
router.put("/supir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_supir, no_telp } = req.body;

    if (!nama_supir || !no_telp) {
      return res.status(400).json({ message: "Data update tidak boleh kosong" });
    }

    const [result] = await db.query(
      "UPDATE supir SET nama_supir = ?, no_telp = ? WHERE idsupir = ?", 
      [nama_supir, no_telp, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Supir tidak ditemukan" });
    res.json({ message: "Supir berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE Supir
router.delete("/supir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM supir WHERE idsupir=?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "Supir berhasil dihapus" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// TRUK
/////////////////////////

router.get("/truk", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM truk");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/truk", async (req, res) => {
  try {
    const { plat_nomor, jenis_truk } = req.body;
    if (!plat_nomor) return res.status(400).json({ message: "Plat nomor wajib diisi" });

    await db.query("INSERT INTO truk (plat_nomor, jenis_truk) VALUES (?, ?)", [plat_nomor, jenis_truk]);
    res.status(201).json({ message: "Truk berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/truk/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { plat_nomor, jenis_truk } = req.body;

    const [result] = await db.query(
      "UPDATE truk SET plat_nomor = ?, jenis_truk = ? WHERE idtruk = ?", 
      [plat_nomor, jenis_truk, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Truk tidak ditemukan" });
    res.json({ message: "Truk berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/truk/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM truk WHERE idtruk=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Truk tidak ditemukan" });
    res.json({ message: "Truk berhasil dihapus" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// KEBUN
/////////////////////////

router.get("/kebun", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kebun");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/kebun", async (req, res) => {
  try {
    const { nama_kebun, lokasi } = req.body;
    if (!nama_kebun) return res.status(400).json({ message: "Nama kebun wajib diisi" });

    await db.query("INSERT INTO kebun (nama_kebun, lokasi) VALUES (?, ?)", [nama_kebun, lokasi]);
    res.status(201).json({ message: "Kebun berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/kebun/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kebun, lokasi } = req.body;

    const [result] = await db.query(
      "UPDATE kebun SET nama_kebun = ?, lokasi = ? WHERE idkebun = ?", 
      [nama_kebun, lokasi, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Kebun tidak ditemukan" });
    res.json({ message: "Kebun berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/kebun/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM kebun WHERE idkebun=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Kebun tidak ditemukan" });
    res.json({ message: "Kebun berhasil dihapus" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// PABRIK
/////////////////////////

router.get("/pabrik", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pabrik");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

router.post("/pabrik", async (req, res) => {
  try {
    const { nama_pabrik, alamat } = req.body;
    if (!nama_pabrik) return res.status(400).json({ message: "Nama pabrik wajib diisi" });

    await db.query("INSERT INTO pabrik (nama_pabrik, alamat) VALUES (?, ?)", [nama_pabrik, alamat]);
    res.status(201).json({ message: "Pabrik berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/pabrik/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pabrik, alamat } = req.body;

    const [result] = await db.query(
      "UPDATE pabrik SET nama_pabrik = ?, alamat = ? WHERE idpabrik = ?", 
      [nama_pabrik, alamat, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Pabrik tidak ditemukan" });
    res.json({ message: "Pabrik berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

router.delete("/pabrik/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM pabrik WHERE idpabrik=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Pabrik tidak ditemukan" });
    res.json({ message: "Pabrik berhasil dihapus" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// USERS
/////////////////////////

router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, username, role FROM users");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;