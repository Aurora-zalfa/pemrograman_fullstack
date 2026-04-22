// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
console.log("Cek verifyToken:", verifyToken); // Tambahkan ini

// ============================================
// ✅ TAMBAHKAN KODE INI DI SINI:
// ============================================
const { validateFileUpload, validateId } = require('../utils/validator');
const errorHandler = require('../utils/errorhandler');
const { verify } = require('jsonwebtoken');

/**
 * ============================================
 * ENDPOINT TEST
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
 * CREATE DISTRIBUSI + UPLOAD
 * ============================================
 */
router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'surat_jalan', maxCount: 1 },
    { name: 'bukti_timbang', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        tanggal_kirim,
        berat_tbs,
        users_idusers,
        supir_idsupir,
        truk_idtruk,
        kebun_idkebun,
        pabrik_idpabrik,
        status = 'menunggu_memuat'
      } = req.body;

    // VALIDASI
    if (!tanggal_kirim || !berat_tbs || !users_idusers) {
      return res.status(400).json({
        success: false,
        message: 'Data wajib tidak lengkap'
      });
    }

      // Ambil file upload jika ada
      const surat_jalan = req.files?.surat_jalan
        ? `uploads/surat_jalan/${req.files.surat_jalan[0].filename}`
        : null;

      const bukti_timbang = req.files?.bukti_timbang
        ? `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`
        : null;

      const query = `
        INSERT INTO distribusi 
        (tanggal_kirim, berat_tbs, surat_jalan, bukti_timbang, status,
         users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const values = [
        tanggal_kirim,
        berat_tbs,
        surat_jalan,
        bukti_timbang,
        status,
        users_idusers,
        supir_idsupir,
        truk_idtruk,
        kebun_idkebun,
        pabrik_idpabrik
      ];

      const [result] = await db.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Data distribusi berhasil dibuat',
      data: {
        iddistribusi: result.insertId
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat data distribusi',
      error: error.message
    });
  }
});

/**
 * ============================================
 * GET SEMUA DISTRIBUSI
 * ============================================
 */
router.get('/', async (req, res) => {
  try {

    const query = `
      SELECT 
      d.*,
      k.nama_kebun,
      s.nama_supir,
      t.no_polisi,
      p.nama_pabrik
      FROM distribusi d
      LEFT JOIN kebun k ON d.kebun_idkebun = k.idkebun
      LEFT JOIN supir s ON d.supir_idsupir = s.idsupir
      LEFT JOIN truk t ON d.truk_idtruk = t.idtruk
      LEFT JOIN pabrik p ON d.pabrik_idpabrik = p.idpabrik
      ORDER BY d.iddistribusi DESC
    `;

    const [rows] = await db.query(query);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Get distribusi error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data distribusi',
      error: error.message
    });
  }
});


/**
 * ============================================
 * GET BY ID
 * ============================================
 */
router.get('/:id', async (req, res) => {
  try {

    const { id } = req.params;

    // ============================================
    // ✅ TAMBAHKAN VALIDASI ID DI SINI:
    // ============================================
    const idError = validateId(id);
    if (idError) {
      return res.status(400).json({
        success: false,
        message: idError,
        timestamp: new Date().toISOString()
      });
    }
    // ============================================

    const query = `
      SELECT * FROM distribusi
      WHERE iddistribusi = ?
    `;

    const [rows] = await db.query(query, [id]);

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error('Get distribusi by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data distribusi',
      error: error.message
    });
  }
});


/**
 * ============================================
 * UPDATE STATUS
 * ============================================
 */
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status: status_baru } = req.body;

    // 1. Definisikan Alur
    const alurStatus = ["menunggu_memuat", "dalam_perjalanan", "tiba_di_pabrik", "selesai"];

    // 2. Ambil status lama dari DB
    const [rows] = await db.query('SELECT status FROM distribusi WHERE iddistribusi = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    const status_sekarang = rows[0].status;
    const indexSekarang = alurStatus.indexOf(status_sekarang);
    const indexBaru = alurStatus.indexOf(status_baru);

    // 3. Validasi Urutan (Hanya boleh maju 1 langkah atau jadi 'ditolak')
    if (indexBaru === indexSekarang + 1 || status_baru === 'ditolak') {
      await db.query('UPDATE distribusi SET status = ? WHERE iddistribusi = ?', [status_baru, id]);
      res.json({ success: true, message: `Status diupdate ke ${status_baru}` });
    } else {
      res.status(400).json({ 
        success: false, 
        message: `Gagal! Status saat ini [${status_sekarang}], tidak bisa langsung ke [${status_baru}]` 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


/**
 * ============================================
 * UPDATE DISTRIBUSI
 * ============================================
 */
router.put('/:id', verifyToken, upload.fields([
  { name: 'surat_jalan', maxCount: 1 },
  { name: 'bukti_timbang', maxCount: 1 }
]), async (req, res) => {

  try {

    const { id } = req.params;

    const {
      tanggal_kirim,
      berat_tbs,
      status
    } = req.body;

    // ============================================
    // ✅ TAMBAHKAN VALIDASI ID DI SINI:
    // ============================================
    const idError = validateId(id);
    if (idError) {
      return res.status(400).json({
        success: false,
        message: idError,
        timestamp: new Date().toISOString()
      });
    }
    // ============================================

    // Cek apakah data ada
    const checkQuery = 'SELECT * FROM distribusi WHERE iddistribusi = ?';
    const [existing] = await db.query(checkQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data distribusi tidak ditemukan'
      });
    }

    // Ambil file lama dari database
    const oldData = existing[0];

    // Handle upload file baru (jika ada)
    let surat_jalan = oldData.surat_jalan;
    let bukti_timbang = oldData.bukti_timbang;

    if (req.files.surat_jalan) {
      surat_jalan = `uploads/surat_jalan/${req.files.surat_jalan[0].filename}`;
    }

    if (req.files?.bukti_timbang) {
      bukti_timbang = `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`;
    }

    const query = `
      UPDATE distribusi 
      SET 
      tanggal_kirim = COALESCE(?, tanggal_kirim),
      berat_tbs = COALESCE(?, berat_tbs),
      surat_jalan = COALESCE(?, surat_jalan),
      bukti_timbang = COALESCE(?, bukti_timbang),
      status = COALESCE(?, status)
      WHERE iddistribusi = ?
    `;

    await db.query(query, [
      tanggal_kirim,
      berat_tbs,
      surat_jalan,
      bukti_timbang,
      status,
      id
    ]);

    res.json({
      success: true,
      message: 'Distribusi berhasil diupdate'
    });

  } catch (error) {
    console.error('Update distribusi error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update data distribusi',
      error: error.message
    });
  }

});


/**
 * ============================================
 * DELETE
 * ============================================
 */
router.delete('/:id', verifyToken,async (req, res) => {

  try {

    const { id } = req.params;

    // ============================================
    // ✅ TAMBAHKAN VALIDASI ID DI SINI:
    // ============================================
    const idError = validateId(id);
    if (idError) {
      return res.status(400).json({
        success: false,
        message: idError,
        timestamp: new Date().toISOString()
      });
    }
    // ============================================

    await db.query(
      "DELETE FROM distribusi WHERE iddistribusi = ?",
      [id]
    );

    res.json({
      success: true,
      message: 'Data distribusi berhasil dihapus',
      data: {
        iddistribusi: id
      }
    });

  } catch (error) {
    console.error('Delete distribusi error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal hapus data distribusi',
      error: error.message
    });
  }
});

/**
 * ============================================
 * ENDPOINT TEST
 * Method: GET
 * URL: /api/distribusi/test
 * ============================================
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Distribusi routes aktif!',
    timestamp: new Date().toISOString(),
    endpoints: {
      create: 'POST /api/distribusi',
      getAll: 'GET /api/distribusi',
      getById: 'GET /api/distribusi/:id',
      updateStatus: 'PUT /api/distribusi/:id/status',
      update: 'PUT /api/distribusi/:id',
      delete: 'DELETE /api/distribusi/:id'
    }
  });
});

// ⚠️ WAJIB ADA: Export router
module.exports = router;

// Tambahkan ini untuk test tanpa file
router.post('/test-no-upload', async (req, res) => {
  try {
    const {
      tanggal_kirim,
      berat_tbs,
      users_idusers,
      supir_idsupir,
      truk_idtruk,
      kebun_idkebun,
      pabrik_idpabrik,
      status = 'menunggu_memuat'
    } = req.body;

    const query = `
      INSERT INTO distribusi 
      (tanggal_kirim, berat_tbs, status, users_idusers, supir_idsupir, 
       truk_idtruk, kebun_idkebun, pabrik_idpabrik, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      tanggal_kirim,
      berat_tbs,
      status,
      users_idusers,
      supir_idsupir,
      truk_idtruk,
      kebun_idkebun,
      pabrik_idpabrik
    ];

    const [result] = await db.query(query, values);

    res.json({
      success: true,
      message: 'Data distribusi berhasil dibuat (tanpa upload)',
      data: {
        iddistribusi: result.insertId
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

});


module.exports = router;