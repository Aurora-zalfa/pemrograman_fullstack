// models/authModel.js
const db = require("../config/database");

/**
 * ============================================
 * REGISTER (Sudah Disinkronkan dengan Kolom DB)
 * ============================================
 * Kolom tabel: idusers (AI), username, password, role, created_at
 */
exports.register = async (data) => {
    // Menghapus 'is_deleted' karena tidak ada di kolom database phpMyAdmin kamu
    const query = `
        INSERT INTO users (username, password, role, created_at)
        VALUES (?, ?, ?, NOW())
    `;
    
    const [result] = await db.query(query, [
        data.username,
        data.password,
        data.role
    ]);
    
    return result;
};

/**
 * ============================================
 * LOGIN (Sudah Disinkronkan dengan Kolom DB)
 * ============================================
 */
exports.login = async (username) => {
    // Menghapus 'is_deleted' dari SELECT agar tidak memicu error SQL 'Unknown Column'
    const query = `
        SELECT idusers, username, password, role, created_at 
        FROM users 
        WHERE username = ?
    `;
    
    const [rows] = await db.query(query, [username]);
    return rows;
};