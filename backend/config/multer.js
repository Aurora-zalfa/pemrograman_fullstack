// config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada (manajemen folder auto)
const uploadDir = 'uploads';
const suratJalanDir = 'uploads/surat_jalan';
const buktiTimbangDir = 'uploads/bukti_timbang';

// Auto-create folder jika belum ada
[uploadDir, suratJalanDir, buktiTimbangDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Folder created: ${dir}`);
  }
});

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'surat_jalan') {
      cb(null, suratJalanDir);
    } else if (file.fieldname === 'bukti_timbang') {
      cb(null, buktiTimbangDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    // Buat nama file unik: fieldname-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname).toLowerCase());
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
    cb(new Error('Hanya file gambar (jpg, png) dan PDF yang diperbolehkan'), false);
    }
};

// Export konfigurasi
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024  // Max 5MB
  },
  fileFilter: fileFilter
});

module.exports = upload;