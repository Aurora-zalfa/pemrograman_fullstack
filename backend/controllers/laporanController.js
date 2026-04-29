const db = require('../config/database');


// DETAIL LAPORAN HARIAN (JOIN + DATE RANGE + SORT)
exports.getLaporanHarian = async (req, res) => {
  try {
    const { tanggal_mulai, tanggal_selesai, kebun_id, pabrik_id, sort } = req.query;

  
    // VALIDASI INPUT
  
    if (!tanggal_mulai || !tanggal_selesai) {
      return res.status(400).json({
        status: "error",
        message: "tanggal_mulai dan tanggal_selesai wajib diisi"
      });
    }

    // format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(tanggal_mulai) || !dateRegex.test(tanggal_selesai)) {
      return res.status(400).json({
        status: "error",
        message: "Format tanggal harus YYYY-MM-DD"
      });
    }

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

  
    // SORTING
    let order = "DESC"; // default

    if (sort) {
      if (sort.toLowerCase() === "asc") order = "ASC";
      else if (sort.toLowerCase() === "desc") order = "DESC";
      else {
        return res.status(400).json({
          status: "error",
          message: "sort hanya boleh asc atau desc"
        });
      }
    }

    // QUERY JOIN (FINAL)
    let query = `
      SELECT 
        d.iddistribusi AS id,
        DATE(d.tanggal_kirim) AS tanggal,
        d.berat_tbs,
        COALESCE(NULLIF(d.status, ''), 'pending') AS status,

        u.username AS user,
        s.nama_supir AS supir,
        t.no_polisi AS truk,
        k.nama_kebun AS kebun,
        p.nama_pabrik AS pabrik

      FROM distribusi d

      JOIN users u ON d.users_idusers = u.idusers
      JOIN supir s ON d.supir_idsupir = s.idsupir
      JOIN truk t ON d.truk_idtruk = t.idtruk
      JOIN kebun k ON d.kebun_idkebun = k.idkebun
      JOIN pabrik p ON d.pabrik_idpabrik = p.idpabrik

      WHERE DATE(d.tanggal_kirim) BETWEEN ? AND ?
    `;

    let params = [tanggal_mulai, tanggal_selesai];

    // FILTER TAMBAHAN
    if (kebun_id) {
      query += ` AND d.kebun_idkebun = ?`;
      params.push(kebun_id);
    }

    if (pabrik_id) {
      query += ` AND d.pabrik_idpabrik = ?`;
      params.push(pabrik_id);
    }

    query += ` ORDER BY d.tanggal_kirim ${order}`;

    // EKSEKUSI QUERY
  
    const [rows] = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada data laporan pada rentang tanggal tersebut",
        data: []
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Laporan berhasil diambil",
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