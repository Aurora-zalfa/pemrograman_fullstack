const express = require('express');
const router = express.Router();

// PASTIKAN NAMA INI BENAR PERSIS
const laporanController = require('../controllers/laporanController');

// CEK FUNCTION HARUS ADA
router.get('/', laporanController.getLaporanHarian);

module.exports = router;