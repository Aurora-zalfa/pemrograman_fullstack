const jwt = require('jsonwebtoken');

/**
 * MIDDLEWARE: Verify Token
 * Memastikan user memiliki akses valid dan mengekstrak identitas user
 * untuk keperluan audit log (seperti mencatat siapa yang update status distribusi).
 */
const verifyToken = (req, res, next) => {
    // 1. Ambil Header Authorization
    const authHeader = req.headers['authorization'];
    
    // 2. Validasi format Bearer (Bearer <token>)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: "Akses ditolak, skema autentikasi tidak valid atau token tidak ada" 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 3. Verifikasi Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        /**
         * 4. Simpan ke Request
         * Pastikan payload token saat Login (authController) berisi:
         * { idusers, username, role }
         */
        req.user = decoded; 
        
        next();
    } catch (err) {
        // Bedakan pesan error jika token expired atau benar-benar rusak
        const message = err.name === 'TokenExpiredError' 
            ? "Sesi Anda telah berakhir, silakan login kembali" 
            : "Token tidak valid";

        res.status(403).json({ 
            success: false,
            message: message 
        });
    }
};

module.exports = { verifyToken };