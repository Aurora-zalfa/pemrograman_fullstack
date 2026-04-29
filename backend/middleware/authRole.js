/**
 * MIDDLEWARE: Authorize Roles (RBAC)
 * Digunakan untuk membatasi akses berdasarkan role user.
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Cek apakah data user ada (setelah melewati verifyToken)
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Autentikasi diperlukan" 
            });
        }

        // Cek apakah role user termasuk dalam daftar yang diizinkan
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Akses ditolak: Anda login sebagai ${req.user.role}, role ini tidak memiliki izin.` 
            });
        }

        next();
    };
};

module.exports = authorizeRoles;