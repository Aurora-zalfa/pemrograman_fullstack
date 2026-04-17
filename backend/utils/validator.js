// utils/validator.js

/**
 * Validator untuk Upload Dokumen - Sprint 5
 * Tugas: Rumaisha (SHA)
 */

// Validasi file upload (surat_jalan & bukti_timbang)
function validateFileUpload(file, fieldName) {
    const errors = [];

    // Cek apakah file ada
    if (!file || file.length === 0) {
        errors.push(`${fieldName} wajib diupload`);
        return errors;
    }

    const fileData = file[0];

    // Validasi ukuran file (max 5MB)
    if (fileData.size > 5 * 1024 * 1024) {
        errors.push(`Ukuran ${fieldName} tidak boleh lebih dari 5MB`);
    }

    // Validasi tipe file (hanya JPG, PNG, PDF)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(fileData.mimetype)) {
        errors.push(`${fieldName} harus berupa file JPG, PNG, atau PDF`);
    }

    return errors.length > 0 ? errors : null;
}

// Validasi ID (untuk parameter :id)
function validateId(id) {
    if (!id || isNaN(id) || parseInt(id) <= 0) {
        return "ID tidak valid";
    }
    return null;
}

// Export semua validator
module.exports = {
    validateFileUpload,
    validateId
};