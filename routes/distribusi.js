// routes/Distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

/**
 * ============================================
 * ENDPOINT TEST - Untuk cek apakah routes aktif
 * ============================================
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Distribusi routes aktif!',
    timestamp: new Date().toISOString()
  });
});

/**
 * ============================================
 * ENDPOINT UPLOAD DOKUMEN
 * Untuk upload Surat Jalan & Bukti Timbang
 * ============================================
 */
router.post('/upload', upload.fields([
  { name: 'surat_jalan', maxCount: 1 },
  { name: 'bukti_timbang', maxCount: 1 }
]), (req, res) => {
  try {
    // Cek apakah ada file yang diupload
    if (!req.files || (Object.keys(req.files).length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada file yang diupload'
      });
    }

    // Siapkan response data
    const uploadedFiles = {
      surat_jalan: req.files.surat_jalan ? req.files.surat_jalan[0].filename : null,
      bukti_timbang: req.files.bukti_timbang ? req.files.bukti_timbang[0].filename : null
    };

    // Return response sukses
    res.status(200).json({
      success: true,
      message: 'Upload berhasil',
      files: uploadedFiles,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload gagal',
      error: error.message
    });
  }
});

/**
 * ============================================
 * ENDPOINT GET SEMUA DISTRIBUSI
 * (Untuk testing koneksi database nanti)
 * ============================================
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint distribusi siap',
    endpoints: {
      test: 'GET /api/distribusi/test',
      upload: 'POST /api/distribusi/upload',
      getAll: 'GET /api/distribusi'
    }
  });
});

// Export router
module.exports = router;