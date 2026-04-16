// controllers/distribusiController.js
const distribusiModel = require("../models/distribusiModel");
const { validateDistribusi, validateId, validateFileUpload } = require("../utils/validator");
const errorHandler = require("../utils/errorhandler");
const fs = require('fs');

// ============================================
// FUNGSI YANG SUDAH ADA (DIPERBAIKI)
// ============================================

// GET ALL
exports.getDistribusi = (req, res) => {
    distribusiModel.getAllWithJoin((err, results) => {
        if (err) {
            return errorHandler(res, err, 500, "Gagal mengambil data distribusi");
        }

        res.json({
            success: true,
            message: "Data distribusi berhasil diambil",
            data: results,
            total: results.length,
            timestamp: new Date().toISOString()
        });
    });
};

// POST (CREATE) dengan upload & validasi
exports.createDistribusi = (req, res) => {
    const data = req.body;
    
    // 1. Validasi data
    const validationErrors = validateDistribusi(data);
    if (validationErrors) {
        return res.status(400).json({
            success: false,
            message: "Validasi gagal",
            errors: validationErrors,
            timestamp: new Date().toISOString()
        });
    }

    // 2. Validasi file upload (jika ada)
    const errors = [];
    
    if (req.files && req.files.surat_jalan) {
        const suratJalanError = validateFileUpload(req.files.surat_jalan, 'Surat Jalan');
        if (suratJalanError) errors.push(...suratJalanError);
    }

    if (req.files && req.files.bukti_timbang) {
        const buktiTimbangError = validateFileUpload(req.files.bukti_timbang, 'Bukti Timbang');
        if (buktiTimbangError) errors.push(...buktiTimbangError);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validasi file gagal",
            errors: errors,
            timestamp: new Date().toISOString()
        });
    }

    // 3. Siapkan path file
    const surat_jalan = req.files.surat_jalan 
        ? `uploads/surat_jalan/${req.files.surat_jalan[0].filename}`
        : null;
    
    const bukti_timbang = req.files.bukti_timbang 
        ? `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`
        : null;

    // 4. Gabungkan data
    const distribusiData = {
        tanggal_kirim: data.tanggal_kirim,
        berat_tbs: data.berat_tbs,
        surat_jalan: surat_jalan,
        bukti_timbang: bukti_timbang,
        status: data.status || 'menunggu_memuat',
        users_idusers: data.users_idusers,
        supir_idsupir: data.supir_idsupir,
        truk_idtruk: data.truk_idtruk,
        kebun_idkebun: data.kebun_idkebun,
        pabrik_idpabrik: data.pabrik_idpabrik,
        created_at: new Date()
    };

    // 5. Insert ke database
    distribusiModel.createDistribusi(distribusiData, (err, result) => {
        if (err) {
            return errorHandler(res, err, 500, "Gagal membuat data distribusi");
        }

        res.status(201).json({
            success: true,
            message: "Data distribusi berhasil dibuat",
            data: {
                iddistribusi: result.insertId,
                ...distribusiData
            },
            timestamp: new Date().toISOString()
        });
    });
};

// UPDATE STATUS
exports.updateStatus = (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    // Validasi ID
    const errorId = validateId(id);
    if (errorId) {
        return res.status(400).json({
            success: false,
            message: errorId,
            timestamp: new Date().toISOString()
        });
    }

    // Validasi status
    const validStatus = ['menunggu_memuat', 'dalam_perjalanan', 'tiba_di_pabrik', 'selesai', 'ditolak'];
    if (!status || !validStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Status tidak valid",
            validStatus: validStatus,
            timestamp: new Date().toISOString()
        });
    }

    distribusiModel.updateStatus(id, status, (err, result) => {
        if (err) {
            return errorHandler(res, err, 500, "Gagal update status");
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Data distribusi tidak ditemukan",
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: "Status berhasil diupdate",
            data: {
                iddistribusi: parseInt(id),
                status: status,
                updated_at: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        });
    });
};

// ============================================
// FUNGSI BARU (Sprint 5)
// ============================================

// GET BY ID
exports.getById = (req, res) => {
    const { id } = req.params;
    
    // Validasi ID
    const error = validateId(id);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error,
            timestamp: new Date().toISOString()
        });
    }

    distribusiModel.getById(id, (err, results) => {
        if (err) {
            return errorHandler(res, err, 500, "Gagal mengambil data");
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data distribusi tidak ditemukan",
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: "Detail distribusi",
            data: results[0],
            timestamp: new Date().toISOString()
        });
    });
};

// UPDATE distribusi (dengan upload ulang)
exports.updateDistribusi = (req, res) => {
    const { id } = req.params;
    
    // Validasi ID
    const errorId = validateId(id);
    if (errorId) {
        return res.status(400).json({
            success: false,
            message: errorId,
            timestamp: new Date().toISOString()
        });
    }

    // Cek apakah data ada
    distribusiModel.getById(id, (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data distribusi tidak ditemukan",
                timestamp: new Date().toISOString()
            });
        }

        const oldData = results[0];
        const data = req.body;

        // Validasi file jika ada upload baru
        const errors = [];
        
        if (req.files && req.files.surat_jalan) {
            const suratJalanError = validateFileUpload(req.files.surat_jalan, 'Surat Jalan');
            if (suratJalanError) errors.push(...suratJalanError);
        }

        if (req.files && req.files.bukti_timbang) {
            const buktiTimbangError = validateFileUpload(req.files.bukti_timbang, 'Bukti Timbang');
            if (buktiTimbangError) errors.push(...buktiTimbangError);
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validasi file gagal",
                errors: errors,
                timestamp: new Date().toISOString()
            });
        }

        // Gunakan file lama jika tidak ada upload baru
        let surat_jalan = oldData.surat_jalan;
        let bukti_timbang = oldData.bukti_timbang;

        if (req.files.surat_jalan) {
            // Hapus file lama jika ada
            if (oldData.surat_jalan && fs.existsSync(oldData.surat_jalan)) {
                fs.unlinkSync(oldData.surat_jalan);
            }
            surat_jalan = `uploads/surat_jalan/${req.files.surat_jalan[0].filename}`;
        }

        if (req.files.bukti_timbang) {
            if (oldData.bukti_timbang && fs.existsSync(oldData.bukti_timbang)) {
                fs.unlinkSync(oldData.bukti_timbang);
            }
            bukti_timbang = `uploads/bukti_timbang/${req.files.bukti_timbang[0].filename}`;
        }

        const updateData = {
            tanggal_kirim: data.tanggal_kirim,
            berat_tbs: data.berat_tbs,
            surat_jalan: surat_jalan,
            bukti_timbang: bukti_timbang,
            status: data.status,
            users_idusers: data.users_idusers,
            supir_idsupir: data.supir_idsupir,
            truk_idtruk: data.truk_idtruk,
            kebun_idkebun: data.kebun_idkebun,
            pabrik_idpabrik: data.pabrik_idpabrik
        };

        distribusiModel.updateDistribusi(id, updateData, (err) => {
            if (err) {
                return errorHandler(res, err, 500, "Gagal update data distribusi");
            }

            res.json({
                success: true,
                message: "Data distribusi berhasil diupdate",
                data: {
                    iddistribusi: parseInt(id),
                    ...updateData,
                    updated_at: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            });
        });
    });
};

// DELETE
exports.deleteDistribusi = (req, res) => {
    const { id } = req.params;

    // Validasi ID
    const error = validateId(id);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error,
            timestamp: new Date().toISOString()
        });
    }

    distribusiModel.deleteDistribusi(id, (err, result) => {
        if (err) {
            return errorHandler(res, err, 500, "Gagal hapus data distribusi");
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Data distribusi tidak ditemukan",
                timestamp: new Date().toISOString()
            });
        }

        res.json({
            success: true,
            message: "Data distribusi berhasil dihapus",
            data: {
                iddistribusi: parseInt(id)
            },
            timestamp: new Date().toISOString()
        });
    });
};

// GET by status
exports.getByStatus = (req, res) => {
    const { status } = req.params;

    distribusiModel.getByStatus(status, (err, results) => {
        if (err) {
            return errorHandler(res, err, 500, "Gagal mengambil data");
        }

        res.json({
            success: true,
            message: `Data distribusi dengan status ${status}`,
            data: results,
            total: results.length,
            timestamp: new Date().toISOString()
        });
    });
};