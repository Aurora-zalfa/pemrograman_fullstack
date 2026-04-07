const express = require("express");
const router = express.Router();
const db = require("../config/database");

// 1. Endpoint Data Master Supir
router.get("/supir", (req, res) => {
  db.query("SELECT * FROM supir", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

// 2. Endpoint Data Master Truk
router.get("/truk", (req, res) => {
  db.query("SELECT * FROM truk", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

// 3. Endpoint Data Master Kebun
router.get("/kebun", (req, res) => {
  db.query("SELECT * FROM kebun", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

// 4. Endpoint Data Master Pabrik (Tambahan)
router.get("/pabrik", (req, res) => {
  db.query("SELECT * FROM pabrik", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

// 5. Endpoint Data Master Users (Tambahan)
router.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ status: "Success", data: result });
  });
});

module.exports = router;