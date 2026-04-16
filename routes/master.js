const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Helper Error Handler
const handleError = (res, err) => {
    console.error(err);
    return res.status(500).json({ status: "Error", message: err.message });
};

/////////////////////////
// SUPIR (Contoh CRUD Async)
/////////////////////////

router.get("/supir", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM supir");
        res.json({ status: "Success", data: rows });
    } catch (err) { handleError(res, err); }
});

router.post("/supir", async (req, res) => {
    try {
        const { nama_supir, no_telp } = req.body;
        if (!nama_supir) return res.status(400).json({ message: "Nama supir wajib diisi" });
        
        await db.query("INSERT INTO supir (nama_supir, no_telp) VALUES (?, ?)", [nama_supir, no_telp]);
        res.status(201).json({ message: "Supir berhasil ditambahkan" });
    } catch (err) { handleError(res, err); }
});

router.put("/supir/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("UPDATE supir SET ? WHERE idsupir = ?", [req.body, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Supir tidak ditemukan" });
        res.json({ message: "Supir berhasil diupdate" });
    } catch (err) { handleError(res, err); }
});

router.delete("/supir/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM supir WHERE idsupir=?", [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json({ message: "Supir berhasil dihapus" });
    } catch (err) { handleError(res, err); }
});

// Lakukan pola yang sama (async/await) untuk TRUK, KEBUN, PABRIK, dan USERS...

module.exports = router;