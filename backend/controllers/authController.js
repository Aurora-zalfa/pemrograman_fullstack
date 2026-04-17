const authModel = require("../models/authModel");

exports.register = async (req, res) => {
    try {
        const data = req.body;
        if (!data.username || !data.password) {
            return res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
        }

        // Gunakan await
        const result = await authModel.register(data);
        res.json({ success: true, message: "User berhasil register", result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Register gagal", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username dan password wajib diisi" });
        }

        const result = await authModel.login({ username, password });

        if (result.length > 0) {
            const user = result[0];
            delete user.password;
            res.json({ success: true, message: "Login berhasil", user });
        } else {
            res.status(401).json({ success: false, message: "Username atau password salah" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};