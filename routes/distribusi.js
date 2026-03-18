// routes/distribusi.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');

// Endpoint upload (masih template, nanti dikembangkan)
router.post('/upload', upload.fields([
  { name: 'surat_jalan', maxCount: 1 },
  { name: 'bukti_timbang', maxCount: 1 }
]), (req, res) => {
  res.json({
    message: 'Upload berhasil',
    files: req.files
  });
});

module.exports = router;