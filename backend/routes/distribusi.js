// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');

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

      // VALIDASI WAJIB
      if (
        !tanggal_kirim ||
        !berat_tbs ||
        !users_idusers ||
        !supir_idsupir ||
        !truk_idtruk ||
        !kebun_idkebun ||
        !pabrik_idpabrik
      ) {
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
        message: 'Distribusi berhasil dibuat',
        data: {
          iddistribusi: result.insertId,
          tanggal_kirim,
          berat_tbs,
          status,
          surat_jalan,
          bukti_timbang
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Gagal membuat distribusi',
        error: error.message
      });
    }
  }
);


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
    res.status(500).json({
      success: false,
      message: error.message
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


/**
 * ============================================
 * UPDATE STATUS
 * ============================================
 */
router.put('/:id/status', async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    // Validasi ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID distribusi wajib diisi"
      });
    }

    // Validasi status
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status wajib diisi"
      });
    }

    // Validasi status yang diizinkan
    const validStatus = [
      "menunggu_memuat",
      "dalam_perjalanan",
      "tiba_di_pabrik",
      "selesai",
      "ditolak"
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid"
      });
    }

    const query = `
      UPDATE distribusi
      SET status = ?
      WHERE iddistribusi = ?
    `;

    const [result] = await db.query(query, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data distribusi tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Status berhasil diupdate",
      data: {
        iddistribusi: id,
        status: status
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gagal update status",
      error: error.message
    });
  }
});


/**
 * ============================================
 * UPDATE DISTRIBUSI
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
      status
    } = req.body;

    const surat_jalan = req.files?.surat_jalan 
      ? `uploads/surat_jalan/${req.files.surat_jalan[0].filename}` 
      : null;

    const bukti_timbang = req.files?.bukti_timbang 
      ? `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}` 
      : null;

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

});


/**
 * ============================================
 * DELETE
 * ============================================
 */
router.delete('/:id', async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM distribusi WHERE iddistribusi = ?",
      [id]
    );

    res.json({
      success: true,
      message: 'Data berhasil dihapus'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }

});


module.exports = router;