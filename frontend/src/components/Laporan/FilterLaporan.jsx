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

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const [filterType, setFilterType] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [tanggalMulai, setTanggalMulai] = useState(
    initialTanggalMulai || getDefaultDate(true)
  );
  const [tanggalSelesai, setTanggalSelesai] = useState(
    initialTanggalSelesai || getDefaultDate(false)
  );

  const getDateRangeFromMonth = (month) => {
    const [year, monthNum] = month.split('-');
    const start = `${year}-${monthNum}-01`;
    const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    const end = `${year}-${monthNum}-${lastDay}`;
    return { start, end };
  };

  const handleFilter = () => {
    let start, end;
    
    if (filterType === 'month') {
      const range = getDateRangeFromMonth(selectedMonth);
      start = range.start;
      end = range.end;
      setTanggalMulai(start);
      setTanggalSelesai(end);
    } else {
      start = tanggalMulai;
      end = tanggalSelesai;
    }
    
    console.log("📅 Filter diterapkan:", start, "s/d", end);
    
    if (onFilter) {
      onFilter(start, end);
    }
  };

  const handleReset = () => {
    const currentMonth = getCurrentMonth();
    setFilterType('month');
    setSelectedMonth(currentMonth);
    const range = getDateRangeFromMonth(currentMonth);
    setTanggalMulai(range.start);
    setTanggalSelesai(range.end);
    
    if (onFilter) {
      onFilter(range.start, range.end);
    }
  };

  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = -6; i <= 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthName = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      options.push({ value: `${year}-${month}`, label: monthName });
    }
    return options;
  };

  const monthOptions = generateMonthOptions();

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

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="radio"
            value="month"
            checked={filterType === 'month'}
            onChange={() => setFilterType('month')}
          />
          <span>Filter Berdasarkan Bulan</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="radio"
            value="custom"
            checked={filterType === 'custom'}
            onChange={() => setFilterType('custom')}
          />
          <span>Filter Tanggal Custom</span>
        </label>
      </div>

      {filterType === 'month' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Pilih Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={styles['form-control']}
            style={{ width: '250px' }}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterType === 'custom' && (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '20px' }}>
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
        </div>
      )}

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button onClick={handleFilter} className={styles['btn-add']}>
          🔍 Filter
        </button>
        <button onClick={handleReset} className={styles['btn-add']} style={{ background: '#6c757d' }}>
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default FilterLaporan;