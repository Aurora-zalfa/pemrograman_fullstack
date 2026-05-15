const authModel = require("../models/authModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * REGISTER
 */
exports.register = async (req, res) => {
    try {
        // Cek apakah req.body ada
        if (!req.body) {
            return res.status(400).json({ success: false, message: "Body tidak boleh kosong" });
        }

        const { username, password, role } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username dan password wajib diisi" 
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const result = await authModel.register({ 
            username, 
            password: hashedPassword, 
            role: role || 'petugas'
        });
        
        res.status(201).json({ 
            success: true, 
            message: "User berhasil register",
            data: { idusers: result.insertId }
        });
        
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Register gagal", 
            error: err.message 
        });
    }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
    try {
        // PERBAIKAN: Cek apakah req.body terdefinisi sebelum destructuring
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Data login tidak ditemukan di body request. Pastikan format JSON benar." 
            });
        }

        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username dan password wajib diisi" 
            });
        }
        
        const users = await authModel.login(username);

        if (!users || users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: "User tidak ditemukan" 
            });
        }
        
        const user = users[0];
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Password salah" 
            });
        }

        const token = jwt.sign(
            { 
                idusers: user.idusers, 
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET || 'secret_fallback',
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            message: "Login berhasil",
            data: {
                token,
                user: {
                    idusers: user.idusers,
                    username: user.username,
                    role: user.role
                }
            }
        });
        
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Login gagal",
            error: err.message 
        });
    }
};