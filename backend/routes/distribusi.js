// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { validateId } = require('../utils/validator');

/**
 * STRATEGI TRANSAKSI:
 * 1. Saat CREATE: Validasi agar ID Master (Supir, Truk, dll) yang digunakan is_deleted = 0.
 * 2. Saat DELETE: Gunakan Soft Delete (is_deleted = 1) agar histori pengiriman tidak hilang.
 */

/**
 * ============================================
 * CREATE DISTRIBUSI
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

      // 1. VALIDASI DATA WAJIB
      if (!tanggal_kirim || !berat_tbs || !users_idusers || !supir_idsupir || !truk_idtruk) {
        return res.status(400).json({
          success: false,
          message: 'Data wajib tidak lengkap (Tanggal, Berat, User, Supir, dan Truk wajib diisi)'
        });
      }

      // 2. VALIDASI DATA MASTER AKTIF (Mencegah penggunaan supir/truk yang sudah dihapus)
      const [supir] = await db.query("SELECT idsupir FROM supir WHERE idsupir = ? AND is_deleted = 0", [supir_idsupir]);
      const [truk] = await db.query("SELECT idtruk FROM truk WHERE idtruk = ? AND is_deleted = 0", [truk_idtruk]);

      if (supir.length === 0 || truk.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Supir atau Truk yang dipilih sudah tidak aktif/dihapus dari sistem.'
        });
      }

      const surat_jalan = req.files?.surat_jalan
        ? `uploads/surat_jalan/${req.files.surat_jalan[0].filename}`
        : null;

      const bukti_timbang = req.files?.bukti_timbang
        ? `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`
        : null;

      const query = `
        INSERT INTO distribusi 
        (tanggal_kirim, berat_tbs, surat_jalan, bukti_timbang, status,
         users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik, 
         is_deleted, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())
      `;

      const [result] = await db.query(query, [
        tanggal_kirim, berat_tbs, surat_jalan, bukti_timbang, status,
        users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik
      ]);

      res.status(201).json({
        success: true,
        message: 'Data distribusi berhasil dibuat',
        data: { iddistribusi: result.insertId }
      });

    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal membuat distribusi', error: error.message });
    }
  }
);

/**
 * ============================================
 * GET SEMUA DISTRIBUSI (Hanya yang tidak di-soft-delete)
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
      WHERE d.is_deleted = 0
      ORDER BY d.iddistribusi DESC
    `;

    const [rows] = await db.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ============================================
 * UPDATE STATUS (Tetap menjaga validasi alur)
 * ============================================
 */
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status: status_baru } = req.body;
    const alurStatus = ["menunggu_memuat", "dalam_perjalanan", "tiba_di_pabrik", "selesai"];

    const [rows] = await db.query('SELECT status FROM distribusi WHERE iddistribusi = ? AND is_deleted = 0', [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Data distribusi tidak ditemukan atau sudah dihapus" });

    const status_sekarang = rows[0].status;
    const indexSekarang = alurStatus.indexOf(status_sekarang);
    const indexBaru = alurStatus.indexOf(status_baru);

    if (indexBaru === indexSekarang + 1 || status_baru === 'ditolak') {
      await db.query('UPDATE distribusi SET status = ? WHERE iddistribusi = ?', [status_baru, id]);
      res.json({ success: true, message: `Status diupdate ke ${status_baru}` });
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
 * DELETE DISTRIBUSI (SOFT DELETE)
 * ============================================
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return res.status(400).json({ success: false, message: idError });

    // Mengubah is_deleted menjadi 1, bukan menghapus baris secara fisik
    const [result] = await db.query(
      "UPDATE distribusi SET is_deleted = 1 WHERE iddistribusi = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Data distribusi berhasil diarsipkan (Soft Delete)',
      data: { iddistribusi: id }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal hapus data', error: error.message });
  }
});

module.exports = router;