const authModel = require("../models/authModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
        }

        // --- BAGIAN YANG DIUBAH: Hashing Password ---
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Kirim data yang sudah di-hash ke model
        const result = await authModel.register({ 
            username, 
            password: hashedPassword, 
            role: role || 'petugas' // Default role jika tidak diisi
        });
        
        res.json({ success: true, message: "User berhasil register" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Register gagal", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await authModel.login({ username });

        if (result.length > 0) {
            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = jwt.sign(
                    { id: user.idusers, role: user.role },
                    process.env.JWT_SECRET || 'secret_fallback', // Pastikan ada fallback jika .env gagal
                    { expiresIn: '24h' }
                );
                // Tambahkan return agar fungsi berhenti
                return res.json({ success: true, token, user }); 
            } else {
                // WAJIB ADA: Jika password salah
                return res.status(401).json({ success: false, message: "Password salah" });
            }
        } else {
            // WAJIB ADA: Jika user tidak ditemukan
            return res.status(401).json({ success: false, message: "User tidak ditemukan" });
        }
    } catch (err) {
        // WAJIB ADA: Jika terjadi error database/code
        return res.status(500).json({ success: false, error: err.message });
    }
};