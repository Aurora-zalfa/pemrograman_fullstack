import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import styles from './Dashboard.module.css';

// IMPOR KOMPONEN LAIN
import MasterData from '../Master/MasterData';
import FilterLaporan from '../Laporan/FilterLaporan';
import FormManifest from '../Transaksi/formManifest';
import TabelDistribusi from '../Transaksi/TabelDistribusi';
import KotakArsip from '../Transaksi/KotakArsip';

// IMPOR CHART LIBRARY
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// IMPOR ICON
import {
  FaWeightHanging, FaTruck, FaUsers, FaTrailer, FaTree, FaIndustry,
  FaChartLine, FaLeaf, FaPrint, FaSignOutAlt, FaTachometerAlt,
  FaDatabase, FaExchangeAlt, FaFileAlt, FaBars
} from 'react-icons/fa';

const Dashboard = () => {
  const location = useLocation();
  const [userRole] = useState(localStorage.getItem('user_role') || 'manajer');
  const token = localStorage.getItem('token') || '';

  // STATE untuk filter tanggal - baca dari localStorage (dari halaman Laporan)
  const [filterStartDate, setFilterStartDate] = useState(() => {
    const saved = localStorage.getItem('dashboard_start_date');
    if (saved) return saved;
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  });

  const [filterEndDate, setFilterEndDate] = useState(() => {
    const saved = localStorage.getItem('dashboard_end_date');
    if (saved) return saved;
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
  });

  const [stats, setStats] = useState({
    totalBerat: 0, totalPengiriman: 0, totalSupir: 0,
    totalTruk: 0, totalKebun: 0, totalPabrik: 0
  });

  const [laporanData, setLaporanData] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);
  const [formTransaksi, setFormTransaksi] = useState({
    supir: '', plat: '', berat: '', status: 'menunggu_memuat'
  });

  // FETCH DATA DASHBOARD berdasarkan filter tanggal
  const fetchDashboardData = async () => {
    console.log("🔄 Fetching dashboard data for period:", filterStartDate, "s/d", filterEndDate);
    try {
      const laporanRes = await fetch(
        `http://localhost:3000/api/laporan?tanggal_mulai=${filterStartDate}&tanggal_selesai=${filterEndDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const laporanResult = await laporanRes.json();
      const data = laporanResult.data || [];
      setLaporanData(data);

      let totalBerat = 0;
      data.forEach(item => {
        totalBerat += parseFloat(item.berat_tbs || 0);
      });
      
      console.log("📊 Total berat periode ini:", totalBerat);
      console.log("📦 Jumlah pengiriman:", data.length);

      // Fetch master data
      const [supirRes, trukRes, kebunRes, pabrikRes] = await Promise.all([
        fetch('http://localhost:3000/api/master/supir', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3000/api/master/truk', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3000/api/master/kebun', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3000/api/master/pabrik', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const supirResult = await supirRes.json();
      const trukResult = await trukRes.json();
      const kebunResult = await kebunRes.json();
      const pabrikResult = await pabrikRes.json();

      setStats({
        totalBerat: totalBerat,
        totalPengiriman: data.length,
        totalSupir: (supirResult.data || []).length,
        totalTruk: (trukResult.data || []).length,
        totalKebun: (kebunResult.data || []).length,
        totalPabrik: (pabrikResult.data || []).length,
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchTransaksi = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/transaksi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === 'success') {
        setTransaksiList(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching transaksi:", error);
    }
  };

  // USE EFFECTS
  useEffect(() => {
    fetchDashboardData();
    fetchTransaksi();
  }, []);

  // Refresh saat filter tanggal berubah
  useEffect(() => {
    if (filterStartDate && filterEndDate) {
      fetchDashboardData();
    }
  }, [filterStartDate, filterEndDate]);

  // Refresh saat pindah ke dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      const savedStart = localStorage.getItem('dashboard_start_date');
      const savedEnd = localStorage.getItem('dashboard_end_date');
      if (savedStart && savedEnd && (savedStart !== filterStartDate || savedEnd !== filterEndDate)) {
        setFilterStartDate(savedStart);
        setFilterEndDate(savedEnd);
      } else {
        fetchDashboardData();
        fetchTransaksi();
      }
    }
  }, [location.pathname]);

  // Dengarkan perubahan dari halaman Laporan
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dashboard_start_date') {
        const newStart = e.newValue;
        if (newStart && newStart !== filterStartDate) {
          setFilterStartDate(newStart);
        }
      }
      if (e.key === 'dashboard_end_date') {
        const newEnd = e.newValue;
        if (newEnd && newEnd !== filterEndDate) {
          setFilterEndDate(newEnd);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [filterStartDate, filterEndDate]);

  const handleTransaksiSubmit = async (e) => {
    e.preventDefault();
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk menambah transaksi.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/transaksi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supir: formTransaksi.supir,
          plat: formTransaksi.plat,
          berat_tbs: parseFloat(formTransaksi.berat),
          status: formTransaksi.status
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        alert('Data Distribusi Berhasil Ditambahkan!');
        setFormTransaksi({ supir: '', plat: '', berat: '', status: 'menunggu_memuat' });
        fetchTransaksi();
        fetchDashboardData();
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Data untuk chart
  const barChartData = laporanData.map((item) => ({
    tanggal: formatDate(item.tanggal),
    berat: parseFloat(item.berat_tbs || 0)
  }));

  const pieChartData = (() => {
    const kebunMap = {};
    laporanData.forEach((item) => {
      const kebun = item.kebun || 'Tidak Diketahui';
      kebunMap[kebun] = (kebunMap[kebun] || 0) + parseFloat(item.berat_tbs || 0);
    });
    return Object.keys(kebunMap).map(key => ({ name: key, value: kebunMap[key] }));
  })();

  const statusChartData = (() => {
    const statusMap = {};
    laporanData.forEach((item) => {
      const status = item.status || 'selesai';
      let displayStatus = status === 'selesai' ? 'Selesai' : 'Dalam Proses';
      statusMap[displayStatus] = (statusMap[displayStatus] || 0) + 1;
    });
    return Object.keys(statusMap).map(key => ({ name: key, value: statusMap[key] }));
  })();

  return (
    <div className={styles['app-container']} style={{ backgroundColor: '#F8FAFC' }}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles['sidebar-header']}>
          <h3>Distribusi App</h3>
        </div>
        <nav className={styles['sidebar-nav']}>
          <Link to="/dashboard" className={`${styles['nav-item']} ${location.pathname === '/dashboard' ? styles.active : ''}`}>
            <FaTachometerAlt /><span>Dashboard</span>
          </Link>
          <Link to="/dashboard/master" className={`${styles['nav-item']} ${location.pathname.includes('/master') ? styles.active : ''}`}>
            <FaDatabase /><span>Data Master</span>
          </Link>
          <Link to="/dashboard/transaksi" className={`${styles['nav-item']} ${location.pathname.includes('/transaksi') ? styles.active : ''}`}>
            <FaExchangeAlt /><span>Transaksi</span>
          </Link>
          <Link to="/dashboard/laporan" className={`${styles['nav-item']} ${location.pathname.includes('/laporan') ? styles.active : ''}`}>
            <FaFileAlt /><span>Laporan</span>
          </Link>
          {userRole === 'manajer' && (
            <Link to="/dashboard/arsip" className={`${styles['nav-item']} ${location.pathname.includes('/arsip') ? styles.active : ''}`}>
              <FaDatabase /><span>Kotak Arsip</span>
            </Link>
          )}
        </nav>
        <div className={styles['sidebar-footer']}>
          <button className={styles['btn-logout']} onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}>
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles['main-content']}>
        <nav className={styles.navbar} style={{ backgroundColor: '#F8FAFC' }}>
          <div className={styles['navbar-toggle']}>
            <FaBars />
          </div>
          <div className={styles['navbar-user']}>
            <span className="font-bold text-gray-800">Aurora</span>
            <span className={styles['user-role']} style={{ backgroundColor: '#2563eb' }}>
              {userRole === 'petugas' ? 'Petugas Lapangan' : 'Manajer Perusahaan'}
            </span>
          </div>
        </nav>

        <div className={styles['content-wrapper']} style={{ padding: 0 }}>
          <Routes>
            {/* DASHBOARD MAIN */}
            <Route index element={
              <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                      <FaLeaf className="text-green-500 text-3xl" />
                      Dashboard Monitoring Sawit
                    </h1>
                    <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
                      <FaChartLine className="text-gray-400" />
                      Menampilkan data: {formatDisplayDate(filterStartDate)} - {formatDisplayDate(filterEndDate)}
                    </p>
                  </div>
                </div>

                {/* 6 KARTU STATISTIK */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FaWeightHanging className="text-blue-600 text-xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">Periode</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalBerat.toLocaleString()}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Total Berat (Kg)</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FaTruck className="text-blue-600 text-xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">Periode</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalPengiriman}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Total pengiriman</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FaUsers className="text-blue-600 text-xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">Terdaftar</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalSupir}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Supir terdaftar</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FaTrailer className="text-blue-600 text-xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">Armada</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalTruk}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Unit truk aktif</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FaTree className="text-blue-600 text-xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">Terdaftar</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalKebun}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Kebun terdaftar</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FaIndustry className="text-blue-600 text-xl" />
                      </div>
                      <span className="text-xs font-medium text-gray-400">Terdaftar</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalPabrik}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1">Pabrik terdaftar</p>
                  </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Tren Berat Pengiriman</h3>
                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                          <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                          <Tooltip formatter={(value) => [`${value} Kg`, 'Berat']} />
                          <Line type="monotone" dataKey="berat" stroke="#2563eb" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Volume Pengiriman Harian</h3>
                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                          <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                          <Tooltip formatter={(value) => [`${value} Kg`, 'Volume']} />
                          <Bar dataKey="berat" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* PIE CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Kontribusi per Kebun</h3>
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]}
                            cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value"
                            label={({ name, percent }) => pieChartData.length ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                            labelLine={false} stroke="none"
                          >
                            {(pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#2563eb', '#38bdf8', '#e2e8f0', '#f59e0b', '#10b981'][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value.toLocaleString()} Kg`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Status Pengiriman</h3>
                    <div style={{ height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]}
                            cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value"
                            label={({ name, percent }) => statusChartData.length ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                            labelLine={false} stroke="none"
                          >
                            {(statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                              <Cell key={`status-cell-${index}`} fill={['#10b981', '#f59e0b'][index % 2]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} pengiriman`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-50">
                      {statusChartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.name === 'Selesai' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          <span className="text-sm font-medium text-gray-500">{item.name}: <strong className="text-gray-800">{item.value}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {laporanData.length === 0 && (
                  <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-gray-500 font-medium text-sm">⚠️ Belum ada data pengiriman pada periode {formatDisplayDate(filterStartDate)} - {formatDisplayDate(filterEndDate)}.</p>
                  </div>
                )}
              </div>
            } />

            {/* ROUTE MASTER */}
            <Route path="master" element={
              <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F8FAFC' }}>
                <MasterData />
              </div>
            } />

            {/* ROUTE TRANSAKSI */}
            <Route path="transaksi" element={
              <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F8FAFC' }}>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">Transaksi Distribusi</h1>
                  <p className="text-gray-500 text-sm mt-1 font-medium">Pencatatan manifes baru dan pemantauan real-time.</p>
                </div>
                <div className="flex flex-col gap-6 w-full">
                  <div className="w-full">
                    <TabelDistribusi transaksiList={transaksiList} setTransaksiList={setTransaksiList} />
                  </div>
                  {userRole !== 'manajer' && (
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
            } />

            {/* ROUTE LAPORAN - DIPERBAIKI */}
            <Route path="laporan" element={
              <div className={`${styles['master-container']} w-full min-h-screen p-6 rounded-tl-[20px]`} style={{ backgroundColor: '#F8FAFC' }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Pengiriman</h1>
                
                <FilterLaporan onFilter={(mulai, selesai) => {
                  const fetchFilteredData = async () => {
                    try {
                      console.log("📅 Filter API:", `tanggal_mulai=${mulai}&tanggal_selesai=${selesai}`);
                      
                      const response = await fetch(
                        `http://localhost:3000/api/laporan?tanggal_mulai=${mulai}&tanggal_selesai=${selesai}`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                      );
                      const result = await response.json();
                      
                      console.log("📊 Data dari API:", result);
                      
                      // AMBIL DATA DARI API
                      const data = result.data || [];
                      
                      // UPDATE laporanData UNTUK DITAMPILKAN DI TABEL
                      setLaporanData(data);
                      
                      // UPDATE stats
                      let totalBerat = 0;
                      data.forEach(item => {
                        totalBerat += parseFloat(item.berat_tbs || 0);
                      });
                      setStats(prev => ({
                        ...prev,
                        totalBerat: totalBerat,
                        totalPengiriman: data.length
                      }));

                      // SIMPAN KE LOCALSTORAGE UNTUK DASHBOARD
                      if (mulai && selesai) {
                        localStorage.setItem('dashboard_start_date', mulai);
                        localStorage.setItem('dashboard_end_date', selesai);
                        window.dispatchEvent(new Event('storage'));
                      }
                    } catch (error) {
                      console.error("Error filtering laporan:", error);
                    }
                  };
                  fetchFilteredData();
                }} />
                
                {/* TABEL LAPORAN */}
                <div className="bg-white rounded-2xl p-5 shadow-sm overflow-x-auto">
                  <table className={styles['data-table']}>
                    <thead>
                      <tr>
                        <th className="text-gray-500">No Laporan</th>
                        <th className="text-gray-500">Tanggal Pengiriman</th>
                        <th className="text-gray-500">Berat Muatan</th>
                        <th className="text-gray-500">Keterangan Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporanData.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }} className="text-gray-500">
                            Tidak ada data laporan untuk periode yang dipilih.
                          </td>
                        </tr>
                      ) : (
                        laporanData.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-gray-800 font-medium">#LAP-{1000 + idx}</td>
                            <td className="text-gray-800 font-medium">
                              {new Date(item.tanggal).toLocaleDateString('id-ID')}
                            </td>
                            <td className="text-gray-800">
                              <strong>{parseFloat(item.berat_tbs).toLocaleString()} Kg</strong>
                            </td>
                            <td>
                              <span style={{ 
                                background: '#d1fae5', 
                                color: '#059669', 
                                padding: '4px 12px', 
                                borderRadius: '20px', 
                                fontSize: '12px', 
                                fontWeight: '700' 
                              }}>
                                {item.status === 'selesai' ? 'Selesai' : 'Dalam Proses'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            } />

            {/* ROUTE ARSIP */}
            {userRole === 'manajer' && (
              <Route path="arsip" element={
                <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F8FAFC' }}>
                  <KotakArsip />
                </div>
              } />
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;