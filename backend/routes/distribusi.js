// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const { validateId, validateFileUpload } = require('../utils/validator');
const path = require('path');
const fs = require('fs');

/**
 * STRATEGI TRANSAKSI:
 * 1. Saat CREATE: Validasi agar ID Master (Supir, Truk, dll) yang digunakan is_deleted = 0.
 * 2. Saat DELETE: Gunakan Soft Delete (is_deleted = 1) agar histori pengiriman tidak hilang.
 * 3. Saat UPDATE: Hapus file lama jika ada upload baru (Sprint 7).
 * 4. Saat HARD DELETE: Hapus file fisik + data permanen (opsional, Sprint 7).
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

      // 2. VALIDASI DATA MASTER AKTIF
      const [supir] = await db.query("SELECT idsupir FROM supir WHERE idsupir = ? AND is_deleted = 0", [supir_idsupir]);
      const [truk] = await db.query("SELECT idtruk FROM truk WHERE idtruk = ? AND is_deleted = 0", [truk_idtruk]);

      if (supir.length === 0 || truk.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Supir atau Truk yang dipilih sudah tidak aktif/dihapus dari sistem.'
        });
      }

      // ============================================
      // ✅ SPRINT 7: VALIDASI FILE UPLOAD
      // ============================================
      const fileErrors = [];
      
      if (req.files?.surat_jalan) {
        const errors = validateFileUpload(req.files.surat_jalan, 'Surat Jalan');
        if (errors) fileErrors.push(...errors);
      }
      
      if (req.files?.bukti_timbang) {
        const errors = validateFileUpload(req.files.bukti_timbang, 'Bukti Timbang');
        if (errors) fileErrors.push(...errors);
      }
      
      if (fileErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validasi file gagal",
          errors: fileErrors,
          timestamp: new Date().toISOString()
        });
      }
      // ============================================

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
 * UPDATE DISTRIBUSI (LENGKAP) - SPRINT 7
 * ============================================
 */
router.put(
  '/:id',
  verifyToken,
  upload.fields([
    { name: 'surat_jalan', maxCount: 1 },
    { name: 'bukti_timbang', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const idError = validateId(id);
      if (idError) return res.status(400).json({ success: false, message: idError });

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

      // Cek apakah data ada dan belum di-soft-delete
      const checkQuery = 'SELECT * FROM distribusi WHERE iddistribusi = ? AND is_deleted = 0';
      const [existing] = await db.query(checkQuery, [id]);

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Data distribusi tidak ditemukan atau sudah diarsipkan'
        });
      }

      const oldData = existing[0];

      // ============================================
      // ✅ SPRINT 7: HAPUS FILE LAMA JIKA ADA UPLOAD BARU
      // ============================================
      let surat_jalan = oldData.surat_jalan;
      let bukti_timbang = oldData.bukti_timbang;

      // Jika ada upload surat_jalan baru, hapus file lama
      if (req.files?.surat_jalan && oldData.surat_jalan) {
        const oldSuratJalanPath = path.join(__dirname, '..', oldData.surat_jalan);
        if (fs.existsSync(oldSuratJalanPath)) {
          fs.unlinkSync(oldSuratJalanPath);
          console.log(`✅ Old file deleted: ${oldSuratJalanPath}`);
        }
        surat_jalan = `uploads/surat_jalan/${req.files.surat_jalan[0].filename}`;
      }

      // Jika ada upload bukti_timbang baru, hapus file lama
      if (req.files?.bukti_timbang && oldData.bukti_timbang) {
        const oldBuktiTimbangPath = path.join(__dirname, '..', oldData.bukti_timbang);
        if (fs.existsSync(oldBuktiTimbangPath)) {
          fs.unlinkSync(oldBuktiTimbangPath);
          console.log(`✅ Old file deleted: ${oldBuktiTimbangPath}`);
        }
        bukti_timbang = `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`;
      }
      // ============================================

      // Validasi file baru (jika ada upload)
      const fileErrors = [];
      if (req.files?.surat_jalan) {
        const errors = validateFileUpload(req.files.surat_jalan, 'Surat Jalan');
        if (errors) fileErrors.push(...errors);
      }
      if (req.files?.bukti_timbang) {
        const errors = validateFileUpload(req.files.bukti_timbang, 'Bukti Timbang');
        if (errors) fileErrors.push(...errors);
      }
      if (fileErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validasi file gagal",
          errors: fileErrors,
          timestamp: new Date().toISOString()
        });
      }

      // Query UPDATE lengkap
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

      await db.query(query, [
        tanggal_kirim, berat_tbs, surat_jalan, bukti_timbang, status,
        users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik, id
      ]);

      res.json({
        success: true,
        message: 'Distribusi berhasil diupdate',
        data: {
          iddistribusi: parseInt(id),
          updatedFiles: {
            surat_jalan: surat_jalan,
            bukti_timbang: bukti_timbang
          },
          updated_at: new Date().toISOString()
        }
      });

    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal update data distribusi', error: error.message });
    }
  }
);

/**
 * ============================================
 * DELETE DISTRIBUSI (SOFT DELETE)
 * Catatan: File TIDAK dihapus saat soft delete agar data bisa direstore
 * ============================================
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return res.status(400).json({ success: false, message: idError });

    // Soft delete: hanya ubah is_deleted = 1, file TETAP ADA untuk potensi restore
    const [result] = await db.query(
      "UPDATE distribusi SET is_deleted = 1 WHERE iddistribusi = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Data distribusi berhasil diarsipkan (Soft Delete) - File tetap tersimpan',
      data: { iddistribusi: id }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal hapus data', error: error.message });
  }
});

/**
 * ============================================
 * HARD DELETE (PERMANENT) - SPRINT 7
 * Endpoint opsional: Hapus data permanen + file fisik
 * Gunakan dengan hati-hati!
 * ============================================
 */
router.delete('/:id/permanent', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return res.status(400).json({ success: false, message: idError });

    // 1. Ambil data untuk dapat path file
    const checkQuery = 'SELECT surat_jalan, bukti_timbang FROM distribusi WHERE iddistribusi = ?';
    const [existing] = await db.query(checkQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    const oldData = existing[0];

    // 2. Hapus file fisik surat_jalan jika ada
    if (oldData.surat_jalan) {
      const suratJalanPath = path.join(__dirname, '..', oldData.surat_jalan);
      if (fs.existsSync(suratJalanPath)) {
        fs.unlinkSync(suratJalanPath);
        console.log(`✅ File permanently deleted: ${suratJalanPath}`);
      }
    }

    // 3. Hapus file fisik bukti_timbang jika ada
    if (oldData.bukti_timbang) {
      const buktiTimbangPath = path.join(__dirname, '..', oldData.bukti_timbang);
      if (fs.existsSync(buktiTimbangPath)) {
        fs.unlinkSync(buktiTimbangPath);
        console.log(`✅ File permanently deleted: ${buktiTimbangPath}`);
      }
    }

    // 4. Hapus data permanen dari database
    const [result] = await db.query(
      "DELETE FROM distribusi WHERE iddistribusi = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Data distribusi dan file terkait berhasil dihapus permanen',
      data: {
        iddistribusi: id,
        deletedFiles: {
          surat_jalan: oldData.surat_jalan || 'No file',
          bukti_timbang: oldData.bukti_timbang || 'No file'
        }
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal hapus permanen', error: error.message });
  }
});

module.exports = router;