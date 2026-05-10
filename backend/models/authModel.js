// models/authModel.js
const db = require("../config/database");

/**
 * ============================================
 * REGISTER
 * ============================================
 */
exports.register = async (data) => {
    const query = `
        INSERT INTO users (username, password, role, is_deleted, created_at)
        VALUES (?, ?, ?, 0, NOW())
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
 * LOGIN
 * ============================================
 */
exports.login = async (username) => {
    const query = `
        SELECT idusers, username, password, role, is_deleted 
        FROM users 
        WHERE username = ?
    `;
    
    const [rows] = await db.query(query, [username]);
    return rows;
};