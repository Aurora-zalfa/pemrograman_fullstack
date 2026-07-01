// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');
const { validateId, validateFileUpload } = require('../utils/validator');
const path = require('path');
const fs = require('fs');
const { verifyToken, isManager } = require('../middleware/auth');
const distribusiController = require('../controllers/distribusiController');

// ============================================
// GET ALL
// ============================================
router.get('/', verifyToken, distribusiController.getDistribusi);

// ============================================
// GET ARCHIVED
// ============================================
router.get('/archived', verifyToken, isManager, async (req, res) => {
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
      WHERE d.is_deleted = 1
      ORDER BY d.updated_at DESC
    `;
    const [rows] = await db.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// GET BY ID
// ============================================
router.get('/:id', verifyToken, distribusiController.getDistribusiById);

// ============================================
// CREATE
// ============================================
router.post(
  '/',
  upload.fields([
    { name: 'surat_jalan', maxCount: 1 },
    { name: 'bukti_timbang', maxCount: 1 }
  ]),
  distribusiController.createDistribusi
);

// ============================================
// UPDATE
// ============================================
router.put(
  '/:id',
  upload.fields([
    { name: 'surat_jalan', maxCount: 1 },
    { name: 'bukti_timbang', maxCount: 1 }
  ]),
  distribusiController.updateDistribusi
);

// ============================================
// UPDATE STATUS
// ============================================
router.patch('/:id/status', distribusiController.updateStatus);
router.put('/:id/status', distribusiController.updateStatus);

// ============================================
// DELETE (SOFT DELETE)
// ============================================
router.delete('/:id', distribusiController.deleteDistribusi);

// ============================================
// HARD DELETE
// ============================================
router.delete('/:id/permanent', distribusiController.deleteDistribusiPermanent);

// ============================================
// ARCHIVE (Manajer only)
// ============================================
router.put('/:id/archive', verifyToken, isManager, async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE distribusi SET is_deleted = 1 WHERE iddistribusi = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.json({ success: true, message: 'Data berhasil diarsipkan' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;