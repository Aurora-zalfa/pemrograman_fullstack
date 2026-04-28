// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const authorizeRoles = require('../middleware/authRole'); // Middleware baru kamu
const { validateId } = require('../utils/validator');

/**
 * ============================================
 * CREATE DISTRIBUSI
 * ============================================
 */
router.post(
  '/',
  verifyToken,
  authorizeRoles('petugas', 'manajer'), // TAMBAHAN RBAC: Keduanya bisa buat data
  upload.fields([
    { name: 'surat_jalan', maxCount: 1 },
    { name: 'bukti_timbang', maxCount: 1 }
  ]),
  async (req, res) => {
    // ... (kode insert kamu sudah benar, sudah pakai is_deleted=0 dan NOW())
  }
);

/**
 * ============================================
 * UPDATE STATUS (Fitur Tracking Kamu)
 * ============================================
 */
router.put(
  '/:id/status', 
  verifyToken, 
  authorizeRoles('petugas', 'manajer'), // TAMBAHAN RBAC: Petugas & Manajer bisa update
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status: status_baru } = req.body;
      const alurStatus = ["menunggu_memuat", "dalam_perjalanan", "tiba_di_pabrik", "selesai"];

      const [rows] = await db.query('SELECT status FROM distribusi WHERE iddistribusi = ? AND is_deleted = 0', [id]);
      if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

      const status_sekarang = rows[0].status;
      const indexSekarang = alurStatus.indexOf(status_sekarang);
      const indexBaru = alurStatus.indexOf(status_baru);

      if (indexBaru === indexSekarang + 1 || status_baru === 'ditolak') {
        // TAMBAHAN TRACKING: Tambahkan updated_at = NOW() untuk audit trail
        await db.query(
          'UPDATE distribusi SET status = ?, updated_at = NOW() WHERE iddistribusi = ?', 
          [status_baru, id]
        );
        
        res.json({ 
          success: true, 
          message: `Status diupdate ke ${status_baru}`,
          updatedAt: new Date() // Mengirim balik waktu update ke frontend
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: `Status saat ini [${status_sekarang}], tidak bisa loncat ke [${status_baru}]` 
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * ============================================
 * DELETE DISTRIBUSI (Soft Delete & RBAC)
 * ============================================
 */
router.delete(
  '/:id', 
  verifyToken, 
  authorizeRoles('manajer'), // TAMBAHAN RBAC: HANYA Manajer yang boleh hapus (Soft Delete)
  async (req, res) => {
    try {
      const { id } = req.params;
      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

      // Logic Zainab: Soft Delete agar histori transaksi aman
      const [result] = await db.query(
        "UPDATE distribusi SET is_deleted = 1, updated_at = NOW() WHERE iddistribusi = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
      }

      res.json({
        success: true,
        message: 'Data berhasil diarsipkan oleh Manajer',
        data: { iddistribusi: id }
      });

    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal hapus data', error: error.message });
    }
});

module.exports = router;