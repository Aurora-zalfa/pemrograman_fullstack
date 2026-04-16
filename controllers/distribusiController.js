const distribusiModel = require("../models/distribusiModel");

// ================= GET =================
exports.getDistribusi = (req, res) => {
  distribusiModel.getDistribusi((err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data distribusi",
        error: err.message
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data distribusi berhasil diambil",
      data: result
    });
  });
};

// ================= POST =================
exports.createDistribusi = (req, res) => {
  const { tanggal_kirim, berat_tbs, users_idusers } = req.body;

  // 🔥 HANDLE FILE (AMAN walaupun tidak dikirim)
  const surat_jalan = req.files?.surat_jalan?.[0]?.filename || null;
  const bukti_timbang = req.files?.bukti_timbang?.[0]?.filename || null;

  // ✅ VALIDASI WAJIB
  if (!tanggal_kirim || !berat_tbs || !users_idusers) {
    return res.status(400).json({
      status: "error",
      message: "Semua field wajib diisi (tanggal_kirim, berat_tbs, users_idusers)"
    });
  }

  // ✅ VALIDASI ANGKA
  if (isNaN(berat_tbs)) {
    return res.status(400).json({
      status: "error",
      message: "Berat TBS harus berupa angka"
    });
  }

  if (Number(berat_tbs) <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Berat TBS harus lebih dari 0"
    });
  }

  // ✅ VALIDASI USER ID
  if (isNaN(users_idusers)) {
    return res.status(400).json({
      status: "error",
      message: "User ID harus berupa angka"
    });
  }

  // 🔥 DATA FINAL
  const data = {
    tanggal_kirim,
    berat_tbs,
    users_idusers,
    surat_jalan,
    bukti_timbang
  };

  distribusiModel.createDistribusi(data, (err, result) => {
    if (err) {
      console.error("ERROR:", err.message);

      return res.status(500).json({
        status: "error",
        message: "Gagal menambahkan distribusi",
        error: err.message
      });
    }

    res.status(201).json({
      status: "success",
      message: "Distribusi berhasil ditambahkan",
      data: result
    });
  });
};

// ================= UPDATE STATUS =================
exports.updateStatus = (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "ID wajib ada"
    });
  }

  if (!status) {
    return res.status(400).json({
      status: "error",
      message: "Status wajib diisi"
    });
  }

  const allowedStatus = ["pending", "proses", "selesai"];

  if (!allowedStatus.includes(status.toLowerCase())) {
    return res.status(400).json({
      status: "error",
      message: "Status tidak valid (pending, proses, selesai)"
    });
  }

  distribusiModel.updateStatus(id, status, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal update status",
        error: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Status berhasil diupdate"
    });
  });
};