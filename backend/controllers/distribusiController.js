// controllers/distribusiController.js
const db = require("../config/database");
const fs = require('fs');
const path = require('path');

// ============================================
// GET ALL
// ============================================
exports.getDistribusi = async (req, res) => {
  try {
    let filterCondition = "";
    
    const userRole = req.user && req.user.role ? req.user.role.toLowerCase() : "";

    if (userRole === "manajer" || userRole === "manager") {
      filterCondition = "WHERE d.is_deleted = 0";
      console.log("👔 Manajer: Menampilkan data aktif saja");
    } else {
      filterCondition = "";
      console.log("👷 Petugas: Menampilkan semua data");
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
    console.log(`📊 Data ditemukan: ${rows.length} row(s)`);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ Error getDistribusi:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// GET BY ID
// ============================================
exports.getDistribusiById = async (req, res) => {
  try {
    const id = req.params.id;
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
      WHERE d.iddistribusi = ? AND d.is_deleted = 0
    `;
    const [rows] = await db.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("❌ Error getDistribusiById:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ============================================
// CREATE (TAMBAH DATA) - FIXED LENGKAP
// ============================================
exports.createDistribusi = async (req, res) => {
  try {
    const data = req.body;
    
    console.log("📝 [CREATE] Data:", data);
    console.log("📁 [CREATE] Files:", req.files ? 'ADA' : 'TIDAK ADA');

    // Validasi field wajib
    if (!data.tanggal_kirim || !data.berat_tbs) {
      return res.status(400).json({ 
        success: false, 
        message: "Tanggal kirim dan berat TBS wajib diisi" 
      });
    }

    // Validasi file upload
    if (!req.files || !req.files.surat_jalan || !req.files.bukti_timbang) {
      return res.status(400).json({ 
        success: false, 
        message: "Surat Jalan dan Bukti Timbang wajib diupload" 
      });
    }

    const suratJalanPath = req.files.surat_jalan[0].path.replace(/\\/g, '/');
    const buktiTimbangPath = req.files.bukti_timbang[0].path.replace(/\\/g, '/');

    // 🔧 AMBIL users_idusers
    let userId = data.users_idusers || req.user?.idusers;
    if (!userId) {
      const [users] = await db.query("SELECT idusers FROM users LIMIT 1");
      if (users.length > 0) {
        userId = users[0].idusers;
        console.log("🤖 Auto menggunakan user ID:", userId);
      } else {
        return res.status(400).json({
          success: false,
          message: "Tidak ada user yang tersedia."
        });
      }
    }

    // 🔧 KONVERSI ID ke integer
    const supirId = data.supir_idsupir ? parseInt(data.supir_idsupir) : null;
    const trukId = data.truk_idtruk ? parseInt(data.truk_idtruk) : null;
    const kebunId = data.kebun_idkebun ? parseInt(data.kebun_idkebun) : null;
    const pabrikId = data.pabrik_idpabrik ? parseInt(data.pabrik_idpabrik) : null;

    console.log("🔢 IDs setelah konversi:", { supirId, trukId, kebunId, pabrikId });

    // ✅ QUERY INSERT LENGKAP
    const query = `
      INSERT INTO distribusi 
      (tanggal_kirim, nama_supir, no_polisi, berat_tbs, status, surat_jalan, bukti_timbang, 
       users_idusers, supir_idsupir, truk_idtruk, kebun_idkebun, pabrik_idpabrik, 
       is_deleted, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
    `;

    const values = [
      data.tanggal_kirim,
      data.nama_supir || null,
      data.no_polisi || null,
      parseFloat(data.berat_tbs),
      data.status || 'menunggu_memuat',
      suratJalanPath,
      buktiTimbangPath,
      userId,
      supirId,
      trukId,
      kebunId,
      pabrikId
    ];

    console.log("🔍 Query:", query);
    console.log("🔍 Values:", values);

    const [result] = await db.query(query, values);

    res.status(201).json({
      success: true,
      message: "Data distribusi berhasil ditambahkan",
      data: { iddistribusi: result.insertId }
    });

  } catch (error) {
    console.error("❌ [CREATE] Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// UPDATE (EDIT DATA)
// ============================================
exports.updateDistribusi = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    console.log("📝 [UPDATE] ID:", id);
    console.log("📦 [UPDATE] Data:", data);

    if (!data.nama_supir || !data.no_polisi || !data.berat_tbs || !data.status) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi: nama_supir, no_polisi, berat_tbs, status"
      });
    }

    const checkQuery = "SELECT * FROM distribusi WHERE iddistribusi = ?";
    const [rows] = await db.query(checkQuery, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan"
      });
    }

    const updateQuery = `
      UPDATE distribusi 
      SET 
        nama_supir = ?,
        no_polisi = ?,
        berat_tbs = ?,
        status = ?,
        updated_at = NOW()
      WHERE iddistribusi = ?
    `;

    const values = [
      data.nama_supir,
      data.no_polisi,
      parseFloat(data.berat_tbs),
      data.status,
      id
    ];

    const [result] = await db.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Gagal update, tidak ada perubahan"
      });
    }

    res.json({
      success: true,
      message: "Data distribusi berhasil diupdate"
    });

  } catch (error) {
    console.error("❌ [UPDATE] Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// DELETE (SOFT DELETE)
// ============================================
exports.deleteDistribusi = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("📝 [DELETE] ID:", id);

    const checkQuery = "SELECT * FROM distribusi WHERE iddistribusi = ?";
    const [rows] = await db.query(checkQuery, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan"
      });
    }

    const deleteQuery = "UPDATE distribusi SET is_deleted = 1, updated_at = NOW() WHERE iddistribusi = ?";
    const [result] = await db.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Gagal menghapus data"
      });
    }

    res.json({
      success: true,
      message: "Data distribusi berhasil dihapus"
    });

  } catch (error) {
    console.error("❌ [DELETE] Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// UPDATE STATUS
// ============================================
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const validStatus = ['menunggu_memuat', 'dalam_perjalanan', 'tiba_di_pabrik', 'selesai', 'ditolak'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status tidak valid. Pilih: ${validStatus.join(', ')}`
      });
    }

    const query = "UPDATE distribusi SET status = ?, updated_at = NOW() WHERE iddistribusi = ?";
    const [result] = await db.query(query, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan"
      });
    }

    res.json({
      success: true,
      message: "Status berhasil diupdate"
    });

  } catch (error) {
    console.error("❌ [updateStatus] Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// HARD DELETE (Permanent)
// ============================================
exports.deleteDistribusiPermanent = async (req, res) => {
  try {
    const id = req.params.id;

    const checkQuery = "SELECT * FROM distribusi WHERE iddistribusi = ?";
    const [rows] = await db.query(checkQuery, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Data tidak ditemukan" 
      });
    }

    const data = rows[0];

    if (data.surat_jalan && fs.existsSync(data.surat_jalan)) {
      fs.unlinkSync(data.surat_jalan);
      console.log('✅ File deleted:', data.surat_jalan);
    }
    
    if (data.bukti_timbang && fs.existsSync(data.bukti_timbang)) {
      fs.unlinkSync(data.bukti_timbang);
      console.log('✅ File deleted:', data.bukti_timbang);
    }

    const deleteQuery = "DELETE FROM distribusi WHERE iddistribusi = ?";
    const [result] = await db.query(deleteQuery, [id]);

    res.json({
      success: true,
      message: "Data berhasil dihapus permanen"
    });

  } catch (error) {
    console.error("❌ [deletePermanent] Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};