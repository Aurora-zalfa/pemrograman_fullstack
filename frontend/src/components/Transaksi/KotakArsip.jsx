import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Impor StatusBadge dinamis kelompokmu
import StatusBadge from '../StatusBadge/StatusBadge';

const KotakArsip = () => {
  const [dataArsip, setDataArsip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataArsip = async () => {
      try {
        setLoading(true);
        // Mengambil token JWT dari localStorage
        const token = localStorage.getItem('token'); 

        // Memanggil endpoint baru khusus data terarsip (is_deleted = 1)
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

  if (loading) return <div className="p-6 text-center text-gray-500">Memuat Kotak Arsip...</div>;
  if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md m-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kotak Arsip Distribusi TBS</h2>
        <p className="text-gray-500 text-sm">Daftar histori manifes pengiriman yang telah diarsipkan oleh Manajer.</p>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
            <tr>
              <th className="px-6 py-3">No Polisi</th>
              <th className="px-6 py-3">Nama Supir</th>
              <th className="px-6 py-3">Tanggal Diarsip</th>
              <th className="px-6 py-3">Berat TBS</th>
              <th className="px-6 py-3">Status Terakhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dataArsip.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                  📭 Belum ada data transaksi yang diarsipkan.
                </td>
              </tr>
            ) : (
              dataArsip.map((item) => (
                <tr key={item.iddistribusi} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{item.no_polisi}</td>
                  <td className="px-6 py-4 text-gray-700">{item.nama_supir}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(item.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {parseFloat(item.berat_tbs).toFixed(2)} kg
                  </td>
                  
                  {/* WARNA STATUS SUDAH OTOMATIS DISESUAIKAN BERDASARKAN PROSES */}
                  <td className="px-6 py-4 whitespace-nowrap">
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