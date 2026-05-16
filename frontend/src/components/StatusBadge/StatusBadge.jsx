import React from 'react';
import styles from './StatusBadge.module.css'; // Import gaya dosen

const StatusBadge = ({ status }) => {
  // Contoh mapping class berdasarkan status
  const getStatusClass = () => {
    switch (status) {
      case 'menunggu_memuat': return styles.menunggu;
      case 'dalam_perjalanan': return styles.proses;
      case 'selesai': return styles.sukses;
      case 'ditolak': return styles.gagal;
      default: return styles.default;
    }
  };

  return (
    <span className={`${styles.badge} ${getStatusClass()}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;