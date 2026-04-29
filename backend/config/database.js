const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydb', 
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * HELPER: Cek Relasi Transaksi
 * Fungsi ini mengecek apakah ID master sedang digunakan di tabel lain.
 * Digunakan untuk mencegah kerusakan histori transaksi.
 * * @param {string} table - Nama tabel transaksi (misal: 'pengiriman')
 * @param {string} column - Nama kolom foreign key (misal: 'idsupir')
 * @param {number|string} id - Value ID yang dicek
 */
pool.checkRelation = async (table, column, id) => {
  try {
    const query = `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows[0].count > 0;
  } catch (error) {
    console.error(`Error checking relation on ${table}:`, error.message);
    throw error;
  }
};

/**
 * VALIDASI KONEKSI
 */
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed!');
    if (error.code === 'ECONNREFUSED') {
      console.error('Tips: Nyalakan MySQL di XAMPP terlebih dahulu.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Tips: Database '${process.env.DB_NAME}' tidak ditemukan.`);
    }
  });

pool.on('error', (err) => {
  console.error('⚠️ Database Pool Error:', err.message);
});

module.exports = pool;

