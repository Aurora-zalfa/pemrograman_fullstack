const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: "Akses ditolak, skema autentikasi tidak valid atau token tidak ada" 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback');
        req.user = decoded; 
        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' 
            ? "Sesi Anda telah berakhir, silakan login kembali" 
            : "Token tidak valid";

        res.status(403).json({ 
            success: false,
            message: message 
        });
    }
};

// Fungsi bawaan untuk Manajer (Biarkan saja, jangan dihapus)
const isManager = (req, res, next) => {
    // Pakai .toLowerCase() agar aman jika ketikan di database huruf kecil/besar (manajer / Manajer)
    if (req.user && req.user.role.toLowerCase() === 'manajer') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Akses ditolak! Fitur ini hanya untuk role Manajer."
        });
    }
};

/**
 * TAMBAHKAN INI UNTUK SPRINT REVISI DATA MASTER ANDA (HAK AKSES PETUGAS)
 */
const isPetugas = (req, res, next) => {
    if (req.user && req.user.role.toLowerCase() === 'petugas') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Gagal: Akses ditolak! Fitur ini hanya untuk role Petugas."
        });
    }
};

// Pastikan SEKARANG KETIGANYA diekspor (Tambahkan isPetugas di sini)
module.exports = { verifyToken, isManager, isPetugas };