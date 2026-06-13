import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axios";
import styles from "../Dashboard/Dashboard.module.css";
import Container from "../Container";
import StatusBadge from "../StatusBadge/StatusBadge";

const TabelDistribusi = () => {
  // --- STATE MANAGEMENT ---
  const [dataDistribusi, setDataDistribusi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const tableRef = useRef(null);

  // 🔒 SECURITY ACCESS: Ambil role akun yang login (petugas / manajer)
  const userRole = localStorage.getItem('user_role') || 'manajer'; 

  // --- AXIOS FETCHING STANDARD ---
  const fetchData = async () => {
    try {
      setLoading(true);
      // Mengambil seluruh data distribusi sekaligus tanpa parameter query pencarian
      const response = await axiosInstance.get('/api/distribusi');
      setDataDistribusi(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data distribusi:", error);
      setDataDistribusi([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check scroll position
  const checkScroll = () => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setShowScrollLeft(scrollLeft > 0);
      setShowScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => table.removeEventListener('scroll', checkScroll);
    }
  }, []);

  // 🔒 REVISI UTAMA: Fungsi Request Delete/Arsip
  const handleSoftDelete = async (idDistribusi) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin mengarsipkan data distribusi ini?"
    );

    if (konfirmasi) {
      try {
        const response = await axiosInstance.delete(`/api/distribusi/${idDistribusi}`);

        if (response.status === 200 || response.data?.success) {
          alert("Sukses! Data distribusi berhasil diarsipkan.");
          fetchData();
        } else {
          alert(response.data?.message || "Gagal mengarsipkan data.");
        }
      } catch (error) {
        console.error("Error Delete/Archive:", error);
        alert("Terjadi kesalahan sistem: Endpoint backend tidak merespon atau token kedaluwarsa.");
      }
    }
  };

  // Fungsi placeholder untuk Edit Data (Petugas)
  const handleEdit = (idDistribusi) => {
    alert(`Membuka form edit untuk ID Distribusi: ${idDistribusi}`);
  };

  // --- DATA FORMATTING ---
  const formatTanggal = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatStatus = (statusSnakeCase) => {
    if (!statusSnakeCase) return '-';
    return statusSnakeCase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // 🛠️ FILTER LOKAL DI FRONTEND (Menyaring nama supir, nomor polisi, dan format tanggal kustom)
  const filteredData = (dataDistribusi || []).filter((item) => {
    const keyword = searchKeyword.toLowerCase();
    
    const namaSupir = item.nama_supir ? item.nama_supir.toLowerCase() : '';
    const noPolisi = item.no_polisi ? item.no_polisi.toLowerCase() : '';
    
    // Dapatkan juga teks tanggal terformat agar user bisa mencari berdasarkan nama bulan atau tahun
    const tanggalTerformat = item.tanggal_kirim ? formatTanggal(item.tanggal_kirim).toLowerCase() : '';

    return (
      namaSupir.includes(keyword) || 
      noPolisi.includes(keyword) || 
      tanggalTerformat.includes(keyword)
    );
  });

  return (
    <Container>
      <div className={`${styles['master-container']} ${styles['p-6']}`}>
        <h2 className={`${styles['page-title']} ${styles['mb-4']}`}>Daftar Distribusi TBS</h2>

        {/* Kotak Pencarian */}
        <div className={`${styles['mb-6']}`}>
          <input
            type="text"
            placeholder="🔍 Cari berdasarkan nama supir atau nomor polisi..."
            className={`${styles['form-control']} ${styles['w-full']}`}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* --- LOADING & TABLE STATE --- */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading data distribusi...</p>
          </div>
        ) : (
          <div className={`${styles['table-responsive']} ${styles['overflow-x-auto']}`} ref={tableRef}>
            {/* Scroll Buttons */}
            {showScrollLeft && (
              <button 
                onClick={scrollLeft} 
                className={styles['scroll-button-left']}
                aria-label="Scroll kiri"
              >
                ‹
              </button>
            )}
            {showScrollRight && (
              <button 
                onClick={scrollRight} 
                className={styles['scroll-button-right']}
                aria-label="Scroll kanan"
              >
                ›
              </button>
            )}
            
            <table className={`${styles['data-table']} ${styles['w-full']}`}>
              <thead>
                <tr>
                  <th className={styles['whitespace-nowrap']}>No Polisi</th>
                  <th className={styles['whitespace-nowrap']}>Nama Supir</th>
                  <th className={styles['whitespace-nowrap']}>Tanggal</th>
                  <th className={styles['whitespace-nowrap']}>Berat TBS</th>
                  <th className={styles['whitespace-nowrap']}>Status</th>
                  <th className={`text-center ${styles['whitespace-nowrap']}`}>Aksi Otoritas</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={`${styles['text-center']} ${styles['py-3']} ${styles['text-gray-400']} ${styles['font-medium']}`}>
                      🚫 Data distribusi tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.iddistribusi || item.id} className={`${styles['hover:bg-gray-50']} ${styles['transition-colors']}`}>
                      <td className={`${styles['font-medium']} ${styles['text-gray-900']} ${styles['whitespace-nowrap']}`}>{item.no_polisi}</td>
                      <td className={styles['text-gray-700']}>{item.nama_supir}</td>
                      <td className={styles['text-gray-600']}>{formatTanggal(item.tanggal_kirim)}</td>
                      <td className={styles['text-gray-700']}>{item.berat_tbs} kg</td>
                      <td>
                        <StatusBadge status={item.status}>
                          {formatStatus(item.status)}
                        </StatusBadge>
                      </td>
                      
                      {/* 🔒 ROLE GATE ACTIONS */}
                      <td className={`text-center ${styles['whitespace-nowrap']}`}>
                        {userRole === 'petugas' && (
                          <button
                            onClick={() => handleEdit(item.iddistribusi || item.id)}
                            className={`${styles['btn-add']} bg-blue-50 text-blue-700 hover:bg-blue-100`}
                            style={{ background: '#dbeafe', color: '#1e40af', border: '2px solid #93c5fd' }}
                          >
                            ✏️ Edit Data
                          </button>
                        )}

                        {userRole === 'manajer' && (
                          <button
                            onClick={() => handleSoftDelete(item.iddistribusi || item.id)}
                            className={`${styles['btn-delete']}`}
                          >
                            📦 Arsipkan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TabelDistribusi;