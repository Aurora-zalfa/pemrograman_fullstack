import { useState } from 'react';
import styles from '../Dashboard/Dashboard.module.css';

const FilterLaporan = ({ onFilter, initialTanggalMulai, initialTanggalSelesai }) => {
  // Set default ke bulan berjalan
  const getDefaultDate = (isStart) => {
    const date = new Date();
    if (isStart) {
      date.setDate(1);
    }
    return date.toISOString().split('T')[0];
  };

  const [tanggalMulai, setTanggalMulai] = useState(
    initialTanggalMulai || getDefaultDate(true)
  );
  const [tanggalSelesai, setTanggalSelesai] = useState(
    initialTanggalSelesai || getDefaultDate(false)
  );

  const handleFilter = () => {
    if (onFilter) {
      onFilter(tanggalMulai, tanggalSelesai);
    }
  };

  const handleReset = () => {
    const start = getDefaultDate(true);
    const end = getDefaultDate(false);
    setTanggalMulai(start);
    setTanggalSelesai(end);
    if (onFilter) {
      onFilter(start, end);
    }
  };

  return (
    <div
      className={styles.filterLaporanPrintHide}
      style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}
    >
      <h3 style={{ marginBottom: '15px', color: '#1b5e20' }}>Filter Laporan</h3>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Tanggal Mulai</label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className={styles['form-control']}
            style={{ width: '200px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Tanggal Selesai</label>
          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            className={styles['form-control']}
            style={{ width: '200px' }}
          />
        </div>
        <button onClick={handleFilter} className={styles['btn-add']}>
          <i className="fas fa-search"></i> Filter
        </button>
        <button onClick={handleReset} className={styles['btn-add']} style={{ background: '#6c757d' }}>
          <i className="fas fa-undo"></i> Reset
        </button>
      </div>
    </div>
  );
};

export default FilterLaporan;