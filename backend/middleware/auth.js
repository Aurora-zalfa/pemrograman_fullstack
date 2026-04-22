const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Mengambil token dari format "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Akses ditolak, token tidak ada" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user (id & role) ke request
        next();
    } catch (err) {
        res.status(403).json({ message: "Token tidak valid atau kadaluwarsa" });
    }
};

module.exports = {verifyToken};