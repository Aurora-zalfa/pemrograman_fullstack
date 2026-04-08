const express = require('express');
const router = express.Router();
const db = require('../config/database');


// Detail laporan harian
router.get('/', (req, res) => {
  const { tanggal } = req.query;

  let query = `SELECT * FROM distribusi`;
  let params = [];

  if (tanggal) {
    query += ` WHERE DATE(tanggal_kirim) = ?`;
    params.push(tanggal);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data laporan",
        error: err.message
      });
    }

    res.json({
      message: tanggal 
        ? "Data laporan harian berhasil difilter berdasarkan tanggal"
        : "Semua data laporan berhasil diambil",
      total_data: results.length,
      data: results
    });
  });
});


// Summary laporan harian
router.get('/summary', (req, res) => {
  const { tanggal } = req.query;

  // validasi wajib isi tanggal
  if (!tanggal) {
    return res.status(400).json({
      message: "Parameter tanggal wajib diisi (contoh: ?tanggal=2026-04-02)"
    });
  }

  const query = `
    SELECT 
      COUNT(*) as total_pengiriman,
      SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai,
      SUM(CASE WHEN status = 'proses' THEN 1 ELSE 0 END) as proses,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
    FROM distribusi
    WHERE DATE(tanggal_kirim) = ?
  `;

  db.query(query, [tanggal], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil summary laporan",
        error: err.message
      });
    }

    res.json({
      message: "Summary laporan harian berhasil diambil",
      tanggal: tanggal,
      data: results[0]
    });
  });
});


module.exports = router;