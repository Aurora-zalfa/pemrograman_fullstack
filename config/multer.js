// config/multer.js
const multer = require('multer');
const path = require('path');

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tentukan folder berdasarkan jenis file
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'surat_jalan') {
      uploadPath = 'uploads/surat_jalan/';
    } else if (file.fieldname === 'bukti_timbang') {
      uploadPath = 'uploads/bukti_timbang/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Buat nama file unik: timestamp + nama asli
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter untuk hanya terima gambar & PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, png) dan PDF yang diperbolehkan'));
  }
};

// Export konfigurasi
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: fileFilter
});

module.exports = upload;