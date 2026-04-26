const distribusiModel = require("../models/distribusiModel");
const db = require("../config/database"); // Perlu db untuk checkRelation jika model belum update
const { validateDistribusi, validateId, validateFileUpload } = require("../utils/validator");
const errorHandler = require("../utils/errorhandler");
const fs = require('fs');

// ============================================
// GET DISTRIBUSI (Hanya yang is_deleted = 0)
// ============================================
exports.getDistribusi = (req, res) => {
  distribusiModel.getDistribusi((err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
};

// ============================================
// CREATE DISTRIBUSI (Dengan Validasi Master Aktif)
// ============================================
exports.createDistribusi = async (req, res) => {
  try {
    const data = req.body;
    data.status = 'menunggu_memuat';

    // 1. Validasi Input Dasar
    if (!data.tanggal_kirim || !data.berat_tbs || !data.supir_idsupir || !data.truk_idtruk) {
      return res.status(400).json({ message: "Data tidak lengkap (Tanggal, Berat, Supir, dan Truk wajib)" });
    }

    // 2. Validasi Master Data Aktif (Integritas Data)
    // Memastikan Supir dan Truk yang dipilih tidak sedang dalam status is_deleted = 1
    const [supir] = await db.query("SELECT idsupir FROM supir WHERE idsupir = ? AND is_deleted = 0", [data.supir_idsupir]);
    const [truk] = await db.query("SELECT idtruk FROM truk WHERE idtruk = ? AND is_deleted = 0", [data.truk_idtruk]);

    if (supir.length === 0 || truk.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Gagal: Supir atau Truk yang dipilih sudah dinonaktifkan dari sistem." 
      });
    }

    // 3. Simpan ke Database
    distribusiModel.createDistribusi(data, (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({
          success: true,
          message: "Distribusi berhasil ditambah",
          iddistribusi: result.insertId
        });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================
// UPDATE STATUS (Alur Tracking)
// ============================================
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status_baru = req.body.status;
    const alurStatus = ['menunggu_memuat', 'dalam_perjalanan', 'tiba_di_pabrik', 'selesai'];

    const rows = await distribusiModel.getById(id);
    
    if (!rows || rows.length === 0 || rows[0].is_deleted === 1) {
      return res.status(404).json({ message: "Data distribusi tidak ditemukan atau sudah dihapus" });
    }

    const status_sekarang = rows[0].status;
    const indexSekarang = alurStatus.indexOf(status_sekarang);
    const indexBaru = alurStatus.indexOf(status_baru);

    if (indexBaru === indexSekarang + 1 || status_baru === 'ditolak') {
      await distribusiModel.updateStatus(id, status_baru);
      res.json({
        success: true,
        message: `Status diperbarui ke [${status_baru}]`,
        updatedBy: req.user.username 
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Urutan salah! Dari '${status_sekarang}' tidak bisa ke '${status_baru}'.`
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================
// DELETE DISTRIBUSI (SOFT DELETE)
// ============================================
exports.deleteDistribusi = async (req, res) => {
  try {
    const { id } = req.params;

    // Pastikan menggunakan fungsi update is_deleted di model
    // Jika di model belum ada, kita bisa panggil query langsung via db
    const [result] = await db.query(
      "UPDATE distribusi SET is_deleted = 1 WHERE iddistribusi = ?", 
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.json({
      success: true,
      message: "Data distribusi berhasil diarsipkan (Soft Delete) untuk menjaga histori laporan."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};