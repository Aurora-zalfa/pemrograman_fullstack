import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../Dashboard/Dashboard.module.css';
import StatusBadge from '../StatusBadge/StatusBadge';

const KotakArsip = () => {
  const [dataArsip, setDataArsip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataArsip = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); 

        const response = await axios.get('http://localhost:3000/api/distribusi/archived', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setDataArsip(response.data.data);
        } else {
          setError('Gagal memuat data kotak arsip');
        }
      } catch (err) {
        console.error('Error fetching archived data:', err);
        setError(err.response?.data?.message || 'Terjadi kesalahan jaringan');
      } finally {
        setLoading(false);
      }
    };

    fetchDataArsip();
  }, []);

  if (loading) return <div className={styles.loading}><div className={styles.spinner}></div><p>Memuat Kotak Arsip...</p></div>;
  if (error) return <div className={`${styles['p-6']} ${styles['text-center']} ${styles['text-red-500']}`}>Error: {error}</div>;

  return (
    <div className={`${styles['master-container']} ${styles['p-6']}`}>
      <div className={`${styles['mb-6']}`}>
        <h2 className={`${styles['page-title']} ${styles['mb-2']}`}>Kotak Arsip Distribusi TBS</h2>
        <p className={`${styles['text-gray-500']} ${styles['text-sm']}`}>Daftar histori manifes pengiriman yang telah diarsipkan oleh Manajer.</p>
      </div>

      <div className={`${styles['table-responsive']} ${styles['overflow-x-auto']}`}>
        <table className={`${styles['data-table']} ${styles['w-full']}`}>
          <thead>
            <tr>
              <th className={styles['whitespace-nowrap']}>No Polisi</th>
              <th className={styles['whitespace-nowrap']}>Nama Supir</th>
              <th className={styles['whitespace-nowrap']}>Tanggal Diarsip</th>
              <th className={styles['whitespace-nowrap']}>Berat TBS</th>
              <th className={styles['whitespace-nowrap']}>Status Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {dataArsip.length === 0 ? (
              <tr>
                <td colSpan="5" className={`${styles['px-6']} ${styles['py-10']} ${styles['text-center']} ${styles['text-gray-500']}`}>
                  📭 Belum ada data transaksi yang diarsipkan.
                </td>
              </tr>
            ) : (
              dataArsip.map((item) => (
                <tr key={item.iddistribusi} className={`${styles['hover:bg-gray-50']} ${styles['transition-colors']}`}>
                  <td className={`${styles['font-semibold']} ${styles['text-gray-900']} ${styles['whitespace-nowrap']}`}>{item.no_polisi}</td>
                  <td className={styles['text-gray-700']}>{item.nama_supir}</td>
                  <td className={styles['text-gray-600']}>
                    {new Date(item.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className={`${styles['text-gray-700']} ${styles['font-medium']}`}>
                    {parseFloat(item.berat_tbs).toFixed(2)} kg
                  </td>
                  <td className={styles['whitespace-nowrap']}>
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KotakArsip;