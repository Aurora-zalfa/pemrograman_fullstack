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
// SUPIR (Sinkronisasi: no_hp)
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
    const { nama_supir, no_hp } = req.body;

    // VALIDASI: Memastikan nama dan no_hp ada
    if (!nama_supir || !no_hp) {
      return res.status(400).json({
        status: "Fail",
        message: "Nama supir dan nomor HP (no_hp) wajib diisi"
      });
    }

    await db.query(
      "INSERT INTO supir (nama_supir, no_hp) VALUES (?, ?)",
      [nama_supir, no_hp]
    );

    res.status(201).json({ status: "Success", message: "Supir berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

// UPDATE Supir
router.put("/supir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_supir, no_hp } = req.body;

    // VALIDASI: Update tidak boleh mengirim data kosong
    if (!nama_supir || !no_hp) {
      return res.status(400).json({
        status: "Fail",
        message: "Nama supir dan nomor HP tidak boleh kosong untuk update"
      });
    }

    const [result] = await db.query(
      "UPDATE supir SET nama_supir = ?, no_hp = ? WHERE idsupir = ?",
      [nama_supir, no_hp, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Supir tidak ditemukan" });
    }

    res.json({ status: "Success", message: "Supir berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE Supir
router.delete("/supir/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM supir WHERE idsupir=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data supir tidak ditemukan" });
    }

    res.json({ status: "Success", message: "Supir berhasil dihapus" });
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
    const { no_polisi, kapasitas_ton } = req.body;

    if (!no_polisi) {
      return res.status(400).json({ status: "Fail", message: "No polisi wajib diisi" });
    }

    await db.query(
      "INSERT INTO truk (no_polisi, kapasitas_ton, status) VALUES (?, ?, 'tersedia')",
      [no_polisi, kapasitas_ton || 0]
    );

    res.status(201).json({ status: "Success", message: "Truk berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// KEBUN (Sinkronisasi: lokasi)
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
    const { nama_kebun, lokasi, luas_hektar } = req.body;

    // VALIDASI: Memastikan lokasi ada sesuai skema
    if (!nama_kebun || !lokasi) {
      return res.status(400).json({
        status: "Fail",
        message: "Nama kebun dan lokasi wajib diisi"
      });
    }

    await db.query(
      "INSERT INTO kebun (nama_kebun, lokasi, luas_hektar) VALUES (?, ?, ?)",
      [nama_kebun, lokasi, luas_hektar || 0]
    );

    res.status(201).json({ status: "Success", message: "Kebun berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/kebun/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kebun, lokasi, luas_hektar } = req.body;

    if (!nama_kebun || !lokasi) {
      return res.status(400).json({ status: "Fail", message: "Nama kebun dan lokasi wajib diisi" });
    }

    const [result] = await db.query(
      "UPDATE kebun SET nama_kebun = ?, lokasi = ?, luas_hektar = ? WHERE idkebun = ?",
      [nama_kebun, lokasi, luas_hektar, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Kebun tidak ditemukan" });
    }

    res.json({ status: "Success", message: "Kebun berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// PABRIK (Sinkronisasi: lokasi)
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
    const { nama_pabrik, lokasi } = req.body;

    // VALIDASI: Lokasi wajib ada
    if (!nama_pabrik || !lokasi) {
      return res.status(400).json({
        status: "Fail",
        message: "Nama pabrik dan lokasi wajib diisi"
      });
    }

    await db.query(
      "INSERT INTO pabrik (nama_pabrik, lokasi) VALUES (?, ?)",
      [nama_pabrik, lokasi]
    );

    res.status(201).json({ status: "Success", message: "Pabrik berhasil ditambahkan" });
  } catch (err) {
    handleError(res, err);
  }
});

router.put("/pabrik/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pabrik, lokasi } = req.body;

    if (!nama_pabrik || !lokasi) {
      return res.status(400).json({ status: "Fail", message: "Nama pabrik dan lokasi wajib diisi" });
    }

    const [result] = await db.query(
      "UPDATE pabrik SET nama_pabrik = ?, lokasi = ? WHERE idpabrik = ?",
      [nama_pabrik, lokasi, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pabrik tidak ditemukan" });
    }

    res.json({ status: "Success", message: "Pabrik berhasil diupdate" });
  } catch (err) {
    handleError(res, err);
  }
});

/////////////////////////
// USERS
/////////////////////////

router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT idusers, username, role FROM users");
    res.json({ status: "Success", data: rows });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;