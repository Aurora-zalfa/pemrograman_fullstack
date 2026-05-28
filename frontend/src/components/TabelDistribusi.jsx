import React, { useState, useEffect } from 'react';
// 🛠️ PERBAIKAN: Mengarah ke file asli kamu (src/utils/axios.js)
import axiosInstance from '../utils/axios'; 

// --- INTEGRASI TIM ---
// Menggunakan titik satu (./) karena berada di folder yang sama (src/components/)
// import StatusBadge from './StatusBadge'; 
import StatusBadge from "./StatusBadge/StatusBadge";
import Container from './Container'; 

const TabelDistribusi = () => {
  // --- 4. STATE MANAGEMENT ---
  const [dataDistribusi, setDataDistribusi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // --- 4 & 5. LIFECYCLE & AXIOS FETCHING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mengambil data dari backend dengan interceptor Rumaisha (Token otomatis terisi)
        const response = await axiosInstance.get('/api/distribusi');
        setDataDistribusi(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data distribusi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 2. DATA FORMATTING FUNCTIONS ---
  // Format Tanggal ISO ke Bahasa Indonesia
  const formatTanggal = (isoString) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format snake_case (dalam_perjalanan) ke text rapi (Dalam Perjalanan)
  const formatStatus = (statusSnakeCase) => {
    if (!statusSnakeCase) return '-';
    return statusSnakeCase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // --- 1. CLIENT-SIDE DATA FILTERING (PENCARIAN) ---
  const filteredData = (dataDistribusi || []).filter((item) => {
    const keyword = searchKeyword.toLowerCase();
    const namaSupir = item.nama_supir ? item.nama_supir.toLowerCase() : '';
    const noPolisi = item.no_polisi ? item.no_polisi.toLowerCase() : '';
    
    // Cari berdasarkan nama supir ATAU nomor polisi
    return namaSupir.includes(keyword) || noPolisi.includes(keyword);
  });

  return (
    // --- 3. UI INTEGRATION (Bungkus pakai Container Zainab) ---
    <Container>
      <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Daftar Distribusi TBS</h2>

        {/* Kotak Pencarian Silvia */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Cari berdasarkan nama supir atau nomor polisi..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>

        {/* --- 4. LOADING STATE --- */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {/* --- 4. EMPTY STATE --- */}
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-400 font-medium">
                      🚫 Data distribusi tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  // Looping data yang sudah difilter
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{item.no_polisi}</td>
                      <td className="px-4 py-3">{item.nama_supir}</td>
                      {/* Tampilkan tanggal yang sudah diformat */}
                      <td className="px-4 py-3">{formatTanggal(item.tanggal)}</td>
                      {/* Tampilkan berat tbs + teks "kg" */}
                      <td className="px-4 py-3">{item.berat_tbs} kg</td>
                      <td className="px-4 py-3">
                        {/* --- 3. STATUS BADGE AURORA --- */}
                        <StatusBadge status={item.status}>
                          {formatStatus(item.status)}
                        </StatusBadge>
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