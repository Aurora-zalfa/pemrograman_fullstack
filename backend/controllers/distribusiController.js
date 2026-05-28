// controllers/distribusiController.js
const distribusiModel = require("../models/distribusiModel");
const { validateDistribusi, validateId, validateFileUpload } = require("../utils/validator");
const errorHandler = require("../utils/errorhandler");
const fs = require('fs');
const path = require('path');

// ============================================
// GET ALL
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
// GET BY ID
// ============================================
exports.getDistribusiById = (req, res) => {
  const id = req.params.id;
  distribusiModel.getDistribusiById(id, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else if (result.length === 0) {
      res.status(404).json({ message: "Data tidak ditemukan" });
    } else {
      res.json(result[0]);
    }
  });
};

// ============================================
// CREATE DENGAN UPLOAD FILE (SPRINT 8/9)
// ============================================
exports.createDistribusi = async (req, res) => {
  try {
    const data = req.body;

    // Status awal wajib 'menunggu_memuat' untuk tracking
    data.status = 'menunggu_memuat';

    // Validasi field wajib
    if (!data.tanggal_kirim || !data.berat_tbs) {
      return res.status(400).json({ 
        success: false, 
        message: "Tanggal kirim dan berat TBS wajib diisi" 
      });
    }

    // Validasi file upload (jika ada req.files dari multer)
    if (!req.files || !req.files.surat_jalan || !req.files.bukti_timbang) {
      return res.status(400).json({ 
        success: false, 
        message: "Surat Jalan dan Bukti Timbang wajib diupload" 
      });
    }

    // Path file yang diupload (konversi backslash untuk Windows)
    const suratJalanPath = req.files.surat_jalan[0].path.replace(/\\/g, '/');
    const buktiTimbangPath = req.files.bukti_timbang[0].path.replace(/\\/g, '/');

    // ================= TAMBAHAN VALIDASI SPRINT =================
    // Cek ketersediaan Supir (jika supir_idsupir ada)
    if (data.supir_idsupir) {
      const supir = await distribusiModel.checkSupirStatus(data.supir_idsupir);
      if (!supir) {
        return res.status(404).json({ message: "Data supir tidak ditemukan" });
      }
      if (supir.status !== 'tersedia') {
        return res.status(400).json({ 
          success: false, 
          message: `Gagal! Supir saat ini sedang '${supir.status}'. Pilih supir lain yang tersedia.` 
        });
      }
    }

    // Cek ketersediaan Truk (jika truk_idtruk ada)
    if (data.truk_idtruk) {
      const truk = await distribusiModel.checkTrukStatus(data.truk_idtruk);
      if (!truk) {
        return res.status(404).json({ message: "Data truk tidak ditemukan" });
      }
      if (truk.status !== 'tersedia') {
        return res.status(400).json({ 
          success: false, 
          message: `Gagal! Truk saat ini sedang '${truk.status}'. Pilih truk lain yang tersedia.` 
        });
      }
    }
    // ============================================================

    // Siapkan data untuk insert ke database
    const distribusiData = {
      tanggal_kirim: data.tanggal_kirim,
      berat_tbs: data.berat_tbs,
      surat_jalan: suratJalanPath,
      bukti_timbang: buktiTimbangPath,
      status: data.status,
      supir_idsupir: data.supir_idsupir || null,
      truk_idtruk: data.truk_idtruk || null,
      kebun_idkebun: data.kebun_idkebun || null,
      pabrik_idpabrik: data.pabrik_idpabrik || null,
    };

    // Insert ke database
    distribusiModel.createDistribusi(distribusiData, (err, result) => {
      if (err) {
        // Jika insert gagal, hapus file yang sudah terupload (rollback)
        if (fs.existsSync(suratJalanPath)) fs.unlinkSync(suratJalanPath);
        if (fs.existsSync(buktiTimbangPath)) fs.unlinkSync(buktiTimbangPath);
        
        return res.status(500).json({ 
          success: false, 
          message: "Gagal menyimpan ke database", 
          error: err.message 
        });
      }

      res.status(201).json({
        success: true,
        message: "Distribusi berhasil dibuat dengan upload dokumen",
        data: {
          iddistribusi: result.insertId,
          surat_jalan: suratJalanPath,
          bukti_timbang: buktiTimbangPath,
          status_awal: data.status
        }
      });
    });

  } catch (error) {
    console.error("Create distribusi error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Terjadi kesalahan server", 
      error: error.message 
    });
  }
};

// ============================================
// UPDATE STATUS (SUDAH ADA - TIDAK DIUBAH)
// ============================================
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

    // 1. Ambil data lama
    const rows = await distribusiModel.getById(id);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Data distribusi tidak ditemukan" });
    }

    const status_sekarang = rows[0].status;
    const indexSekarang = alurStatus.indexOf(status_sekarang);
    const indexBaru = alurStatus.indexOf(status_baru);

    // 2. Logika Validasi Alur
    if (indexBaru === indexSekarang + 1 || status_baru === 'ditolak') {
      
      // Update status
      await distribusiModel.updateStatus(id, status_baru);
      
      res.json({
        success: true,
        message: `Status berhasil diperbarui dari [${status_sekarang}] menjadi [${status_baru}]`,
        updatedBy: req.user?.username || 'unknown'
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

// ============================================
// UPDATE DISTRIBUSI (Dengan File Deletion - Sprint 7)
// ============================================
exports.updateDistribusi = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // Cek data lama untuk file deletion
    const oldData = await distribusiModel.getById(id);
    if (!oldData || oldData.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // Jika ada file baru diupload, hapus file lama
    const updatedFiles = {};
    
    if (req.files?.surat_jalan && oldData[0].surat_jalan) {
      const oldPath = path.join(__dirname, '..', oldData[0].surat_jalan);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log('✅ Old file deleted:', oldPath);
      }
      updatedFiles.surat_jalan = req.files.surat_jalan[0].path.replace(/\\/g, '/');
    }
    
    if (req.files?.bukti_timbang && oldData[0].bukti_timbang) {
      const oldPath = path.join(__dirname, '..', oldData[0].bukti_timbang);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log('✅ Old file deleted:', oldPath);
      }
      updatedFiles.bukti_timbang = req.files.bukti_timbang[0].path.replace(/\\/g, '/');
    }

    // Update data
    const updateData = { ...data };
    if (updatedFiles.surat_jalan) updateData.surat_jalan = updatedFiles.surat_jalan;
    if (updatedFiles.bukti_timbang) updateData.bukti_timbang = updatedFiles.bukti_timbang;

    distribusiModel.updateDistribusi(id, updateData, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Gagal update", error: err.message });
      }

      res.json({
        success: true,
        message: "Distribusi berhasil diupdate",
        data: {
          iddistribusi: id,
          updatedFiles: Object.keys(updatedFiles).length > 0 ? updatedFiles : undefined,
          updated_at: new Date().toISOString()
        }
      });
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// DELETE (SOFT DELETE - File TETAP Ada)
// ============================================
exports.deleteDistribusi = (req, res) => {
  const id = req.params.id;
  
  distribusiModel.deleteDistribusi(id, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Gagal hapus data", error: err.message });
    }

    res.json({
      success: true,
      message: "Data distribusi berhasil diarsipkan (Soft Delete) - File tetap tersimpan untuk restore",
      data: { iddistribusi: id }
    });
  });
};

// ============================================
// HARD DELETE (File JUGA Dihapus Permanen)
// ============================================
exports.deleteDistribusiPermanent = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Ambil data dulu untuk hapus file
    const rows = await distribusiModel.getById(id);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    const data = rows[0];
    const deletedFiles = {};

    // Hapus file fisik jika ada
    if (data.surat_jalan && fs.existsSync(data.surat_jalan)) {
      fs.unlinkSync(data.surat_jalan);
      deletedFiles.surat_jalan = data.surat_jalan;
      console.log('✅ File permanently deleted:', data.surat_jalan);
    }
    
    if (data.bukti_timbang && fs.existsSync(data.bukti_timbang)) {
      fs.unlinkSync(data.bukti_timbang);
      deletedFiles.bukti_timbang = data.bukti_timbang;
      console.log('✅ File permanently deleted:', data.bukti_timbang);
    }

    // Hapus dari database (hard delete)
    distribusiModel.deleteDistribusiPermanent(id, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Gagal hapus permanen", error: err.message });
      }

      res.json({
        success: true,
        message: "Data distribusi dan file terkait berhasil dihapus permanen",
        data: {
          iddistribusi: id,
          deletedFiles: Object.keys(deletedFiles).length > 0 ? deletedFiles : undefined
        }
      });
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};