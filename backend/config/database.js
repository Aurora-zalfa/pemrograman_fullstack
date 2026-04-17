// config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydb', // Sesuaikan dengan nama DB kamu
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Tambahan agar error saat idle tidak mematikan aplikasi secara mendadak
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * BAGIAN TUGAS: Error handling pada level koneksi
 */
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection failed!');
    console.error('Pesan Error:', error.message);
    
    // Memberikan petunjuk spesifik berdasarkan kode error
    if (error.code === 'ECONNREFUSED') {
      console.error('Tips: Pastikan XAMPP/MySQL Service sudah dinyalakan.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Tips: Cek kembali username dan password database di file .env.');
    }

    // Berguna agar proses tidak menggantung jika DB wajib ada
    // process.exit(1); 
  });

// Menangani error tak terduga pada pool saat aplikasi sedang berjalan
pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle database connection', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Koneksi database terputus. Pool akan mencoba menyambung kembali.');
  }
});

module.exports = pool;