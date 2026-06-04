import { useState, useEffect } from 'react';  // ✅ Hapus 'React' yang tidak dipakai
import styles from './Dashboard.module.css';

// IMPOR KOMPONEN MASTER & LAPORAN
import MasterData from '../Master/MasterData';
import FilterLaporan from '../Laporan/FilterLaporan';
import CetakLaporan from '../Laporan/CetakLaporan';

// IMPOR KOMPONEN TRANSAKSI
import FormManifest from '../Transaksi/formManifest';
import TabelDistribusi from '../Transaksi/TabelDistribusi';

// IMPOR CHART LIBRARY
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashboard = () => {
  // STATE MANAGEMENT
  const [activePage, setActivePage] = useState('dashboard');
  const [userRole] = useState(localStorage.getItem('user_role') || 'manajer');  // ✅ Hapus setUserRole yang tidak dipakai
  // const token = localStorage.getItem('token') || '';

<<<<<<< Updated upstream
  // State untuk Data Ringkasan Dashboard & Laporan
  const [stats, setStats] = useState({ totalBerat: 0, totalPengiriman: 0, totalSupir: 0, totalTruk: 0, totalKebun: 0, totalPabrik: 0 });
=======
  const [stats, setStats] = useState({ totalBerat: 0, totalPengiriman: 0 });
>>>>>>> Stashed changes
  const [laporanData, setLaporanData] = useState([]);
  const [tanggalMulai, setTanggalMulai] = useState('2026-04-01');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-04-30');

  const [transaksiList, setTransaksiList] = useState([
    { supir: 'Supir Dummy 1', plat: 'BM 1234 AA', berat: 4500, status: 'menunggu_memuat' }
  ]);

  const [formTransaksi, setFormTransaksi] = useState({
    supir: '',
    plat: '',
    berat: '',
    status: 'menunggu_memuat'
  });

  // FUNGSI LOGIKA API BACKEND - DEKLARASIKAN SEBELUM USEEFFECT
  const getDashboardData = async () => {
    try {
      const [laporanRes, supirRes, trukRes, kebunRes, pabrikRes] = await Promise.all([
        fetch(`http://localhost:3000/api/laporan?tanggal_mulai=${tanggalMulai}&tanggal_selesai=${tanggalSelesai}`),
        fetch(`http://localhost:3000/api/master/supir`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/master/truk`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/master/kebun`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`http://localhost:3000/api/master/pabrik`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);
      const laporanResult = await laporanRes.json();
      const supirResult = await supirRes.json();
      const trukResult = await trukRes.json();
      const kebunResult = await kebunRes.json();
      const pabrikResult = await pabrikRes.json();
      const data = laporanResult.data || [];
      setLaporanData(data);
      let total = 0;
      data.forEach(item => { total += parseFloat(item.berat_tbs || 0); });
      setStats({
        totalBerat: total,
        totalPengiriman: data.length,
        totalSupir: (supirResult.data || []).length,
        totalTruk: (trukResult.data || []).length,
        totalKebun: (kebunResult.data || []).length,
        totalPabrik: (pabrikResult.data || []).length,
      });
    } catch (error) {
      console.error("Error Dashboard Data:", error);
    }
  };

<<<<<<< Updated upstream
  const loadMasterData = async () => {
    setIsMasterLoading(true);
    setMasterData([]);
    try {
      const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === 'Success' || result.status === 'success') {
        setMasterData(result.data || []);
      }
    } catch (error) {
      console.error('Error Master Data:', error);
    } finally {
      setIsMasterLoading(false);
    }
  };

  // Fungsi CRUD Data Master - Diberi pengecekan role untuk keamanan ekstra
  const submitAddData = async (e) => {
    e.preventDefault();
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk menambah data.');
      return;
    }
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
      const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      const result = await response.json();
      if (result.status === 'Success' || result.status === 'success') {
        alert(result.message || 'Data berhasil disimpan!');
        setIsModalOpen(false);
        setInputData({});
        loadMasterData();
        getDashboardData();
      }
      else {
        alert('Gagal: ' + (result.message || 'Data gagal disimpan'));
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const submitUpdateData = async (e) => {
    e.preventDefault();
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk mengedit data.');
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
      const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}/${editId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      const result = await response.json();
      if (result.status === 'Success' || result.status === 'success') {
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

  const handleDeleteData = async (id) => {
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk menghapus data.');
      return;
    }
    const confirmed = confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirmed) return;
    try {
      const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === 'Success' || result.status === 'success') {
        alert(result.message || 'Data berhasil dihapus');
        loadMasterData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Submit Form Transaksi (hanya untuk petugas)
=======
  // USEEFFECT EFFECTS
  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // ✅ Tambah empty dependency array

>>>>>>> Stashed changes
  const handleTransaksiSubmit = (e) => {
    e.preventDefault();
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk menambah transaksi.');
      return;
    }
    const newData = {
      supir: formTransaksi.supir,
      plat: formTransaksi.plat,
      berat: parseFloat(formTransaksi.berat || 0),
      status: formTransaksi.status
    };
    setTransaksiList([...transaksiList, newData]);
    alert('Data Distribusi Berhasil Ditambahkan!');
    setFormTransaksi({ supir: '', plat: '', berat: '', status: 'menunggu_memuat' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // DATA CHART
  const barChartData = laporanData.map((item) => ({
    tanggal: formatDate(item.tanggal),
    berat: parseFloat(item.berat_tbs)
  }));

  const pieChartData = (() => {
    const kebunMap = {};
    laporanData.forEach((item) => {
      const kebun = item.kebun || 'Tidak Diketahui';
      kebunMap[kebun] = (kebunMap[kebun] || 0) + parseFloat(item.berat_tbs);
    });
    return Object.keys(kebunMap).map(key => ({ name: key, value: kebunMap[key] }));
  })();

  const statusChartData = (() => {
    const statusMap = {};
    laporanData.forEach((item) => {
      const status = item.status || 'tidak_diketahui';
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    return Object.keys(statusMap).map(key => ({ name: key.replaceAll('_', ' '), value: statusMap[key] }));
  })();

  const COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444'];

  const renderContent = () => {
    const isManajer = userRole === 'manajer';

    switch (activePage) {
      case 'dashboard':
        return (
          <div className={styles.pageContent}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Monitoring Sawit</h1>
              <p className="text-sm text-gray-500">Gambaran umum dan visualisasi real-time distribusi sawit.</p>
            </div>

<<<<<<< Updated upstream
            {/* BARIS 1 - 4 card utama */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                <div><p className="text-sm text-gray-400 font-medium">Total Berat</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalBerat} Kg</h3><p className="text-xs text-green-500 mt-1">Total distribusi bulan ini</p></div>
                <div className="p-3 bg-green-50 rounded-xl text-green-600 font-bold text-2xl animate-bounce">⚖️</div>
=======
            {/* 4 CARD UTAMA */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Total Berat</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalBerat} Kg</h3>
                  <p className="text-xs text-green-500 mt-1">Total distribusi bulan ini</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-green-600 font-bold text-xl">📦</div>
>>>>>>> Stashed changes
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
<<<<<<< Updated upstream
                <div><p className="text-sm text-gray-400 font-medium">Pengiriman</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalPengiriman}</h3><p className="text-xs text-blue-500 mt-1">Total pengiriman aktif</p></div>
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 font-bold text-2xl animate-pulse">🚛</div>
=======
                <div>
                  <p className="text-sm text-gray-400 font-medium">Pengiriman</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalPengiriman}</h3>
                  <p className="text-xs text-blue-500 mt-1">Total pengiriman aktif</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 font-bold text-xl">🚛</div>
>>>>>>> Stashed changes
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
<<<<<<< Updated upstream
                <div><p className="text-sm text-gray-400 font-medium">Supir Aktif</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalSupir}</h3><p className="text-xs text-orange-500 mt-1">Supir sedang bertugas</p></div>
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600 font-bold text-2xl animate-pulse">👨‍✈️</div>
=======
                <div>
                  <p className="text-sm text-gray-400 font-medium">Supir Aktif</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">12</h3>
                  <p className="text-xs text-orange-500 mt-1">Supir sedang bertugas</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600 font-bold text-xl">👨‍✈️</div>
>>>>>>> Stashed changes
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
<<<<<<< Updated upstream
                <div><p className="text-sm text-gray-400 font-medium">Truk Operasional</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalTruk} Truk</h3><p className="text-xs text-purple-500 mt-1">Armada siap digunakan</p></div>
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600 font-bold text-2xl animate-bounce">🚚</div>
              </div>
            </div>

            {/* BARIS 2 - Kebun & Pabrik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                <div><p className="text-sm text-gray-400 font-medium">Kebun Terdaftar</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalKebun}</h3><p className="text-xs text-yellow-500 mt-1">Total kebun aktif</p></div>
                <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 font-bold text-2xl animate-spin" style={{ animationDuration: '3s' }}>🌿</div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
                <div><p className="text-sm text-gray-400 font-medium">Pabrik Terdaftar</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalPabrik}</h3><p className="text-xs text-red-500 mt-1">Total pabrik aktif</p></div>
                <div className="p-3 bg-red-50 rounded-xl text-red-600 font-bold text-2xl animate-pulse">🏭</div>
=======
                <div>
                  <p className="text-sm text-gray-400 font-medium">Truk Operasional</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">8 Truk</h3>
                  <p className="text-xs text-purple-500 mt-1">Armada siap digunakan</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl text-purple-600 font-bold text-xl">🚚</div>
>>>>>>> Stashed changes
              </div>
            </div>

            {/* Grafik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
<<<<<<< Updated upstream
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"><h3 className="text-md font-bold text-gray-700 mb-4">Tren Berat Pengiriman</h3><div style={{ height: 250 }}><ResponsiveContainer><LineChart data={barChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tanggal" /><YAxis /><Tooltip /><Line type="monotone" dataKey="berat" stroke="#10b981" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"><h3 className="text-md font-bold text-gray-700 mb-4">Volume Pengiriman Harian</h3><div style={{ height: 250 }}><ResponsiveContainer><BarChart data={barChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="tanggal" /><YAxis /><Tooltip /><Bar dataKey="berat" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
=======
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold text-gray-700 mb-4">Tren Berat Pengiriman</h3>
                <div style={{ height: 250 }}>
                  <ResponsiveContainer>
                    <LineChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tanggal" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="berat" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-md font-bold text-gray-700 mb-4">Volume Pengiriman Harian</h3>
                <div style={{ height: 250 }}>
                  <ResponsiveContainer>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tanggal" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="berat" fill="#10b981" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
>>>>>>> Stashed changes
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<<<<<<< Updated upstream
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-700 mb-4">Kontribusi Kebun</h3><div style={{ height: 300 }}><ResponsiveContainer><PieChart><Pie data={pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]} cx="50%" cy="45%" innerRadius={70} outerRadius={110} dataKey="value" label>{(pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-700 mb-4">Status Pengiriman</h3><div style={{ height: 300 }}><ResponsiveContainer><PieChart><Pie data={statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]} cx="50%" cy="45%" innerRadius={70} outerRadius={110} dataKey="value" label>{(statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {statusChartData.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100 hover:shadow-sm transition">
                      <div className="text-xl font-bold text-gray-800">{item.value}</div>
                      <div className="text-xs text-gray-500 capitalize mt-1 leading-tight">{item.name}</div>
=======
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">Kontribusi Kebun</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie 
                        data={pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]} 
                        cx="50%" cy="45%" innerRadius={70} outerRadius={110} dataKey="value" label
                      >
                        {(pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">Status Pengiriman</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie 
                        data={statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]} 
                        cx="50%" cy="45%" innerRadius={70} outerRadius={110} dataKey="value" label
                      >
                        {(statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                          <Cell key={`status-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {statusChartData.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                      <div className="text-lg font-bold text-gray-800">{item.value}</div>
                      <div className="text-xs text-gray-500 capitalize">{item.name}</div>
>>>>>>> Stashed changes
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'master':
<<<<<<< Updated upstream
        return (
          <div className={styles.pageContent}>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Master</h1>
            <div className="flex gap-2 my-4 bg-gray-100 p-1.5 rounded-xl w-max">
              {['supir', 'truk', 'kebun', 'pabrik'].map((type) => (
                <button key={type} onClick={() => setActiveMasterType(type)} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize ${activeMasterType === type ? 'bg-white text-green-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>Data {type}</button>
              ))}
            </div>

            {!isManajer && (
              <div className="mb-4">
                <button onClick={() => { setIsEditMode(false); setEditId(null); setInputData({}); setIsModalOpen(true); }} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2"><i className="fas fa-plus text-xs"></i> Tambah {getMasterTitle()}</button>
              </div>
            )}
            {isMasterLoading ? (<div className="p-12 text-center text-gray-500 font-medium"><i className="fas fa-spinner animate-spin text-green-700 text-2xl mb-2 block"></i><p>Memuat data master...</p></div>) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs uppercase tracking-wider font-semibold"><th className="py-4 px-6">ID</th>
                    {activeMasterType === 'supir' && <><th>Nama Supir</th><th>No. HP</th></>}
                    {activeMasterType === 'truk' && <><th>No. Polisi</th><th>Merk</th><th>Kapasitas</th></>}
                    {activeMasterType === 'kebun' && <><th>Nama Kebun</th><th>Lokasi</th></>}
                    {activeMasterType === 'pabrik' && <><th>Nama Pabrik</th><th>Lokasi</th></>}
                    <th>Dibuat</th>
                    {!isManajer && <th>Aksi</th>}
                  </tr></thead>
                  <tbody className="text-gray-700 text-sm divide-y divide-gray-50">
                    {masterData.length === 0 ? (<tr><td colSpan={!isManajer ? 6 : 5} className="py-8 text-center text-gray-400 font-medium">Tidak ada data terdaftar dalam sistem.</td></tr>) : (
                      masterData.map((item, idx) => {
                        const idKey = `id${activeMasterType}`;
                        return (<tr key={idx} className="hover:bg-gray-50/50 transition"><td className="py-4 px-6 font-medium">{item[idKey]}</td>
                          {activeMasterType === 'supir' && <><td className="py-4 px-6 font-semibold text-gray-900">{item.nama_supir}</td><td className="py-4 px-6 text-gray-500">{item.no_hp}</td></>}
                          {activeMasterType === 'truk' && <><td className="py-4 px-6 font-semibold text-gray-900">{item.no_polisi}</td><td className="py-4 px-6 text-gray-500">{item.merk}</td><td className="py-4 px-6 font-medium text-green-700">{item.kapasitas_ton} ton</td></>}
                          {activeMasterType === 'kebun' && <><td className="py-4 px-6 font-semibold text-gray-900">{item.nama_kebun}</td><td className="py-4 px-6 text-gray-500">{item.lokasi}</td></>}
                          {activeMasterType === 'pabrik' && <><td className="py-4 px-6 font-semibold text-gray-900">{item.nama_pabrik}</td><td className="py-4 px-6 text-gray-500">{item.lokasi}</td></>}
                          <td className="py-4 px-6 text-gray-400">{formatDate(item.created_at)}</td>
                          {!isManajer && (<td className="py-4 px-6 whitespace-nowrap"><button onClick={() => { setEditId(item[idKey]); setInputData(item); setIsEditMode(true); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 mr-3"><i className="fas fa-edit text-xs"></i> Edit</button><button onClick={() => handleDeleteData(item[idKey])} className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"><i className="fas fa-trash text-xs"></i> Hapus</button></td>)}
                        </tr>);
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
=======
        return <MasterData />;
>>>>>>> Stashed changes

      case 'transaksi':
        return (
          <div className={styles.pageContent}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Transaksi Distribusi</h1>
              <p className="text-gray-500 text-sm mt-1">Pencatatan manifes baru dan pemantauan real-time.</p>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <div className="w-full">
                <TabelDistribusi transaksiList={transaksiList} setTransaksiList={setTransaksiList} />
              </div>
              {!isManajer && (
                <div className="w-full">
                  <FormManifest 
                    formTransaksi={formTransaksi} 
                    setFormTransaksi={setFormTransaksi} 
                    handleTransaksiSubmit={handleTransaksiSubmit} 
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'laporan':
        return (
          <div className={styles.pageContent}>
            <FilterLaporan 
              tanggalMulai={tanggalMulai}
              setTanggalMulai={setTanggalMulai}
              tanggalSelesai={tanggalSelesai}
              setTanggalSelesai={setTanggalSelesai}
              onFilter={getDashboardData}
            />

            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Laporan Pengiriman Ringkasan</h1>
                <p className="text-sm text-gray-500 mt-1">Histori laporan pengiriman terintegrasi.</p>
              </div>
              <CetakLaporan />
            </div>

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
                      <td colSpan="4" className="py-6 text-center text-gray-400">
                        Tidak ada data laporan pada rentang tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    laporanData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6 font-medium text-gray-900">#LAP-{1000 + idx}</td>
                        <td className="py-4 px-6">{formatDate(item.tanggal)}</td>
                        <td className="py-4 px-6 font-semibold text-green-700">{item.berat_tbs} Kg</td>
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
          </div>
        );

      default:
        return <div>Halaman tidak ditemukan.</div>;
    }
  };

  return (
    <div className={styles['app-container']}>
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles['sidebar-header']}>
          <h3>Distribusi App</h3>
        </div>
        <nav className={styles['sidebar-nav']}>
          <button 
            className={`${styles['nav-item']} ${activePage === 'dashboard' ? styles.active : ''}`} 
            onClick={() => setActivePage('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </button>
          <button 
            className={`${styles['nav-item']} ${activePage === 'master' ? styles.active : ''}`} 
            onClick={() => setActivePage('master')}
          >
            <i className="fas fa-database"></i>
            <span>Data Master</span>
          </button>
          <button 
            className={`${styles['nav-item']} ${activePage === 'transaksi' ? styles.active : ''}`} 
            onClick={() => setActivePage('transaksi')}
          >
            <i className="fas fa-exchange-alt"></i>
            <span>Transaksi</span>
          </button>
          <button 
            className={`${styles['nav-item']} ${activePage === 'laporan' ? styles.active : ''}`} 
            onClick={() => setActivePage('laporan')}
          >
            <i className="fas fa-file-alt"></i>
            <span>Laporan</span>
          </button>
        </nav>
        <div className={styles['sidebar-footer']}>
          <button 
            className={styles['btn-logout']} 
            onClick={() => window.location.href = '/login'}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={styles['main-content']}>
        <nav className={styles.navbar}>
          <div className={styles['navbar-toggle']}>
            <i className="fas fa-bars"></i>
          </div>
          <div className={styles['navbar-user']}>
            <span>Aurora</span>
            <span className={styles['user-role']}>
              {userRole === 'petugas' ? 'Petugas Lapangan' : 'Manajer Perusahaan'}
            </span>
          </div>
        </nav>
        <div className={styles['content-wrapper']}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;