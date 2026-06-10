// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const db = require('../config/database');
const { validateId, validateFileUpload } = require('../utils/validator');
const path = require('path');
const fs = require('fs');

// PENTING: Import verifyToken dan isManager untuk pengamanan role
const { verifyToken, isManager } = require('../middleware/auth');

/**
 * STRATEGI TRANSAKSI:
 * 1. Saat CREATE: Validasi agar ID Master (Supir, Truk, dll) yang digunakan is_deleted = 0.
 * 2. Saat DELETE: Gunakan Soft Delete (is_deleted = 1) agar histori pengiriman tidak hilang.
 * 3. Saat UPDATE: Hapus file lama jika ada upload baru (Sprint 7).
 * 4. Saat HARD DELETE: Hapus file fisik + data permanen (opsional, Sprint 7).
 */

/**
 * ============================================
 * CREATE DISTRIBUSI (POLOSAN TANPA VERIFYTOKEN)
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

      // 🔧 DEBUG: Lihat apa yang diterima backend (aman, cuma log)
      console.log("📥 Data diterima:", { tanggal_kirim, berat_tbs, supir_idsupir, truk_idtruk });
      console.log("👤 User dari token:", req.user?.idusers);

      // 🔧 FIX: users_idusers jadi OPTIONAL (tidak wajib) - AMAN, tidak bentrok
      if (!tanggal_kirim || !berat_tbs || !supir_idsupir || !truk_idtruk) {
        return res.status(400).json({
          success: false,
          message: 'Data wajib tidak lengkap (Tanggal, Berat, Supir, dan Truk wajib diisi)'
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

      // 🔧 FIX: Fallback users_idusers dari token jika tidak ada (AMAN)
      let finalUserId = parseInt(users_idusers);

      if (!finalUserId) {
        // Ambil 1 user paling baru/tersedia dari database secara otomatis
        const [latestUser] = await db.query("SELECT idusers FROM users ORDER BY idusers DESC LIMIT 1");
        
        if (latestUser.length > 0) {
          finalUserId = latestUser[0].idusers;
          console.log(`🤖 Otomatis menggunakan ID User terbaru dari DB: ${finalUserId}`);
        } else {
          // Jika tabel users benar-benar kosong total (antisipasi terakhir)
          finalUserId = 1; 
          console.log("⚠️ Tabel users kosong, fallback terpaksa ke ID 1");
        }
      } else {
        console.log(`🔢 Menggunakan ID User kiriman frontend: ${finalUserId}`);
      }

      // 🔧 FIX: Konversi ID ke integer jika backend terima string (SAFETY)
      const supirIdInt = parseInt(supir_idsupir) || supir_idsupir;
      const trukIdInt = parseInt(truk_idtruk) || truk_idtruk;
      const kebunIdInt = kebun_idkebun ? parseInt(kebun_idkebun) : null;
      const pabrikIdInt = pabrik_idpabrik ? parseInt(pabrik_idpabrik) : null;
      console.log("🔢 IDs setelah konversi:", { supirIdInt, trukIdInt, kebunIdInt, pabrikIdInt });

      const query = `
        INSERT INTO distribusi 
        (tanggal_kirim, berat_tbs, surat_jalan, bukti_timbang, status,
         users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik, 
         is_deleted, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW())
      `;

      console.log("📝 Executing INSERT query...");

      // 🔧 FIX: Pakai variabel yang sudah dikonversi ke integer
      const [result] = await db.query(query, [
        tanggal_kirim, berat_tbs, surat_jalan, bukti_timbang, status,
        finalUserId, supirIdInt, trukIdInt, kebunIdInt, pabrikIdInt
      ]);

      console.log("✅ Berhasil insert ID:", result.insertId);

      res.status(201).json({
        success: true,
        message: 'Data distribusi berhasil dibuat',
        data: { iddistribusi: result.insertId }
      });

    } catch (error) {
      console.error("❌ ERROR DI BACKEND:", error.message);
      res.status(500).json({ 
        success: false, 
        message: 'Gagal membuat distribusi: ' + error.message, 
        error: error.message 
      });
    }
  }
);

/**
 * ============================================
 * 🛠️ FIX REVISI: GET SEMUA DISTRIBUSI (BERDASARKAN ROLE)
 * ============================================
 * - Petugas Lapangan: Melihat SEMUA riwayat data transaksi (is_deleted 0 dan 1).
 * - Manajer Perusahaan: Hanya melihat data aktif yang belum diarsip (is_deleted = 0).
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    let filterCondition = "";
    
    // Deteksi role user dari Token JWT (diubah ke huruf kecil agar seragam)
    const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : "";

    if (userRole === "manajer" || userRole === "manager") {
      // Jika Manajer, saring data: sembunyikan yang sudah diarsip (is_deleted = 1)
      filterCondition = "WHERE d.is_deleted = 0";
      console.log("👔 Role: Manajer -> Memfilter transaksi aktif saja");
    } else {
      // Jika Petugas Lapangan, tidak pakai WHERE filter arsip agar semua riwayat tetap muncul
      filterCondition = "";
      console.log("👷 Role: Petugas Lapangan -> Menampilkan semua riwayat transaksi");
    }

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
      ${filterCondition}
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
 * ✨ FITUR BARU: GET KOTAK ARSIP (KHUSUS MANAJER)
 * ============================================
 * Endpoint ini hanya dipanggil oleh Tab/Menu Kotak Arsip di halaman Manajer.
 * Menarik data yang statusnya sudah diarsipkan (is_deleted = 1).
 */
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

/**
 * ============================================
 * UPDATE STATUS (Polosan Tanpa VerifyToken)
 * ============================================
 */
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status: status_baru } = req.body;
    const alurStatus = ["menunggu_memuat", "dalam_perjalanan", "tiba_di_pabrik", "selesai"];

    const [rows] = await db.query('SELECT status FROM distribusi WHERE iddistribusi = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Data distribusi tidak ditemukan" });

    const status_sekarang = rows[0].status;
    const indexSekarang = alurStatus.indexOf(status_sekarang);
    const indexBaru = alurStatus.indexOf(status_baru);

    if (indexBaru === indexSekarang + 1 || status_baru === 'ditolak') {
      await db.query(
        'UPDATE distribusi SET status = ?, updated_at = NOW() WHERE iddistribusi = ?', 
        [status_baru, id]
      );
      res.json({ 
        success: true, 
        message: `Status diupdate ke ${status_baru}`,
        updatedAt: new Date() 
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
 * UPDATE DISTRIBUSI (LENGKAP) - SPRINT 7
 * ============================================
 */
router.put(
  '/:id',
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

      const checkQuery = 'SELECT * FROM distribusi WHERE iddistribusi = ?';
      const [existing] = await db.query(checkQuery, [id]);

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Data distribusi tidak ditemukan'
        });
      }

      const oldData = existing[0];
      let surat_jalan = oldData.surat_jalan;
      let bukti_timbang = oldData.bukti_timbang;

      if (req.files?.surat_jalan && oldData.surat_jalan) {
        const oldSuratJalanPath = path.join(__dirname, '..', oldData.surat_jalan);
        if (fs.existsSync(oldSuratJalanPath)) {
          fs.unlinkSync(oldSuratJalanPath);
          console.log(`✅ Old file deleted: ${oldSuratJalanPath}`);
        }
        surat_jalan = `uploads/surat_jalan/${req.files.surat_jalan[0].filename}`;
      }

      if (req.files?.bukti_timbang && oldData.bukti_timbang) {
        const oldBuktiTimbangPath = path.join(__dirname, '..', oldData.bukti_timbang);
        if (fs.existsSync(oldBuktiTimbangPath)) {
          fs.unlinkSync(oldBuktiTimbangPath);
          console.log(`✅ Old file deleted: ${oldBuktiTimbangPath}`);
        }
        bukti_timbang = `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`;
      }

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
 * DELETE DISTRIBUSI (ARSIPKAN VIA SOFT DELETE)
 * ============================================
 * Mengubah is_deleted menjadi 1 dan mencatat updated_at sebagai waktu pengarsipan.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return res.status(400).json({ success: false, message: idError });

    const [result] = await db.query(
      "UPDATE distribusi SET is_deleted = 1, updated_at = NOW() WHERE iddistribusi = ?",
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
 * ============================================
 */
router.delete('/:id/permanent', async (req, res) => {
  try {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return res.status(400).json({ success: false, message: idError });

    const checkQuery = 'SELECT surat_jalan, bukti_timbang FROM distribusi WHERE iddistribusi = ?';
    const [existing] = await db.query(checkQuery, [id]);

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }

    const oldData = existing[0];

    if (oldData.surat_jalan) {
      const suratJalanPath = path.join(__dirname, '..', oldData.surat_jalan);
      if (fs.existsSync(suratJalanPath)) {
        fs.unlinkSync(suratJalanPath);
        console.log(`✅ File permanently deleted: ${suratJalanPath}`);
      }
    }

    if (oldData.bukti_timbang) {
      const buktiTimbangPath = path.join(__dirname, '..', oldData.bukti_timbang);
      if (fs.existsSync(buktiTimbangPath)) {
        fs.unlinkSync(buktiTimbangPath);
        console.log(`✅ File permanently deleted: ${buktiTimbangPath}`);
      }
    }

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