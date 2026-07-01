import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import styles from './Dashboard.module.css';

// IMPOR KOMPONEN LAIN
import MasterData from '../Master/MasterData';
import FilterLaporan from '../Laporan/FilterLaporan';
import CetakLaporan from '../Laporan/CetakLaporan';
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

  // ✅ AMBIL USERNAME DARI LOCALSTORAGE, FALLBACK 'Aurora'
  const username = localStorage.getItem('username') || 'Aurora';

  // STATE untuk filter tanggal - baca dari localStorage
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
  supir: '', 
  plat: '', 
  berat: '', 
  status: 'menunggu_memuat',
  tanggal_kirim: '' // ← KOSONGKAN
});

  // 🎨 Color Palette - NYAWIT HUNTER THEME
  const PIE_COLORS = [
    '#012A0D',  // Dark Green
    '#10b981',  // Emerald Green  
    '#34d399',  // Light Green
    '#F1AD00',  // Gold
    '#fbbf24',  // Amber
    '#f59e0b',  // Orange
    '#d97706',  // Brown-Orange
    '#84cc16',  // Lime
  ];

  // FETCH DATA DASHBOARD
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

  // ✅ FIX: FETCH TRANSAKSI - PAKAI /api/distribusi
  const fetchTransaksi = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/distribusi', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
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

  useEffect(() => {
    if (filterStartDate && filterEndDate) {
      fetchDashboardData();
    }
  }, [filterStartDate, filterEndDate]);

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

  // ✅ FIX: DELETE - PAKAI /api/distribusi
  const handleDeleteTransaksi = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data transaksi ini?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3000/api/distribusi/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Transaksi berhasil dihapus!");
          fetchTransaksi();
        } else {
          alert("Gagal menghapus transaksi.");
        }
      } catch (error) {
        console.error("Error deleting transaksi:", error);
        alert("Terjadi kesalahan sistem saat menghapus.");
      }
    }
  };

  // ✅ FIX: CREATE - PAKAI /api/distribusi + tambah tanggal_kirim
  const handleTransaksiSubmit = async (e) => {
    e.preventDefault();
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk menambah transaksi.');
      return;
    }

    // Validasi tanggal
    if (!formTransaksi.tanggal_kirim) {
      alert('Tanggal pengiriman wajib diisi!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/distribusi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tanggal_kirim: formTransaksi.tanggal_kirim, // ← TAMBAHKAN
          nama_supir: formTransaksi.supir,
          no_polisi: formTransaksi.plat,
          berat_tbs: parseFloat(formTransaksi.berat),
          status: formTransaksi.status
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Data Distribusi Berhasil Ditambahkan!');
        // Reset form dengan tanggal hari ini
      setFormTransaksi({ 
        supir: '', 
        plat: '', 
        berat: '', 
        status: 'menunggu_memuat',
        tanggal_kirim: '' // ← KOSONGKAN
      });
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

  const bulanSekarang = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className={styles['app-container']} style={{ backgroundColor: '#F4F7FE' }}>
      {/* SIDEBAR NAVIGATION */}
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles['sidebar-header']}>
          <h3 style={{ color: '#ffffff' }}>
            <FaLeaf style={{ color: '#F1AD00' }} className="inline mr-2" />
            <span style={{ color: '#ffffff' }}>Distribusi</span> <span style={{ color: '#ffffff' }}>App</span>
          </h3>
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
          <button 
            className={styles['btn-logout']}
            style={{
              background: '#dc2626',
              color: 'white',
              border: 'none'
            }}
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
          >
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles['main-content']}>
        <nav className={styles.navbar} style={{ backgroundColor: '#F4F7FE' }}>
          <div className={styles['navbar-toggle']}>
            <FaBars style={{ color: '#012A0D' }} />
          </div>
          <div className={styles['navbar-user']}>
            {/* ✅ GANTI "Aurora" DENGAN USERNAME DARI LOCALSTORAGE */}
            <span className="font-bold" style={{ color: '#012A0D' }}>{username}</span>
            <span className={styles['user-role']} style={{ background: '#F1AD00', color: '#012A0D' }}>
              {userRole === 'petugas' ? 'Petugas Lapangan' : 'Manajer Perusahaan'}
            </span>
          </div>
        </nav>

        <div className={styles['content-wrapper']} style={{ padding: 0 }}>
          <Routes>
            {/* DASHBOARD MAIN */}
            <Route index element={
              <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F4F7FE' }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: '#012A0D' }}>
                    <FaLeaf style={{ color: '#F1AD00' }} className="text-3xl" />
                    Dashboard Monitoring Sawit
                  </h1>
                  <p className="text-sm font-medium mt-2 flex items-center gap-2" style={{ color: '#023d15' }}>
                    <FaChartLine style={{ color: '#6b7280' }} />
                    Volume Sawit - Periode: {bulanSekarang}
                  </p>
                </div>

                {/* 6 KARTU STATISTIK */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                        <FaWeightHanging style={{ color: '#F1AD00' }} className="text-xl" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Bulan ini</span>
                    </div>
                    <p className="text-2xl font-bold mt-3" style={{ color: '#012A0D' }}>{stats.totalBerat.toLocaleString()}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: '#023d15' }}>Total Berat (Kg)</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                        <FaTruck style={{ color: '#F1AD00' }} className="text-xl" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Pengiriman</span>
                    </div>
                    <p className="text-2xl font-bold mt-3" style={{ color: '#012A0D' }}>{stats.totalPengiriman}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: '#023d15' }}>Total pengiriman</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                        <FaUsers style={{ color: '#F1AD00' }} className="text-xl" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Supir</span>
                    </div>
                    <p className="text-2xl font-bold mt-3" style={{ color: '#012A0D' }}>{stats.totalSupir}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: '#023d15' }}>Supir terdaftar</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                        <FaTrailer style={{ color: '#F1AD00' }} className="text-xl" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Armada</span>
                    </div>
                    <p className="text-2xl font-bold mt-3" style={{ color: '#012A0D' }}>{stats.totalTruk}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: '#023d15' }}>Unit truk aktif</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                        <FaTree style={{ color: '#F1AD00' }} className="text-xl" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Kebun</span>
                    </div>
                    <p className="text-2xl font-bold mt-3" style={{ color: '#012A0D' }}>{stats.totalKebun}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: '#023d15' }}>Kebun terdaftar</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                        <FaIndustry style={{ color: '#F1AD00' }} className="text-xl" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Pabrik</span>
                    </div>
                    <p className="text-2xl font-bold mt-3" style={{ color: '#012A0D' }}>{stats.totalPabrik}</p>
                    <p className="text-sm font-medium mt-1" style={{ color: '#023d15' }}>Pabrik terdaftar</p>
                  </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#012A0D' }}>
                      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#F1AD00' }}></div>
                      Tren Berat Pengiriman
                    </h3>
                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" vertical={false} />
                          <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                          <Tooltip formatter={(value) => [`${value} Kg`, 'Berat']} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px rgba(1,42,13,0.15)' }} />
                          <Line type="monotone" dataKey="berat" stroke="#012A0D" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, fill: '#F1AD00' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#012A0D' }}>
                      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#F1AD00' }}></div>
                      Volume Pengiriman Harian
                    </h3>
                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" vertical={false} />
                          <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                          <Tooltip formatter={(value) => [`${value} Kg`, 'Volume']} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px rgba(1,42,13,0.15)' }} />
                          <Bar dataKey="berat" fill="#F1AD00" radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* PIE CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#012A0D' }}>
                      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#F1AD00' }}></div>
                      Kontribusi per Kebun
                    </h3>
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
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value.toLocaleString()} Kg`} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px rgba(1,42,13,0.15)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border-2" style={{ borderColor: '#012A0D' }}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#012A0D' }}>
                      <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#F1AD00' }}></div>
                      Status Pengiriman
                    </h3>
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
                              <Cell key={`status-cell-${index}`} fill={['#10b981', '#F1AD00'][index % 2]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} pengiriman`} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px rgba(1,42,13,0.15)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                      {statusChartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.name === 'Selesai' ? '#10b981' : '#F1AD00' }}></div>
                          <span className="text-sm font-medium" style={{ color: '#023d15' }}>{item.name}: <strong style={{ color: '#012A0D' }}>{item.value}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {laporanData.length === 0 && (
                  <div className="mt-4 bg-white border-2 rounded-2xl p-6 text-center shadow-sm" style={{ borderColor: '#012A0D' }}>
                    <p className="text-sm font-medium" style={{ color: '#023d15' }}>⚠️ Belum ada data pengiriman pada periode ini.</p>
                  </div>
                )}
              </div>
            } />

            {/* ROUTE MASTER */}
            <Route path="master" element={
              <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F4F7FE' }}>
                <MasterData />
              </div>
            } />

<Route path="transaksi" element={
  <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F4F7FE' }}>
    <div className="mb-6">
      <h1 className="text-3xl font-bold" style={{ color: '#012A0D' }}>Transaksi Distribusi</h1>
      <p className="text-sm mt-1 font-medium" style={{ color: '#023d15' }}>Pencatatan manifes baru dan pemantauan real-time.</p>
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
            // handleTransaksiSubmit={handleTransaksiSubmit}  // ← HAPUS BARIS INI!
          />
        </div>
      )}
    </div>
  </div>
} />

            {/* ROUTE LAPORAN - TANPA ICON DI STATUS */}
            <Route path="laporan" element={
              <div className={`${styles['master-container']} w-full min-h-screen p-6 rounded-tl-[20px]`} style={{ backgroundColor: '#F4F7FE' }}>
                <h1 className="text-3xl font-bold mb-6" style={{ color: '#012A0D' }}>
                  📋 Laporan Pengiriman
                </h1>

                <FilterLaporan onFilter={(mulai, selesai) => {
                  const fetchFilteredData = async () => {
                    try {
                      console.log("📅 Filter API:", `tanggal_mulai=${mulai}&tanggal_selesai=${selesai}`);

                      const response = await fetch(
                        `http://localhost:3000/api/laporan?tanggal_mulai=${mulai}&tanggal_selesai=${selesai}`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                      );
                      const result = await response.json();

                      const data = result.data || [];
                      setLaporanData(data);

                      let totalBerat = 0;
                      data.forEach(item => {
                        totalBerat += parseFloat(item.berat_tbs || 0);
                      });
                      setStats(prev => ({
                        ...prev,
                        totalBerat: totalBerat,
                        totalPengiriman: data.length
                      }));

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

                {/* Tombol Cetak Laporan */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                  <CetakLaporan 
                    laporanData={laporanData}
                    tanggalMulai={localStorage.getItem('dashboard_start_date') || filterStartDate}
                    tanggalSelesai={localStorage.getItem('dashboard_end_date') || filterEndDate}
                  />
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm overflow-x-auto border-2" style={{ borderColor: '#012A0D' }}>
                  <table className={styles['data-table']}>
                    <thead>
                      <tr>
                        <th style={{ color: '#012A0D', fontWeight: 'bold' }}>No Laporan</th>
                        <th style={{ color: '#012A0D', fontWeight: 'bold' }}>Tanggal Pengiriman</th>
                        <th style={{ color: '#012A0D', fontWeight: 'bold' }}>Berat Muatan</th>
                        <th style={{ color: '#012A0D', fontWeight: 'bold' }}>Keterangan Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {laporanData.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                            Tidak ada data laporan untuk periode yang dipilih.
                          </td>
                        </tr>
                      ) : (
                        laporanData.map((item, idx) => {
                          const isSelesai = item.status === 'selesai' || item.status === 'Selesai';
                          return (
                            <tr key={idx}>
                              <td style={{ color: '#012A0D', fontWeight: 600 }}>#LAP-{1000 + idx}</td>
                              <td style={{ color: '#012A0D' }}>{formatDate(item.tanggal)}</td>
                              <td><strong style={{ color: '#F1AD00' }}>{parseFloat(item.berat_tbs).toLocaleString()} Kg</strong></td>
                              <td>
                                <span style={{
                                  background: isSelesai ? '#dcfce7' : '#fef3c7',
                                  color: isSelesai ? '#012A0D' : '#92400e',
                                  border: isSelesai ? '2px solid #86efac' : '2px solid #fcd34d',
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  display: 'inline-block'
                                }}>
                                  {isSelesai ? 'Selesai' : 'Dalam Proses'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            } />

            {/* ROUTE ARSIP */}
            {userRole === 'manajer' && (
              <Route path="arsip" element={
                <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F4F7FE' }}>
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