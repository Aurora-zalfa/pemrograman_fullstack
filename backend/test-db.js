const db = require("./config/database");

async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("✅ Database connected! Result:", rows[0].result);
    
    // Cek tabel distribusi
    const [tables] = await db.query("SHOW TABLES LIKE 'distribusi'");
    console.log("📊 Tabel distribusi:", tables.length > 0 ? "ADA ✅" : "TIDAK ADA ❌");
    
    // Cek struktur tabel distribusi
    const [columns] = await db.query("DESCRIBE distribusi");
    console.log("📋 Kolom di tabel distribusi:");
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  }
}

testConnection();