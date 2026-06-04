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
  FaCalendarAlt,
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

  // State untuk Transaksi
  const [transaksiList, setTransaksiList] = useState([]);
  const [formTransaksi, setFormTransaksi] = useState({
    supir: '',
    plat: '',
    berat: '',
    status: 'menunggu_memuat'
  });

  // Ambil data untuk dashboard (bulan berjalan)
  const fetchDashboardData = async () => {
    try {
      // Set tanggal ke bulan berjalan
      const now = new Date();
      const tanggalMulai = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      const tanggalSelesai = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`;

      // Ambil data laporan bulan berjalan
      const laporanRes = await fetch(
        `http://localhost:3000/api/laporan?tanggal_mulai=${tanggalMulai}&tanggal_selesai=${tanggalSelesai}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const laporanResult = await laporanRes.json();
      const data = laporanResult.data || [];
      setLaporanData(data);

      // Hitung total berat
      let totalBerat = 0;
      data.forEach(item => {
        totalBerat += parseFloat(item.berat_tbs || 0);
      });

      // Ambil data master untuk statistik card
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

  // Ambil data transaksi
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

  // Handle Submit Form Transaksi
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
        fetchDashboardData(); // Refresh dashboard juga
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
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

  const COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#8b5cf6'];
  const bulanSekarang = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // RENDER KONTEN BERDASARKAN activePage
  const renderContent = () => {
    const isManajer = userRole === 'manajer';

    switch (activePage) {
      case 'dashboard':
        return (
          <div className={styles.pageContent}>
            {/* HEADER - lebih ringkas */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaLeaf className="text-green-600 text-2xl" />
                Dashboard Monitoring Sawit
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <FaChartLine className="text-gray-400" />
                Volume Sawit - Periode: {bulanSekarang}
              </p>
            </div>

            {/* BARIS 1: STATISTIK CARDS - pakai grid 2x3 di mobile, 6x1 di desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {/* Total Berat */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <FaWeightHanging className="text-green-500 text-lg" />
                  <span className="text-xs text-gray-400">Bulan ini</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalBerat.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Total Berat (Kg)</p>
              </div>

              {/* Pengiriman */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <FaTruck className="text-blue-500 text-lg" />
                  <span className="text-xs text-gray-400">Pengiriman</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPengiriman}</p>
                <p className="text-xs text-gray-500 mt-1">Total pengiriman</p>
              </div>

              {/* Supir */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <FaUsers className="text-orange-500 text-lg" />
                  <span className="text-xs text-gray-400">Supir</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalSupir}</p>
                <p className="text-xs text-gray-500 mt-1">Supir terdaftar</p>
              </div>

              {/* Truk */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <FaTrailer className="text-purple-500 text-lg" />
                  <span className="text-xs text-gray-400">Armada</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalTruk}</p>
                <p className="text-xs text-gray-500 mt-1">Unit truk aktif</p>
              </div>

              {/* Kebun */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <FaTree className="text-yellow-600 text-lg" />
                  <span className="text-xs text-gray-400">Kebun</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalKebun}</p>
                <p className="text-xs text-gray-500 mt-1">Kebun terdaftar</p>
              </div>

              {/* Pabrik */}
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2">
                  <FaIndustry className="text-red-500 text-lg" />
                  <span className="text-xs text-gray-400">Pabrik</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPabrik}</p>
                <p className="text-xs text-gray-500 mt-1">Pabrik terdaftar</p>
              </div>
            </div>

            {/* BARIS 2: LINE CHART + BAR CHART - tetap 2 kolom */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Tren Berat */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-700">Tren Berat Pengiriman</h3>
                </div>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => [`${value} Kg`, 'Berat']} />
                      <Line type="monotone" dataKey="berat" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Volume Harian */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-700">Volume Pengiriman Harian</h3>
                </div>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="tanggal" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => [`${value} Kg`, 'Volume']} />
                      <Bar dataKey="berat" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* BARIS 3: PIE CHARTS - 2 kolom, diperkecil tinggi chartnya */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Kontribusi per Kebun */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-yellow-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-700">Kontribusi per Kebun</h3>
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]}
                        cx="50%" cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        dataKey="value"
                        label={({ name, percent }) => pieChartData.length ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                        labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                      >
                        {(pieChartData.length ? pieChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString()} Kg`} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Pengiriman */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-700">Status Pengiriman</h3>
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]}
                        cx="50%" cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        dataKey="value"
                        label={({ name, percent }) => statusChartData.length ? `${name}: ${(percent * 100).toFixed(0)}%` : name}
                        labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                      >
                        {(statusChartData.length ? statusChartData : [{ name: 'Belum Ada Data', value: 1 }]).map((entry, index) => (
                          <Cell key={`status-cell-${index}`} fill={['#22c55e', '#f59e0b'][index % 2]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} pengiriman`} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Ringkasan status dalam bentuk badge kecil */}
                <div className="flex justify-center gap-4 mt-3 pt-2 border-t border-gray-100">
                  {statusChartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.name === 'Selesai' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span className="text-xs text-gray-600">{item.name}: <strong>{item.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pesan jika tidak ada data */}
            {laporanData.length === 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-amber-700 text-sm">⚠️ Belum ada data pengiriman pada periode ini. Silakan tambah transaksi di halaman Transaksi.</p>
              </div>
            )}
          </div>
        );

      case 'master':
        return <MasterData />;

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
          <div className={styles['master-container']}>
            <h1 className={styles['page-title']}>Laporan Pengiriman</h1>

            {/* Filter Laporan */}
            <FilterLaporan
              onFilter={(mulai, selesai) => {
                // Panggil fetch dengan filter tanggal
                const fetchFilteredData = async () => {
                  try {
                    const response = await fetch(
                      `http://localhost:3000/api/laporan?tanggal_mulai=${mulai}&tanggal_selesai=${selesai}`,
                      { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                    const result = await response.json();
                    setLaporanData(result.data || []);

                    // Update statistik juga
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

            {/* Tombol Cetak */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
              <button
                onClick={() => window.print()}
                className={styles['btn-add']}
                style={{ background: '#6c757d' }}
              >
                <FaPrint style={{ marginRight: '8px' }} /> Cetak Laporan
              </button>
            </div>

            {/* Tabel Laporan */}
            <div className={styles['table-responsive']}>
              <table className={styles['data-table']}>
                <thead>
                  <tr>
                    <th>No Laporan</th>
                    <th>Tanggal Pengiriman</th>
                    <th>Berat Muatan</th>
                    <th>Keterangan Status</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanData.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                        Tidak ada data laporan pada rentang tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    laporanData.map((item, idx) => (
                      <tr key={idx}>
                        <td>#LAP-{1000 + idx}</td>
                        <td>{formatDate(item.tanggal)}</td>
                        <td><strong>{item.berat_tbs} Kg</strong></td>
                        <td>
                          <span style={{
                            background: '#e8f5e9',
                            color: '#2e7d32',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
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

  // MAIN RENDER dengan SIDEBAR
  return (
    <div className={styles['app-container']}>
      {/* SIDEBAR NAVIGASI */}
      <aside className={styles.sidebar} id="sidebar">
        <div className={styles['sidebar-header']}>
          <h3>Distribusi App</h3>
        </div>
        <nav className={styles['sidebar-nav']}>
          <button
            className={`${styles['nav-item']} ${activePage === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </button>
          <button
            className={`${styles['nav-item']} ${activePage === 'master' ? styles.active : ''}`}
            onClick={() => setActivePage('master')}
          >
            <FaDatabase />
            <span>Data Master</span>
          </button>
          <button
            className={`${styles['nav-item']} ${activePage === 'transaksi' ? styles.active : ''}`}
            onClick={() => setActivePage('transaksi')}
          >
            <FaExchangeAlt />
            <span>Transaksi</span>
          </button>
          <button
            className={`${styles['nav-item']} ${activePage === 'laporan' ? styles.active : ''}`}
            onClick={() => setActivePage('laporan')}
          >
            <FaFileAlt />
            <span>Laporan</span>
          </button>
        </nav>
        <div className={styles['sidebar-footer']}>
          <button
            className={styles['btn-logout']}
            onClick={() => window.location.href = '/login'}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles['main-content']}>
        <nav className={styles.navbar}>
          <div className={styles['navbar-toggle']}>
            <FaBars />
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