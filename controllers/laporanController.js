const db = require('../config/database');

// =========================
// DETAIL LAPORAN HARIAN
// =========================
exports.getLaporanHarian = async (req, res) => {
  try {
    const { tanggal, kebun_id, pabrik_id } = req.query;

    // VALIDASI TANGGAL WAJIB
    if (!tanggal) {
      return res.status(400).json({
        status: "error",
        message: "Tanggal laporan wajib diisi"
      });
    }

    // VALIDASI FORMAT TANGGAL
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(tanggal)) {
      return res.status(400).json({
        status: "error",
        message: "Format tanggal harus YYYY-MM-DD"
      });
    }

    // VALIDASI TIPE DATA
    if (kebun_id && isNaN(kebun_id)) {
      return res.status(400).json({
        status: "error",
        message: "kebun_id harus berupa angka"
      });
    }

    if (pabrik_id && isNaN(pabrik_id)) {
      return res.status(400).json({
        status: "error",
        message: "pabrik_id harus berupa angka"
      });
    }

    // QUERY SEDERHANA (AMAN TANPA JOIN)
    let query = `
      SELECT *
      FROM distribusi
      WHERE DATE(tanggal_kirim) = ?
    `;

    let params = [tanggal];

    if (kebun_id) {
      query += ` AND kebun_id = ?`;
      params.push(kebun_id);
    }

    if (pabrik_id) {
      query += ` AND pabrik_id = ?`;
      params.push(pabrik_id);
    }

    query += ` ORDER BY tanggal_kirim DESC`;

    const [rows] = await db.query(query, params);

    // JIKA DATA KOSONG
   if (rows.length === 0) {
    return res.status(404).json({
        status: "error",
        message: "Tidak ada data laporan pada tanggal tersebut",
        data: []
    });
    }

    // RESPONSE SUCCESS
    return res.status(200).json({
      status: "success",
      message: "Laporan harian berhasil diambil",
      total_data: rows.length,
      data: rows
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server",
      error: error.message
    });
  }
};