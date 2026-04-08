// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');

/**
 * ============================================
 * ENDPOINT 1: CREATE DISTRIBUSI + UPLOAD
 * Method: POST
 * URL: /api/distribusi
 * ============================================
 */
router.post('/', upload.fields([
  { name: 'surat_jalan', maxCount: 1 },
  { name: 'bukti_timbang', maxCount: 1 }
]), async (req, res) => {
  try {
    // 1. Ambil data dari request body
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

    // 2. Ambil nama file yang diupload (jika ada)
    const surat_jalan = req.files.surat_jalan 
      ? `uploads/surat_jalan/${req.files.surat_jalan[0].filename}` 
      : null;
    
    const bukti_timbang = req.files.bukti_timbang 
      ? `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}` 
      : null;

    // 3. Validasi data wajib
    if (!tanggal_kirim || !berat_tbs || !users_idusers || !supir_idsupir || 
        !truk_idtruk || !kebun_idkebun || !pabrik_idpabrik) {
      return res.status(400).json({
        success: false,
        message: 'Data wajib tidak lengkap'
      });
    }

    // 4. Insert ke database
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

    // 5. Return response
    res.status(201).json({
      success: true,
      message: 'Data distribusi berhasil dibuat',
      data: {
        iddistribusi: result.insertId,
        tanggal_kirim,
        berat_tbs,
        surat_jalan,
        bukti_timbang,
        status,
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Create distribusi error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat data distribusi',
      error: error.message
    });
  }
});

/**
 * ============================================
 * ENDPOINT 2: GET SEMUA DISTRIBUSI
 * Method: GET
 * URL: /api/distribusi
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
        p.nama_pabrik,
        u.username
      FROM distribusi d
      LEFT JOIN kebun k ON d.kebun_idkebun = k.idkebun
      LEFT JOIN supir s ON d.supir_idsupir = s.idsupir
      LEFT JOIN truk t ON d.truk_idtruk = t.idtruk
      LEFT JOIN pabrik p ON d.pabrik_idpabrik = p.idpabrik
      LEFT JOIN users u ON d.users_idusers = u.idusers
      ORDER BY d.created_at DESC
    `;

    const [rows] = await db.query(query);

    res.json({
      success: true,
      message: 'Data distribusi berhasil diambil',
      data: rows,
      total: rows.length
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
 * ENDPOINT 3: GET DISTRIBUSI BY ID
 * Method: GET
 * URL: /api/distribusi/:id
 * ============================================
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        d.*,
        k.nama_kebun,
        s.nama_supir,
        t.no_polisi,
        p.nama_pabrik,
        u.username
      FROM distribusi d
      LEFT JOIN kebun k ON d.kebun_idkebun = k.idkebun
      LEFT JOIN supir s ON d.supir_idsupir = s.idsupir
      LEFT JOIN truk t ON d.truk_idtruk = t.idtruk
      LEFT JOIN pabrik p ON d.pabrik_idpabrik = p.idpabrik
      LEFT JOIN users u ON d.users_idusers = u.idusers
      WHERE d.iddistribusi = ?
    `;

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data distribusi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Data distribusi berhasil diambil',
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
 * ENDPOINT 4: UPDATE STATUS DISTRIBUSI
 * Method: PUT
 * URL: /api/distribusi/:id/status
 * ============================================
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validasi status
    const validStatus = ['menunggu_memuat', 'dalam_perjalanan', 'tiba_di_pabrik', 'selesai', 'ditolak'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const query = `
      UPDATE distribusi 
      SET status = ?, updated_at = NOW()
      WHERE iddistribusi = ?
    `;

    const [result] = await db.query(query, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data distribusi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Status berhasil diupdate',
      data: {
        iddistribusi: id,
        status: status,
        updated_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update status',
      error: error.message
    });
  }
});

/**
 * ============================================
 * ENDPOINT 5: UPDATE DISTRIBUSI (TERMASUK UPLOAD ULANG)
 * Method: PUT
 * URL: /api/distribusi/:id
 * ============================================
 */
router.put('/:id', upload.fields([
  { name: 'surat_jalan', maxCount: 1 },
  { name: 'bukti_timbang', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tanggal_kirim,
      berat_tbs,
      status,
      users_idusers,
      supir_idsupir,
      truk_idtruk,
      kebun_idkebun,
      pabrik_idpabrik
    } = req.body;

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

    if (req.files.bukti_timbang) {
      bukti_timbang = `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`;
    }

    // Update database
    const query = `
      UPDATE distribusi 
      SET 
        tanggal_kirim = COALESCE(?, tanggal_kirim),
        berat_tbs = COALESCE(?, berat_tbs),
        surat_jalan = COALESCE(?, surat_jalan),
        bukti_timbang = COALESCE(?, bukti_timbang),
        status = COALESCE(?, status),
        users_idusers = COALESCE(?, users_idusers),
        supir_idsupir = COALESCE(?, supir_idsupir),
        truk_idtruk = COALESCE(?, truk_idtruk),
        kebun_idkebun = COALESCE(?, kebun_idkebun),
        pabrik_idpabrik = COALESCE(?, pabrik_idpabrik),
        updated_at = NOW()
      WHERE iddistribusi = ?
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
      pabrik_idpabrik,
      id
    ];

    await db.query(query, values);

    res.json({
      success: true,
      message: 'Data distribusi berhasil diupdate',
      data: {
        iddistribusi: id,
        surat_jalan,
        bukti_timbang,
        updated_at: new Date().toISOString()
      }
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
 * ENDPOINT 6: DELETE DISTRIBUSI
 * Method: DELETE
 * URL: /api/distribusi/:id
 * ============================================
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah data ada
    const checkQuery = 'SELECT * FROM distribusi WHERE iddistribusi = ?';
    const [existing] = await db.query(checkQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data distribusi tidak ditemukan'
      });
    }

    // Delete dari database
    const query = 'DELETE FROM distribusi WHERE iddistribusi = ?';
    await db.query(query, [id]);

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
      message: 'Gagal membuat data distribusi',
      error: error.message
    });
  }
});