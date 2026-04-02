const distribusiModel = require("../models/distribusiModel");

// GET
exports.getDistribusi = (req, res) => {
  distribusiModel.getDistribusi((err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(result);
    }
  });
};

// POST
exports.createDistribusi = (req, res) => {
  const data = req.body;

  // validasi sederhana
  if (!data.tanggal_kirim || !data.berat_tbs) {
    return res.status(400).json({
      message: "Data tidak lengkap"
    });
  }

  distribusiModel.createDistribusi(data, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({
        message: "Distribusi berhasil ditambah"
      });
    }
  });
};