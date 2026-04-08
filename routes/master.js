const express = require("express");
const router = express.Router();
const db = require("../config/database");

/////////////////////////
// SUPIR
/////////////////////////

// GET Supir
router.get("/supir", (req, res) => {
  db.query("SELECT * FROM supir", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

// POST Supir
router.post("/supir", (req, res) => {
  const data = req.body;
  db.query("INSERT INTO supir SET ?", data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Supir berhasil ditambahkan" });
  });
});

// UPDATE Supir
router.put("/supir/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  db.query("UPDATE supir SET ? WHERE idsupir = ?", [data, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Supir tidak ditemukan" });
    res.json({ message: "Supir berhasil diupdate" });
  });
});

// DELETE Supir
router.delete("/supir/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM supir WHERE idsupir=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Supir berhasil dihapus" });
  });
});

/////////////////////////
// TRUK
/////////////////////////

router.get("/truk", (req, res) => {
  db.query("SELECT * FROM truk", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

router.post("/truk", (req, res) => {
  const data = req.body;
  db.query("INSERT INTO truk SET ?", data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Truk berhasil ditambahkan" });
  });
});

// UPDATE Truk
router.put("/truk/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  db.query("UPDATE truk SET ? WHERE idtruk = ?", [data, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Truk tidak ditemukan" });
    res.json({ message: "Truk berhasil diupdate" });
  });
});

router.delete("/truk/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM truk WHERE idtruk=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Truk berhasil dihapus" });
  });
});

/////////////////////////
// KEBUN
/////////////////////////

router.get("/kebun", (req, res) => {
  db.query("SELECT * FROM kebun", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

router.post("/kebun", (req, res) => {
  const data = req.body;
  db.query("INSERT INTO kebun SET ?", data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Kebun berhasil ditambahkan" });
  });
});

// UPDATE Kebun
router.put("/kebun/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  db.query("UPDATE kebun SET ? WHERE idkebun = ?", [data, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Kebun tidak ditemukan" });
    res.json({ message: "Kebun berhasil diupdate" });
  });
});

router.delete("/kebun/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM kebun WHERE idkebun=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Kebun berhasil dihapus" });
  });
});

/////////////////////////
// PABRIK
/////////////////////////

router.get("/pabrik", (req, res) => {
  db.query("SELECT * FROM pabrik", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

router.post("/pabrik", (req, res) => {
  const data = req.body;
  db.query("INSERT INTO pabrik SET ?", data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pabrik berhasil ditambahkan" });
  });
});

// UPDATE Pabrik
router.put("/pabrik/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  db.query("UPDATE pabrik SET ? WHERE idpabrik = ?", [data, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Pabrik tidak ditemukan" });
    res.json({ message: "Pabrik berhasil diupdate" });
  });
});

router.delete("/pabrik/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM pabrik WHERE idpabrik=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pabrik berhasil dihapus" });
  });
});

/////////////////////////
// USERS
/////////////////////////

router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

module.exports = router;