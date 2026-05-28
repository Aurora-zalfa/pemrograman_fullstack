import React from 'react';
import styles from './StatusBadge.module.css'; // Gaya dosen aman digunakan

const StatusBadge = ({ status }) => {
  // Jika status kosong atau undefined, kasih fallback ke default
  const currentStatus = status ? status.toLowerCase() : 'default';

  // Mapping class CSS berdasarkan 5 status dari database kamu
  const getStatusClass = () => {
    switch (currentStatus) {
      case 'menunggu_memuat': 
        return styles.menunggu;
      case 'dalam_perjalanan': 
        return styles.proses;
      case 'tiba_di_pabrik': 
        return styles.pabrik; // Status baru ke-5 kamu
      case 'selesai': 
        return styles.sukses;
      case 'ditolak': 
        return styles.gagal;
      default: 
        return styles.default;
    }
  };

  // Fungsi untuk mengubah teks dari 'tiba_di_pabrik' menjadi 'Tiba Di Pabrik' agar rapi di layar
  const formatText = (text) => {
    if (!text) return '';
    return text
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`${styles.badge} ${getStatusClass()}`}>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;