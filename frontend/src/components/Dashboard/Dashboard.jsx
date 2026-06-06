import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

// IMPOR KOMPONEN LAIN
import MasterData from '../Master/MasterData';
import FilterLaporan from '../Laporan/FilterLaporan';
import CetakLaporan from '../Laporan/CetakLaporan';
import FormManifest from '../Transaksi/formManifest';
import TabelDistribusi from '../Transaksi/TabelDistribusi';

// IMPOR CHART LIBRARY
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// IMPOR ICON dari react-icons
import {
  FaWeightHanging,
  FaTruck,
  FaUsers,
  FaTrailer,
  FaTree,
  FaIndustry,
  FaChartLine,
  FaLeaf,
  FaPrint,
  FaSignOutAlt,
  FaTachometerAlt,
  FaDatabase,
  FaExchangeAlt,
  FaFileAlt,
  FaBars
} from 'react-icons/fa';

const Dashboard = () => {
  // STATE MANAGEMENT
  const [activePage, setActivePage] = useState('dashboard');
  const [userRole] = useState(localStorage.getItem('user_role') || 'manajer');
  const token = localStorage.getItem('token') || '';

  // State untuk Data Ringkasan Dashboard
  const [stats, setStats] = useState({
    totalBerat: 0,
    totalPengiriman: 0,
    totalSupir: 0,
    totalTruk: 0,
    totalKebun: 0,
    totalPabrik: 0
  });

  const [laporanData, setLaporanData] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);
  const [formTransaksi, setFormTransaksi] = useState({
    supir: '',
    plat: '',
    berat: '',
    status: 'menunggu_memuat'
  });

  // Fetch Data Dashboard
  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const tanggalMulai = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const tanggalSelesai = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`;

      const laporanRes = await fetch(
        `http://localhost:3000/api/laporan?tanggal_mulai=${tanggalMulai}&tanggal_selesai=${tanggalSelesai}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const laporanResult = await laporanRes.json();
      const data = laporanResult.data || [];
      setLaporanData(data);

      let totalBerat = 0;
      data.forEach(item => { totalBerat += parseFloat(item.berat_tbs || 0); });

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

  useEffect(() => {
    fetchDashboardData();
    fetchTransaksi();
  }, []);

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

  // RENDER KONTEN BERDASARKAN activePage
  const renderContent = () => {
    const isManajer = userRole === 'manajer';

    switch (activePage) {
      case 'dashboard':
        return (
          // Memaksa background abu-abu terang menutupi gradasi bocor
          <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F8FAFC' }}>
            
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaLeaf className="text-green-500 text-3xl" />
                Dashboard Monitoring Sawit
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
                <FaChartLine className="text-gray-400" />
                Volume Sawit - Periode: {bulanSekarang}
              </p>
            </div>
            
            {/* BARIS 1: STATISTIK CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
              {/* Total Berat */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaWeightHanging className="text-blue-600 text-xl" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">Bulan ini</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalBerat.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Total Berat (Kg)</p>
              </div>

              {/* Pengiriman */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaTruck className="text-blue-600 text-xl" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">Pengiriman</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalPengiriman}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Total pengiriman</p>
              </div>

              {/* Supir */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaUsers className="text-blue-600 text-xl" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">Supir</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalSupir}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Supir terdaftar</p>
              </div>

              {/* Truk */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaTrailer className="text-blue-600 text-xl" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">Armada</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalTruk}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Unit truk aktif</p>
              </div>

              {/* Kebun */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaTree className="text-blue-600 text-xl" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">Kebun</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalKebun}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Kebun terdaftar</p>
              </div>

              {/* Pabrik */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border-none">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaIndustry className="text-blue-600 text-xl" />
                  </div>
                  <span className="text-xs font-medium text-gray-400">Pabrik</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-3">{stats.totalPabrik}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Pabrik terdaftar</p>
              </div>
            </div>

            {/* BARIS 2: LINE CHART + BAR CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
              {/* Tren Berat */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border-none">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Tren Berat Pengiriman</h3>
                </div>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [`${value} Kg`, 'Berat']} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px 0px rgba(0,0,0,0.05)' }} />
                      <Line type="monotone" dataKey="berat" stroke="#2563eb" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volume Harian */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border-none">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Volume Pengiriman Harian</h3>
                </div>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [`${value} Kg`, 'Volume']} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px 0px rgba(0,0,0,0.05)' }} />
                      <Bar dataKey="berat" fill="#38bdf8" radius={[6, 6, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* BARIS 3: PIE CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {/* Kontribusi per Kebun */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border-none">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Kontribusi per Kebun</h3>
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]}
                        cx="50%" cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        dataKey="value"
                        label={({ name, percent }) => pieChartData.length ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                        labelLine={false}
                        stroke="none"
                      >
                        {(pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#2563eb', '#38bdf8', '#e2e8f0', '#f59e0b', '#10b981'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString()} Kg`} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px 0px rgba(0,0,0,0.05)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Pengiriman */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border-none">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-lg font-bold text-gray-800">Status Pengiriman</h3>
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]}
                        cx="50%" cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        dataKey="value"
                        label={({ name, percent }) => statusChartData.length ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                        labelLine={false}
                        stroke="none"
                      >
                        {(statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                          <Cell key={`status-cell-${index}`} fill={['#10b981', '#f59e0b'][index % 2]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} pengiriman`} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0px 4px 18px 0px rgba(0,0,0,0.05)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Ringkasan status */}
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

            {/* Pesan jika tidak ada data */}
            {laporanData.length === 0 && (
              <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-gray-500 font-medium text-sm">⚠️ Belum ada data pengiriman pada periode ini. Silakan tambah transaksi di halaman Transaksi.</p>
              </div>
            )}
          </div>
        );

      case 'master':
        return (
          <div className="w-full min-h-screen p-6 rounded-tl-[20px]" style={{ backgroundColor: '#F8FAFC' }}>
             <MasterData />
          </div>
        );

      case 'transaksi':
        return (
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
        );

      case 'laporan':
        return (
          <div className={`${styles['master-container']} w-full min-h-screen p-6 rounded-tl-[20px]`} style={{ backgroundColor: '#F8FAFC' }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Laporan Pengiriman</h1>

            <FilterLaporan
              onFilter={(mulai, selesai) => {
                const fetchFilteredData = async () => {
                  try {
                    const response = await fetch(
                      `http://localhost:3000/api/laporan?tanggal_mulai=${mulai}&tanggal_selesai=${selesai}`,
                      { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    const result = await response.json();
                    setLaporanData(result.data || []);

                    let totalBerat = 0;
                    (result.data || []).forEach(item => {
                      totalBerat += parseFloat(item.berat_tbs || 0);
                    });
                    setStats(prev => ({
                      ...prev,
                      totalBerat: totalBerat,
                      totalPengiriman: (result.data || []).length
                    }));
                  } catch (error) {
                    console.error("Error filtering laporan:", error);
                  }
                };
                fetchFilteredData();
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
              <button
                onClick={() => window.print()}
                className={`${styles['btn-add']} bg-gray-800 hover:bg-gray-900 text-white rounded-xl px-4 py-2 transition`}
              >
                <FaPrint style={{ marginRight: '8px' }} /> Cetak Laporan
              </button>
            </div>

            <div className={`${styles['table-responsive']} bg-white rounded-2xl p-5 shadow-sm`}>
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
                        Tidak ada data laporan pada rentang tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    laporanData.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-gray-800 font-medium">#LAP-{1000 + idx}</td>
                        <td className="text-gray-800 font-medium">{formatDate(item.tanggal)}</td>
                        <td className="text-gray-800"><strong>{item.berat_tbs} Kg</strong></td>
                        <td>
                          <span style={{ background: '#d1fae5', color: '#059669', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
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
    <div className={styles['app-container']} style={{ backgroundColor: '#F8FAFC' }}>
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles['sidebar-header']}>
          <h3>Distribusi App</h3>
        </div>
        <nav className={styles['sidebar-nav']}>
          <button className={`${styles['nav-item']} ${activePage === 'dashboard' ? styles.active : ''}`} onClick={() => setActivePage('dashboard')}>
            <FaTachometerAlt /><span>Dashboard</span>
          </button>
          <button className={`${styles['nav-item']} ${activePage === 'master' ? styles.active : ''}`} onClick={() => setActivePage('master')}>
            <FaDatabase /><span>Data Master</span>
          </button>
          <button className={`${styles['nav-item']} ${activePage === 'transaksi' ? styles.active : ''}`} onClick={() => setActivePage('transaksi')}>
            <FaExchangeAlt /><span>Transaksi</span>
          </button>
          <button className={`${styles['nav-item']} ${activePage === 'laporan' ? styles.active : ''}`} onClick={() => setActivePage('laporan')}>
            <FaFileAlt /><span>Laporan</span>
          </button>
        </nav>
        <div className={styles['sidebar-footer']}>
          <button className={styles['btn-logout']} onClick={() => window.location.href = '/login'}>
            <FaSignOutAlt /><span>Logout</span>
          </button>
        </div>
      </aside>

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
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;