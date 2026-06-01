import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

// 1. KODE IMPOR HALAMAN TRANSAKSI (PUNYA KAMU)
// Karena file transaksi sudah dipindah ke folder Transaksi, jalurnya harus mundur satu folder (../)
import FormManifest from '../Transaksi/formManifest';
import TabelDistribusi from '../Transaksi/TabelDistribusi';

// 2. KODE IMPOR GRAFIK STATISTIK (PUNYA TEMANMU)
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Dashboard = () => {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [activePage, setActivePage] = useState('dashboard');
  const [userRole, setUserRole] = useState(localStorage.getItem('user_role') || 'manajer');
  const token = localStorage.getItem('token') || '';

  // State untuk Data Ringkasan Dashboard & Laporan
  const [stats, setStats] = useState({ totalBerat: 0, totalPengiriman: 0 });
  const [laporanData, setLaporanData] = useState([]);
  const [tanggalMulai, setTanggalMulai] = useState('2026-04-01');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-04-30');

  // State untuk Data Master & Sub-Tab Dinamis
  const [activeMasterType, setActiveMasterType] = useState('supir');
  const [masterData, setMasterData] = useState([]);
  const [isMasterLoading, setIsMasterLoading] = useState(false);

  // State untuk Mengontrol Modal Tambah Data Master
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Input Form Transaksi Distribusi Baru
  const [formTransaksi, setFormTransaksi] = useState({
    supir: '',
    plat: '',
    berat: '',
    status: 'menunggu_memuat'
  });

  // State Dummy untuk Tabel Transaksi/Distribusi
  const [transaksiList, setTransaksiList] = useState([
    { supir: 'Supir Dummy 1', plat: 'BM 1234 AA', berat: 4500, status: 'menunggu_memuat' }
  ]);

  // ==========================================
  // 2. LIFECYCLE EFFECTS
  // ==========================================
useEffect(() => {
  getDashboardData();
}, []);

useEffect(() => {
  console.log('🔥 EFFECT TRIGGERED:', activePage, activeMasterType);
  if (activePage === 'master') {
    loadMasterData();
  }
}, [activePage, activeMasterType]);
  // ==========================================
  // 3. FUNGSI LOGIKA API BACKEND
  // ==========================================

  // Ambil Data Hitungan Ringkasan & Tabel Laporan
  const getDashboardData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/laporan?tanggal_mulai=${tanggalMulai}&tanggal_selesai=${tanggalSelesai}`
      );

      const result = await response.json();

      console.log(result);

      const data = result.data || [];

      setLaporanData(data);

      let total = 0;
      data.forEach(item => {
        total += parseFloat(item.berat_tbs || 0);
      });

      setStats({
        totalBerat: total,
        totalPengiriman: data.length
      });
    } catch (error) {
      console.error("Error Dashboard Data:", error);
    }
  };

  // Ambil List Data Master Berdasarkan Sub-Tab Aktif
  const loadMasterData = async () => {
    console.log('🔥 LOAD MASTER CALLED!', activeMasterType); // TAMBAH INI
    setIsMasterLoading(true);
    setMasterData([]);
    try {
      const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === 'Success') {
        setMasterData(result.data || []);
      }
    } catch (error) {
      console.error('Error Master Data:', error);
    } finally {
      setIsMasterLoading(false);
    }
  };

// Logika Simpan Data Master Baru
const submitAddData = async (e) => {
  e.preventDefault();
  
  console.log('DEBUG TOKEN:', token);
  if (!token) {
    alert('TOKEN KOSONG! Coba logout dan login lagi.');
    return;
  }
  
  try {
    let cleanData = {};
    if (activeMasterType === 'supir') {
      cleanData = { nama_supir: inputData.nama_supir, no_hp: inputData.no_hp };
    } else if (activeMasterType === 'truk') {
cleanData = { no_polisi: inputData.no_polisi, kapasitas_ton: inputData.kapasitas };
    } else if (activeMasterType === 'kebun') {
      cleanData = { nama_kebun: inputData.nama_kebun, lokasi: inputData.lokasi };
    } else if (activeMasterType === 'pabrik') {
      cleanData = { nama_pabrik: inputData.nama_pabrik, lokasi: inputData.lokasi };
    }
    
    console.log('📤 Kirim:', cleanData);
    
    const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanData)
    });
    
    const result = await response.json();
    
    if (result.status === 'Success') {
      alert(result.message || 'Data berhasil disimpan!');
      setIsModalOpen(false);
      setInputData({});
      loadMasterData();
    } else {
      alert('Gagal: ' + (result.message || 'Data gagal disimpan'));
    }
  } catch (error) {
    console.error('❌ Error:', error);
    alert('Error: ' + error.message);
  }
};

// Update Data Master
const submitUpdateData = async (e) => {
  e.preventDefault();
  try {
    let cleanData = {};
    if (activeMasterType === 'supir') {
      cleanData = { nama_supir: inputData.nama_supir, no_hp: inputData.no_hp };
    } else if (activeMasterType === 'truk') {
cleanData = { no_polisi: inputData.no_polisi, kapasitas_ton: inputData.kapasitas };
    } else if (activeMasterType === 'kebun') {
      cleanData = { nama_kebun: inputData.nama_kebun, lokasi: inputData.lokasi };
    } else if (activeMasterType === 'pabrik') {
      cleanData = { nama_pabrik: inputData.nama_pabrik, lokasi: inputData.lokasi };
    }

    const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}/${editId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cleanData)
    });
    
    const result = await response.json();
    if (result.status === 'Success') {
      alert('Data berhasil diupdate!');
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditId(null);
      setInputData({});
      loadMasterData();
    } else {
      alert('Gagal: ' + result.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

  // Logika Soft Delete Data Master
  const handleDeleteData = async (id) => {
    const confirmed = confirm('Apakah Anda yakin ingin menghapus data ini?\n\nData akan diarsipkan (soft delete) dan tetap tersimpan dalam histori transaksi.');
    if (!confirmed) return;
    try {
      const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === 'Success') {
        alert(result.message || 'Data berhasil dihapus');
        loadMasterData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Submit Form Transaksi Jalur Frontend
  const handleTransaksiSubmit = (e) => {
    e.preventDefault();
    const newData = {
      supir: formTransaksi.supir,
      plat: formTransaksi.plat,
      berat: parseFloat(formTransaksi.berat || 0),
      status: formTransaksi.status
    };
    setTransaksiList([...transaksiList, newData]);
    alert('Data Distribusi Berhasil Ditambahkan ke Tabel Simulasi!');
    setFormTransaksi({ supir: '', plat: '', berat: '', status: 'menunggu_memuat' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getMasterTitle = () => {
    const titles = { supir: 'Supir', truk: 'Truk', kebun: 'Kebun', pabrik: 'Pabrik' };
    return titles[activeMasterType];
  };

  // DATA LINE CHART
  const lineChartData = laporanData.map((item, index) => ({
    name: `Data ${index + 1}`,
    berat: parseFloat(item.berat_tbs)
  }));

  // DATA BAR CHART
  const barChartData = laporanData.map((item, index) => ({
    tanggal: formatDate(item.tanggal),
    berat: parseFloat(item.berat_tbs)
  }));

  // DATA DONUT CHART
  const kebunMap = {};

  laporanData.forEach((item) => {
    const kebun = item.kebun || 'Tidak Diketahui';

    if (!kebunMap[kebun]) {
      kebunMap[kebun] = 0;
    }

    kebunMap[kebun] += parseFloat(item.berat_tbs);
  });

  const pieChartData = Object.keys(kebunMap).map((key) => ({
    name: key,
    value: kebunMap[key]
  }));

  const COLORS = ['#15803d', '#16a34a', '#22c55e', '#4ade80'];

  // ==========================================
  // 4. KONTEN SUB-RENDERER HALAMAN
  // ==========================================
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className={styles.dashboard}>
            <h1>Dashboard Monitoring Sawit</h1>
            <div className={styles['stats-grid']}>
              <div className={styles['stat-card']}>
                <h3>Total Berat TBS</h3>
                <p>{stats.totalBerat} Kg</p>
              </div>
              <div className={styles['stat-card']}>
                <h3>Jumlah Pengiriman</h3>
                <p>{stats.totalPengiriman}</p>
              </div>
            </div>
          </div>
        );

      case 'master':
        return (
          <div className={styles.pageContent}>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Master</h1>

            <div className="flex gap-2 my-4 bg-gray-100 p-1.5 rounded-xl w-max">
              {['supir', 'truk', 'kebun', 'pabrik'].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveMasterType(type)}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize ${activeMasterType === type ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  Data {type}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setEditId(null);
                  setInputData({});
                  setIsModalOpen(true);
                }}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2"
              >
                <i className="fas fa-plus text-xs"></i> Tambah {getMasterTitle()}
              </button>
            </div>

            {isMasterLoading ? (
              <div className="p-12 text-center text-gray-500 font-medium">
                <i className="fas fa-spinner animate-spin text-green-700 text-2xl mb-2 block"></i>
                <p>Memuat data master...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-4 px-6">ID</th>
                      {activeMasterType === 'supir' && <><th>Nama Supir</th><th>No. HP</th></>}
                      {activeMasterType === 'truk' && <><th>No. Polisi</th><th>Merk</th><th>Kapasitas</th></>}
                      {activeMasterType === 'kebun' && <><th>Nama Kebun</th><th>Lokasi</th></>}
                      {activeMasterType === 'pabrik' && <><th>Nama Pabrik</th><th>Lokasi</th></>}
                      <th>Dibuat</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm divide-y divide-gray-50">
                    {masterData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-400 font-medium">Tidak ada data terdaftar dalam sistem.</td>
                      </tr>
                    ) : (
                      masterData.map((item, index) => {
                        const idKey = `id${activeMasterType}`;
                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition">
                            <td className="py-4 px-6 font-medium">{item[idKey]}</td>
                            {activeMasterType === 'supir' && <>
                              <td className="py-4 px-6 font-semibold text-gray-900">{item.nama_supir}</td>
                              <td className="py-4 px-6 text-gray-500">{item.no_hp}</td>
                            </>}
                            {activeMasterType === 'truk' && <>
                              <td className="py-4 px-6 font-semibold text-gray-900">{item.no_polisi}</td>
                              <td className="py-4 px-6 text-gray-500">{item.merk}</td>
                              <td className="py-4 px-6 font-medium text-green-700">{item.kapasitas_ton} ton</td>
                            </>}
                            {activeMasterType === 'kebun' && <>
                              <td className="py-4 px-6 font-semibold text-gray-900">{item.nama_kebun}</td>
                              <td className="py-4 px-6 text-gray-500">{item.lokasi}</td>
                            </>}
                            {activeMasterType === 'pabrik' && <>
                              <td className="py-4 px-6 font-semibold text-gray-900">{item.nama_pabrik}</td>
                              <td className="py-4 px-6 text-gray-500">{item.lokasi}</td>
                            </>}
                            <td className="py-4 px-6 text-gray-400">{formatDate(item.created_at)}</td>
                            <td className="py-4 px-6">
                              <button
                              onClick={() => {
                                const idKey = `id${activeMasterType}`;
                                setEditId(item[idKey]);
                                setInputData(item);
                                setIsEditMode(true);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 mr-3"
                            >
                              <i className="fas fa-edit text-xs"></i> Edit
                            </button>
                              <button
                                onClick={() => handleDeleteData(item[idKey])}
                                className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                              >
                                <i className="fas fa-trash text-xs"></i> Hapus
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

     case 'transaksi':
  return (
    <div className={styles.pageContent}>
      {/* Judul Utama */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transaksi Distribusi</h1>
        <p className="text-gray-500 text-sm mt-1">Pencatatan manifes baru dan pemantauan real-time alur pengiriman logistik sawit.</p>
      </div>

      {/* Layout Menumpuk ke Bawah (Satu Kolom Penuh) */}
      <div className="flex flex-col gap-6 w-full">
        
        {/* Bagian Atas - Memanggil Tabel Distribusi (Lebar Penuh) */}
        <div className="w-full">
          <TabelDistribusi 
            transaksiList={transaksiList}
            setTransaksiList={setTransaksiList}
          />
        </div>

        {/* Bagian Bawah - Memanggil Form Manifest (Lebar Penuh) */}
        <div className="w-full">
          <FormManifest 
            formTransaksi={formTransaksi}
            setFormTransaksi={setFormTransaksi}
            handleTransaksiSubmit={handleTransaksiSubmit}
          />
        </div>

      </div>
    </div>
  );
      case 'laporan':
        return (
          <div className={styles.pageContent}>
            {/* CARD STATISTIK */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

              {/* TOTAL BERAT */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all duration-300">

                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total Berat
                  </p>

                  <h2 className="text-2xl font-bold text-green-700 mt-2">
                    {stats.totalBerat} Kg
                  </h2>

                  <p className="text-xs text-green-600 mt-1">
                    Total distribusi bulan ini
                  </p>
                </div>

                <div className="bg-green-100 p-4 rounded-2xl">
                  <i className="fas fa-boxes text-2xl text-green-700"></i>
                </div>

              </div>

              {/* TOTAL PENGIRIMAN */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all duration-300">

                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Pengiriman
                  </p>

                  <h2 className="text-2xl font-bold text-blue-700 mt-2">
                    {stats.totalPengiriman}
                  </h2>

                  <p className="text-xs text-blue-600 mt-1">
                    Total pengiriman aktif
                  </p>
                </div>

                <div className="bg-blue-100 p-4 rounded-2xl">
                  <i className="fas fa-truck text-2xl text-blue-700"></i>
                </div>

              </div>

              {/* SUPIR AKTIF */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all duration-300">

                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Supir Aktif
                  </p>

                  <h2 className="text-2xl font-bold mt-2" style={{ color: '#f97316' }}>
                    12
                  </h2>

                  <p className="text-xs mt-1" style={{ color: '#fb923c' }}>
                    Supir sedang bertugas
                  </p>
                </div>

                <div className="bg-orange-100 p-4 rounded-2xl text-2xl">
                  👨‍✈️
                </div>

              </div>

              {/* TRUK OPERASIONAL */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all duration-300">

                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Truk Operasional
                  </p>

                  <h2 className="text-3xl font-extrabold text-purple-700 mt-2">
                    8 Truk
                  </h2>

                  <p className="text-xs text-purple-600 mt-1">
                    Armada siap digunakan
                  </p>
                </div>

                <div className="bg-purple-100 p-4 rounded-2xl">
                  <i className="fas fa-shipping-fast text-2xl text-purple-700"></i>
                </div>

              </div>

            </div>

            {/* FILTER TANGGAL */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-5">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Tanggal Mulai
                  </label>

                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Tanggal Selesai
                  </label>

                  <input
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5"
                  />
                </div>

                <button
                  onClick={getDashboardData}
                  className="bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl py-2.5"
                >
                  Filter Laporan
                </button>

              </div>
              <p className="text-sm text-gray-500 mt-3">
                Menampilkan data dari{" "}
                <span className="font-bold text-green-700">
                  {formatDate(tanggalMulai)}
                </span>{" "}
                sampai{" "}
                <span className="font-bold text-green-700">
                  {formatDate(tanggalSelesai)}
                </span>
              </p>

            </div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Laporan Pengiriman Ringkasan
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Histori laporan pengiriman terintegrasi basis data periode April 2026.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-sm transition"
              >
                <i className="fas fa-print mr-1"></i>
                Cetak Laporan
              </button>
            </div>

            {/* TABEL LAPORAN */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">

              <table className="w-full text-left border-collapse">

                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">No Laporan</th>
                    <th className="py-4 px-6">Tanggal Pengiriman</th>
                    <th className="py-4 px-6">Berat Muatan</th>
                    <th className="py-4 px-6">Keterangan Status</th>
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">

                  {laporanData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-6 text-center text-gray-400"
                      >
                        Tidak ada data laporan pada rentang tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    laporanData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50/50 transition"
                      >
                        <td className="py-4 px-6 font-medium text-gray-900">
                          #LAP-{1000 + index}
                        </td>

                        <td className="py-4 px-6">
                          {formatDate(item.tanggal)}
                        </td>

                        <td className="py-4 px-6 font-semibold text-green-700">
                          {item.berat_tbs} Kg
                        </td>

                        <td className="py-4 px-6">
                          <span className="bg-green-100 text-green-800 font-bold px-2.5 py-1 rounded-full text-xs">
                            Sukses Terdata
                          </span>
                        </td>
                      </tr>
                    ))
                  )}

                </tbody>
              </table>
            </div>

            {/* CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

              {/* LINE CHART */}
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4">
                  Tren Berat Pengiriman
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="berat"
                      stroke="#15803d"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* BAR CHART */}
              <div className="bg-white p-5 rounded-2xl shadow-sm">
                <h3 className="font-bold text-gray-700 mb-4">
                  Volume Pengiriman Harian
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tanggal" />
                    <YAxis />
                    <Tooltip />

                    <Bar
                      dataKey="berat"
                      fill="#16a34a"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>

            {/* DONUT CHART */}
            <div className="bg-white p-5 rounded-2xl shadow-sm mt-6">

              <h3 className="font-bold text-gray-700 mb-4">
                Kontribusi Kebun
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>

                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    label
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            </div>

          </div>
        );
      default:
        return <div>Halaman tidak ditemukan.</div>;
    }
  };

  return (
    <div className={styles['app-container']}>
      {/* SIDEBAR NAVIGATION */}
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles['sidebar-header']}><h3>Distribusi App</h3></div>
        <nav className={styles['sidebar-nav']}>
          <button className={`${styles['nav-item']} ${activePage === 'dashboard' ? styles.active : ''}`} onClick={() => setActivePage('dashboard')}>
            <i className="fas fa-tachometer-alt"></i><span>Dashboard</span>
          </button>
          <button className={`${styles['nav-item']} ${activePage === 'master' ? styles.active : ''}`} onClick={() => setActivePage('master')}>
            <i className="fas fa-database"></i><span>Data Master</span>
          </button>
          <button className={`${styles['nav-item']} ${activePage === 'transaksi' ? styles.active : ''}`} onClick={() => setActivePage('transaksi')}>
            <i className="fas fa-exchange-alt"></i><span>Transaksi</span>
          </button>
          <button className={`${styles['nav-item']} ${activePage === 'laporan' ? styles.active : ''}`} onClick={() => setActivePage('laporan')}>
            <i className="fas fa-file-alt"></i><span>Laporan</span>
          </button>
        </nav>
        <div className={styles['sidebar-footer']}>
          <button className={styles['btn-logout']} onClick={() => window.location.href = '/login'}>
            <i className="fas fa-sign-out-alt"></i><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles['main-content']}>
        <nav className={styles.navbar}>
          <div className={styles['navbar-toggle']}><i className="fas fa-bars"></i></div>
          <div className={styles['navbar-user']}>
            <span>Aurora</span>
            <span className={styles['user-role']}>{userRole === 'petugas' ? 'Petugas Lapangan' : 'Manajer Perusahaan'}</span>
          </div>
        </nav>
        <div className={styles['content-wrapper']}>{renderContent()}</div>
      </main>

{/* MODAL FORM POP-UP DATA MASTER */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
      <div className="bg-green-800 p-4 text-white flex justify-between items-center">
        <h3 className="font-bold">{isEditMode ? 'Edit' : 'Tambah'} Data {getMasterTitle()}</h3>
        <button onClick={() => setIsModalOpen(false)} className="text-xl hover:opacity-75">&times;</button>
      </div>
      <form onSubmit={isEditMode ? submitUpdateData : submitAddData} className="p-6 space-y-4">
        
        {/* SUPIR */}
        {activeMasterType === 'supir' && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nama Supir</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border rounded-xl" 
                value={inputData.nama_supir || ''}
                onChange={(e) => setInputData({ ...inputData, nama_supir: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">No. HP</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border rounded-xl" 
                value={inputData.no_hp || ''}
                onChange={(e) => setInputData({ ...inputData, no_hp: e.target.value })} />
            </div>
          </>
        )}
        
        {/* TRUK */}
        {activeMasterType === 'truk' && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">No. Polisi (Plat)</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border rounded-xl" 
                value={inputData.no_polisi || ''}
                onChange={(e) => setInputData({ ...inputData, no_polisi: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Kapasitas Muatan (Ton)</label>
              <input type="number" required className="w-full p-2.5 bg-gray-50 border rounded-xl" 
                value={inputData.kapasitas || ''}
                onChange={(e) => setInputData({ ...inputData, kapasitas: e.target.value })} />
            </div>
          </>
        )}
        
        {/* KEBUN / PABRIK */}
        {(activeMasterType === 'kebun' || activeMasterType === 'pabrik') && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nama {getMasterTitle()}</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border rounded-xl" 
                value={inputData[`nama_${activeMasterType}`] || ''}
                onChange={(e) => setInputData({ ...inputData, [`nama_${activeMasterType}`]: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Lokasi Wilayah</label>
              <input type="text" required className="w-full p-2.5 bg-gray-50 border rounded-xl" 
                value={inputData.lokasi || ''}
                onChange={(e) => setInputData({ ...inputData, lokasi: e.target.value })} />
            </div>
          </>
        )}
        
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Batal</button>
          <button type="submit" className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800">
            {isEditMode ? 'Update' : 'Simpan'} Data
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Dashboard;