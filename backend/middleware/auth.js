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

/**
 * Tambahkan ini untuk tugas Zainab (Soft Delete)
 */
const isManager = (req, res, next) => {
    if (req.user && req.user.role === 'manajer') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Akses ditolak! Fitur ini hanya untuk role Manajer."
        });
    }
};

// Pastikan keduannya diekspor
module.exports = { verifyToken, isManager };