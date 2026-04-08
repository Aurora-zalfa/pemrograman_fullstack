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
  db.query("INSERT INTO supir SET ?", data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Supir berhasil ditambahkan" });
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
  db.query("INSERT INTO truk SET ?", data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Truk berhasil ditambahkan" });
  });
});

router.delete("/truk/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM truk WHERE idtruk=?", [id], (err, result) => {
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
  db.query("INSERT INTO kebun SET ?", data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Kebun berhasil ditambahkan" });
  });
});

router.delete("/kebun/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM kebun WHERE idkebun=?", [id], (err, result) => {
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
  db.query("INSERT INTO pabrik SET ?", data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pabrik berhasil ditambahkan" });
  });
});

router.delete("/pabrik/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM pabrik WHERE idpabrik=?", [id], (err, result) => {
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