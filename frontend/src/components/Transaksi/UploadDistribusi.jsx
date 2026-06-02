// src/components/UploadDistribusi.jsx
// import { useState } from 'react';
import React, { useState, useEffect } from "react"; 
import axiosInstance from '../config/axios';
 // Tambahkan useEffect di sini

function UploadDistribusi({ onFileSelect, label }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState('');

  // Handle file change dengan validasi bawaan filemu yang sudah diperketat
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError('');
    setFileInfo(null);
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setError('❌ File harus berupa JPG, PNG, atau PDF');
        return;
      }

      if (file.size > maxSize) {
        setError('❌ Ukuran file maksimal 5MB');
        return;
      }

      // Jika lolos validasi, set ke state local untuk UI
      setFileInfo({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });

      // Lempar file biner ke form utama (formManifest.jsx)
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition-all text-left">
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
        📁 {label} <span className="text-red-500">*</span>
      </label>
      
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer w-full"
        required
      />

      {/* Info kalau file berhasil lolos validasi */}
      {fileInfo && (
        <div className="text-xs bg-green-50 border border-green-200 text-green-800 p-2 rounded-lg mt-1 flex flex-col">
          <span className="font-semibold truncate">✅ {fileInfo.name}</span>
          <span className="text-[10px] text-green-600">Ukuran: {fileInfo.size}</span>
        </div>
      )}

      {/* Info kalau file error */}
      {error && (
        <div className="text-xs bg-red-50 border border-red-200 text-red-700 p-2 rounded-lg mt-1 font-medium">
          {error}
        </div>
      )}
    </div>
  );
}

export default UploadDistribusi;