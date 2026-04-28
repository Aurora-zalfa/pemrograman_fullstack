// controllers/distribusiController.js
const distribusiModel = require("../models/distribusiModel");
const { validateDistribusi, validateId, validateFileUpload } = require("../utils/validator");
const errorHandler = require("../utils/errorhandler");
const fs = require('fs');

// ============================================
// FUNGSI YANG SUDAH ADA (DIPERBAIKI)
// ============================================

// GET
exports.getDistribusi = (req, res) => {
  distribusiModel.getDistribusi((err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
};


// POST (SZD & ROR Collaboration)
exports.createDistribusi = (req, res) => {
  const data = req.body;

  // Status awal wajib 'menunggu_memuat' untuk tracking
  data.status = 'menunggu_memuat';

  // Validasi sederhana
  if (!data.tanggal_kirim || !data.berat_tbs) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  distribusiModel.createDistribusi(data, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        success: true,
        message: "Distribusi berhasil ditambah",
        status_awal: data.status
      });
    }
  });
};


exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status_baru = req.body.status;

    const alurStatus = [
      'menunggu_memuat',
      'dalam_perjalanan',
      'tiba_di_pabrik',
      'selesai'
    ];

    // 1. Ambil data lama (Sekarang pakai await)
    const rows = await distribusiModel.getById(id);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Data distribusi tidak ditemukan" });
    }

    const status_sekarang = rows[0].status;
    const indexSekarang = alurStatus.indexOf(status_sekarang);
    const indexBaru = alurStatus.indexOf(status_baru);

    // 2. Logika Validasi Alur
    if (indexBaru === indexSekarang + 1 || status_baru === 'ditolak') {
      
      // Update status (Pakai await)
      await distribusiModel.updateStatus(id, status_baru);
      
      res.json({
        success: true,
        message: `Status berhasil diperbarui dari [${status_sekarang}] menjadi [${status_baru}]`,
        updatedBy: req.user.username // Bonus: Nama pengubah dari Token
      });

    } else {
      return res.status(400).json({
        success: false,
        message: `Urutan status salah! Dari '${status_sekarang}' tidak bisa langsung ke '${status_baru}'.`
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};