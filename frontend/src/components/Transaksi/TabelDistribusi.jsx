import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axios";
import styles from "../Dashboard/Dashboard.module.css";
import Container from "../Container";
import StatusBadge from "../StatusBadge/StatusBadge";

const TabelDistribusi = ({ transaksiList, setTransaksiList, onEdit, onDelete }) => {
  // --- STATE MANAGEMENT ---
  const [dataDistribusi, setDataDistribusi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const tableRef = useRef(null);

  const userRole = localStorage.getItem('user_role') || 'manajer';

  // ✅ STATE UNTUK MODAL EDIT (pakai ID untuk dropdown)
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    supir_idsupir: '',
    truk_idtruk: '',
    berat_tbs: '',
    status: ''
  });

  // ✅ STATE UNTUK MASTER DATA (DROPDOWN)
  const [masterData, setMasterData] = useState({
    supir: [],
    truk: [],
  });
  const [masterLoading, setMasterLoading] = useState(true);

  // --- FETCH MASTER DATA ---
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [supirRes, trukRes] = await Promise.all([
          axiosInstance.get("/api/master/supir").catch(() => ({ data: { data: [] } })),
          axiosInstance.get("/api/master/truk").catch(() => ({ data: { data: [] } })),
        ]);

        setMasterData({
          supir: supirRes.data.data || [],
          truk: trukRes.data.data || [],
        });
      } catch (error) {
        console.warn("Gagal fetch master data:", error);
      } finally {
        setMasterLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  // --- FETCH DATA (DENGAN FILTER) ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/distribusi');
      const data = response.data.data || [];
      
      // 🔧 FILTER: Hanya tampilkan data yang BELUM dihapus (is_deleted = 0)
      const filteredData = data.filter(item => {
        return item.is_deleted === 0 || item.is_deleted === false || item.is_deleted === null || item.is_deleted === undefined;
      });
      
      console.log("📊 Data sebelum filter:", data.length);
      console.log("📊 Data setelah filter (aktif):", filteredData.length);
      
      setDataDistribusi(filteredData);
      if (setTransaksiList) {
        setTransaksiList(filteredData);
      }
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

  // ✅ FUNGSI DELETE
  const handleSoftDelete = async (idDistribusi) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin mengarsipkan/menghapus data distribusi ini?"
    );

    if (konfirmasi) {
      try {
        if (onDelete) {
          await onDelete(idDistribusi);
          fetchData();
          return;
        }

        const response = await axiosInstance.delete(`/api/distribusi/${idDistribusi}`);

        console.log("📝 Response DELETE:", response);

        if (response.status === 200 && response.data?.success) {
          alert("✅ Data distribusi berhasil dihapus!");
          fetchData();
        } else {
          alert(response.data?.message || "Gagal menghapus data.");
        }
      } catch (error) {
        console.error("❌ Error Delete:", error);
        console.error("❌ Response error:", error.response?.data);
        alert("❌ Terjadi kesalahan sistem saat menghapus: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // ✅ FUNGSI EDIT - BUKA MODAL (pakai ID)
  const handleEditClick = (item) => {
    console.log("📝 Edit item:", item);
    setEditingItem(item);
    setEditForm({
      supir_idsupir: item.supir_idsupir || '',
      truk_idtruk: item.truk_idtruk || '',
      berat_tbs: item.berat_tbs || '',
      status: item.status || 'menunggu_memuat'
    });
  };

  // ✅ FUNGSI SUBMIT EDIT - PAKAI PUT (kirim ID + nama)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const id = editingItem.iddistribusi || editingItem.id;
    
    console.log("🔄 ID yang akan diupdate:", id);
    console.log("📦 Data yang dikirim:", editForm);

    // Validasi
    if (!editForm.supir_idsupir || !editForm.truk_idtruk || !editForm.berat_tbs || !editForm.status) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      // Cari nama supir dan no polisi dari master data
      const selectedSupir = masterData.supir.find(s => s.idsupir === parseInt(editForm.supir_idsupir));
      const selectedTruk = masterData.truk.find(t => t.idtruk === parseInt(editForm.truk_idtruk));

      const response = await axiosInstance.put(`/api/distribusi/${id}`, {
        nama_supir: selectedSupir?.nama_supir || '',
        no_polisi: selectedTruk?.no_polisi || '',
        supir_idsupir: parseInt(editForm.supir_idsupir),
        truk_idtruk: parseInt(editForm.truk_idtruk),
        berat_tbs: parseFloat(editForm.berat_tbs),
        status: editForm.status
      });

      console.log("✅ Response update:", response.data);

      if (response.status === 200 && response.data?.success) {
        alert("✅ Data berhasil diupdate!");
        setEditingItem(null);
        setEditForm({ supir_idsupir: '', truk_idtruk: '', berat_tbs: '', status: '' });
        fetchData();
      } else {
        alert(response.data?.message || "Gagal update data.");
      }
    } catch (error) {
      console.error("❌ Error Update:", error);
      console.error("❌ Response error:", error.response?.data);
      alert("❌ Gagal update: " + (error.response?.data?.message || error.message || "Terjadi kesalahan sistem"));
    }
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

  const displayData = transaksiList && transaksiList.length > 0 ? transaksiList : dataDistribusi;

  const filteredData = (displayData || []).filter((item) => {
    const keyword = searchKeyword.toLowerCase();
    const namaSupir = item.nama_supir ? item.nama_supir.toLowerCase() : '';
    const noPolisi = item.no_polisi ? item.no_polisi.toLowerCase() : '';
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

        <div className={`${styles['mb-6']}`}>
          <input
            type="text"
            placeholder="🔍 Cari berdasarkan nama supir atau nomor polisi..."
            className={`${styles['form-control']} ${styles['w-full']}`}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading data distribusi...</p>
          </div>
        ) : (
          <div className={`${styles['table-responsive']} ${styles['overflow-x-auto']}`} ref={tableRef}>
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
                      
                      <td className={`text-center ${styles['whitespace-nowrap']}`}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                          {userRole === 'petugas' && (
                            <>
                              <button
                                onClick={() => handleEditClick(item)}
                                style={{
                                  background: '#012A0D',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleSoftDelete(item.iddistribusi || item.id)}
                                style={{
                                  background: '#dc2626',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                🗑️ Hapus
                              </button>
                            </>
                          )}

                          {userRole === 'manajer' && (
                            <button
                              onClick={() => handleSoftDelete(item.iddistribusi || item.id)}
                              style={{
                                background: '#fef3c7',
                                color: '#92400e',
                                border: '2px solid #fcd34d',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              📦 Arsipkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ✅ MODAL EDIT - DROPDOWN */}
      {editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            width: '450px',
            maxWidth: '90%',
            border: '2px solid #012A0D'
          }}>
            <h2 style={{ color: '#012A0D', marginBottom: '20px' }}>✏️ Edit Transaksi Distribusi</h2>
            <form onSubmit={handleEditSubmit}>
              
              {/* DROPDOWN NAMA SUPIR */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#012A0D' }}>
                  Nama Supir <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={editForm.supir_idsupir}
                  onChange={(e) => setEditForm({...editForm, supir_idsupir: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">-- Pilih Supir --</option>
                  {masterData.supir.map((supir) => (
                    <option key={supir.idsupir} value={supir.idsupir}>
                      {supir.nama_supir}
                    </option>
                  ))}
                </select>
              </div>

              {/* DROPDOWN NO POLISI */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#012A0D' }}>
                  No Polisi <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={editForm.truk_idtruk}
                  onChange={(e) => setEditForm({...editForm, truk_idtruk: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="">-- Pilih Truk --</option>
                  {masterData.truk.map((truk) => (
                    <option key={truk.idtruk} value={truk.idtruk}>
                      {truk.no_polisi}
                    </option>
                  ))}
                </select>
              </div>

              {/* BERAT TBS */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#012A0D' }}>
                  Berat TBS (Kg) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="number"
                  value={editForm.berat_tbs}
                  onChange={(e) => setEditForm({...editForm, berat_tbs: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              {/* STATUS */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', color: '#012A0D' }}>
                  Status <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    fontSize: '14px'
                  }}
                  required
                >
                  <option value="menunggu_memuat">Menunggu Memuat</option>
                  <option value="dalam_perjalanan">Dalam Perjalanan</option>
                  <option value="tiba_di_pabrik">Tiba di Pabrik</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

              {/* BUTTON */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    background: 'white',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#012A0D',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default TabelDistribusi;