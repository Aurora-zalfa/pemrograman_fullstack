const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  // PASTIKAN: Nama database di .env sudah sesuai dengan skema 'no_hp' & 'lokasi'
  database: process.env.DB_NAME || 'db_sawit', 
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * VALIDASI KONEKSI: Memastikan database siap sebelum CRUD Master dijalankan
 */
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed!');
    console.error('Detail:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Tips: Nyalakan MySQL di XAMPP terlebih dahulu.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Tips: Database '${process.env.DB_NAME}' tidak ditemukan. Buat dulu di PHPMyAdmin.`);
    }
  });

// Error handling otomatis jika koneksi terputus tiba-tiba
pool.on('error', (err) => {
  console.error('⚠️ Database Pool Error:', err.message);
});

module.exports = pool;