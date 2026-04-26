const express = require("express");
const router = express.Router();
const distribusiController = require("../controllers/distribusiController");
const { verifyToken } = require("../middleware/auth");

/**
 * ROUTES: DISTRIBUSI (TRANSAKSI)
 * Menggunakan verifyToken pada operasi penulisan (POST/PUT/DELETE)
 * untuk memastikan akuntabilitas histori transaksi.
 */

// Menampilkan semua data distribusi yang aktif (is_deleted = 0)
router.get("/", distribusiController.getDistribusi);

// Membuat transaksi distribusi baru (Validasi master data aktif dilakukan di controller)
router.post("/", verifyToken, distribusiController.createDistribusi);

// Update status alur pengiriman (menunggu -> perjalanan -> tiba -> selesai)
router.put("/:id/status", verifyToken, distribusiController.updateStatus);

// Soft Delete: Mengarsipkan data distribusi agar tidak merusak histori laporan
router.delete("/:id", verifyToken, distribusiController.deleteDistribusi);

/**
 * Catatan: Pastikan di distribusiController.js sudah terdapat fungsi deleteDistribusi
 * yang melakukan query: UPDATE distribusi SET is_deleted = 1 WHERE iddistribusi = ?
 */

module.exports = router;