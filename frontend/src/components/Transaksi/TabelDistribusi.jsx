import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import styles from "../Dashboard/Dashboard.module.css";
import Container from "../Container";
import StatusBadge from "../StatusBadge/StatusBadge";

const TabelDistribusi = () => {
  // --- STATE MANAGEMENT ---
  const [dataDistribusi, setDataDistribusi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 🔒 SECURITY ACCESS: Ambil role akun yang login (petugas / manajer)
  const userRole = localStorage.getItem('user_role') || 'manajer'; 

  // --- AXIOS FETCHING ---
  const fetchData = async () => {
    try {
      setLoading(true);
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

  // 🔒 REVISI UTAMA: Fungsi Request Delete/Arsip yang disesuaikan dengan standar REST API Backend
  const handleSoftDelete = async (idDistribusi) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin mengarsipkan data distribusi ini?"
    );

    if (konfirmasi) {
      try {
        // 🛠️ PERBAIKAN: Menggunakan axiosInstance.delete ke rute dinamis backend kelompokmu
        const response = await axiosInstance.delete(`/api/distribusi/${idDistribusi}`);

        // Toleransi pengecekan response sukses (baik via property .success atau status HTTP 200)
        if (response.status === 200 || response.data?.success) {
          alert("Sukses! Data distribusi berhasil diarsipkan.");
          fetchData(); // Refresh isi tabel secara real-time
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

  // --- CLIENT-SIDE SEARCH FILTER ---
  const filteredData = (dataDistribusi || []).filter((item) => {
    const keyword = searchKeyword.toLowerCase();
    const namaSupir = item.nama_supir ? item.nama_supir.toLowerCase() : '';
    const noPolisi = item.no_polisi ? item.no_polisi.toLowerCase() : '';
    return namaSupir.includes(keyword) || noPolisi.includes(keyword);
  });

  return (
    <Container>
      <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow">
        
        {/* ✨ REVISI: Banner kuning atas sudah DILENYAPKAN total sesuai permintaanmu */}

        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-left">Daftar Distribusi TBS</h2>

        {/* Kotak Pencarian */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Cari berdasarkan nama supir atau nomor polisi..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* --- LOADING & TABLE STATE --- */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            <span className="animate-spin inline-block mr-2">🔄</span> Loading data distribusi...
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-4 py-3">No Polisi</th>
                  <th className="px-4 py-3">Nama Supir</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Berat TBS</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Aksi Otoritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 font-medium">
                      🚫 Data distribusi tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.iddistribusi || item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.no_polisi}</td>
                      <td className="px-4 py-3">{item.nama_supir}</td>
                      <td className="px-4 py-3">{formatTanggal(item.tanggal_kirim)}</td>
                      <td className="px-4 py-3">{item.berat_tbs} kg</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status}>
                          {formatStatus(item.status)}
                        </StatusBadge>
                      </td>
                      
                      {/* 🔒 ROLE GATE ACTIONS */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {userRole === 'petugas' && (
                          <button
                            onClick={() => handleEdit(item.iddistribusi || item.id)}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            ✏️ Edit Data
                          </button>
                        )}

                        {userRole === 'manajer' && (
                          <button
                            onClick={() => handleSoftDelete(item.iddistribusi || item.id)}
                            className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
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