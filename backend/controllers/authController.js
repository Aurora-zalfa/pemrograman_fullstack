// controllers/authController.js
const authModel = require("../models/authModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * ============================================
 * REGISTER
 * ============================================
 */
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Validasi
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username dan password wajib diisi" 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Simpan ke database
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
 * ============================================
 * LOGIN
 * ============================================
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validasi
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username dan password wajib diisi" 
            });
        }
        
        // Cari user di database
        const users = await authModel.login(username);

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: "User tidak ditemukan" 
            });
        }
        
        const user = users[0];
        
        // Cek password (bcrypt compare)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Password salah" 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.idusers, 
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