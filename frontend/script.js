// ============ KODE TEMAN ANDA (UNTUK DASHBOARD) ============
async function getDashboardData() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/laporan?tanggal_mulai=2026-04-01&tanggal_selesai=2026-04-30"
    );

    const result = await response.json();
    const data = result.data;

    // HITUNG TOTAL BERAT
    let totalBerat = 0;
    data.forEach(item => {
      totalBerat += parseFloat(item.berat_tbs);
    });

    // JUMLAH PENGIRIMAN
    const totalPengiriman = data.length;

    // TAMPILKAN KE DASHBOARD
    document.getElementById("totalBerat").innerText = totalBerat + " Kg";
    document.getElementById("totalPengiriman").innerText = totalPengiriman;

  } catch (error) {
    console.log(error);
  }
}

// Panggil fungsi dashboard
getDashboardData();
// ============ AKHIR KODE TEMAN ANDA ============

// ============ NAVIGASI SIDEBAR ============
// Fungsi untuk load dashboard page (kembali ke dashboard)
function loadDashboardPage() {
  const contentWrapper = document.getElementById('contentWrapper');
  contentWrapper.innerHTML = `
    <div class="dashboard">
      <h1>Dashboard Monitoring Sawit</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Berat TBS</h3>
          <p id="totalBerat">0 Kg</p>
        </div>
        <div class="stat-card">
          <h3>Jumlah Pengiriman</h3>
          <p id="totalPengiriman">0</p>
        </div>
      </div>
    </div>
  `;
  getDashboardData();
}

// Event listener untuk menu sidebar
document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.getAttribute('data-page');
      
      // Update active class
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Load page
      if (page === 'dashboard') {
        loadDashboardPage();
      } else if (page === 'master') {
        loadMasterPage();
      }
    });
  });
});
// ============ AKHIR NAVIGASI SIDEBAR ============

// ============ KODE UNTUK TUGAS DATA MASTER ============
// Ambil token dari localStorage (dari hasil login)
const token = localStorage.getItem('token');

// Variable untuk menyimpan tipe master yang aktif
let activeMasterType = 'supir';

// Fungsi untuk load halaman Data Master
async function loadMasterPage() {
  const contentWrapper = document.getElementById('contentWrapper');
  
  // Tampilkan HTML untuk Data Master
  contentWrapper.innerHTML = `
    <div class="master-container">
      <h1 class="page-title">Manajemen Data Master</h1>
      
      <!-- Tabs untuk memilih tipe master -->
      <div class="master-tabs">
        <button class="tab-btn active" onclick="switchMasterType('supir')">Data Supir</button>
        <button class="tab-btn" onclick="switchMasterType('truk')">Data Truk</button>
        <button class="tab-btn" onclick="switchMasterType('kebun')">Data Kebun</button>
        <button class="tab-btn" onclick="switchMasterType('pabrik')">Data Pabrik</button>
      </div>
      
      <!-- Tombol Tambah Data -->
      <div class="action-bar">
        <button class="btn-add" onclick="showAddForm()">
          <i class="fas fa-plus"></i> Tambah Data
        </button>
      </div>
      
      <!-- Loading indicator -->
      <div id="loadingIndicator" class="loading" style="display: none;">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>
      
      <!-- Container untuk tabel data -->
      <div id="masterTableContainer" class="table-responsive"></div>
    </div>
  `;
  
  // Load data master yang aktif
  await loadMasterData();
}

// Fungsi untuk switch tipe master
async function switchMasterType(type) {
  activeMasterType = type;
  
  // Update active class pada tabs
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Tambah class active ke button yang diklik
  const clickedBtn = Array.from(btns).find(btn => btn.getAttribute('onclick')?.includes(type));
  if (clickedBtn) clickedBtn.classList.add('active');
  
  // Load data sesuai tipe
  await loadMasterData();
}

// Fungsi untuk load data master dari backend
async function loadMasterData() {
  const container = document.getElementById('masterTableContainer');
  const loading = document.getElementById('loadingIndicator');
  
  if (!container) return;
  
  // Tampilkan loading
  if (loading) loading.style.display = 'block';
  container.innerHTML = '';
  
  try {
    // Panggil API sesuai tipe master
    const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (result.status === 'Success') {
      renderMasterTable(result.data);
    } else {
      container.innerHTML = '<div class="alert alert-error">Gagal memuat data</div>';
    }
  } catch (error) {
    console.error('Error:', error);
    container.innerHTML = '<div class="alert alert-error">Terjadi kesalahan saat memuat data</div>';
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

// Fungsi untuk render tabel berdasarkan tipe master
function renderMasterTable(data) {
  const container = document.getElementById('masterTableContainer');
  
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="alert alert-info">Tidak ada data</div>';
    return;
  }
  
  let tableHTML = '<table class="data-table">';
  tableHTML += '<thead><tr>';
  
  // Tentukan kolom berdasarkan tipe master
  if (activeMasterType === 'supir') {
    tableHTML += '<th>ID</th><th>Nama Supir</th><th>No. HP</th><th>Dibuat</th><th>Diupdate</th>';
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'manager') {
      tableHTML += '<th>Aksi</th>';
    }
    tableHTML += '</tr></thead><tbody>';
    
    data.forEach(item => {
      tableHTML += `<tr>
        <td>${item.idsupir}</td>
        <td>${escapeHtml(item.nama_supir)}</td>
        <td>${escapeHtml(item.no_hp)}</td>
        <td>${formatDate(item.created_at)}</td>
        <td>${formatDate(item.updated_at)}</td>`;
      
      if (userRole === 'manager') {
        tableHTML += `<td><button class="btn-delete" onclick="deleteData(${item.idsupir})">Hapus</button></td>`;
      }
      tableHTML += `</tr>`;
    });
  } 
  else if (activeMasterType === 'truk') {
    tableHTML += '<th>ID</th><th>No. Polisi</th><th>Merk</th><th>Kapasitas</th><th>Dibuat</th>';
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'manager') {
      tableHTML += '<th>Aksi</th>';
    }
    tableHTML += '</table></thead><tbody>';
    
    data.forEach(item => {
      tableHTML += `<tr>
        <td>${item.idtruk}</td>
        <td>${escapeHtml(item.no_polisi)}</td>
        <td>${escapeHtml(item.merk)}</td>
        <td>${item.kapasitas} kg</td>
        <td>${formatDate(item.created_at)}</td>`;
      
      if (userRole === 'manager') {
        tableHTML += `<td><button class="btn-delete" onclick="deleteData(${item.idtruk})">Hapus</button></td>`;
      }
      tableHTML += `</tr>`;
    });
  }
  else if (activeMasterType === 'kebun') {
    tableHTML += '<th>ID</th><th>Nama Kebun</th><th>Lokasi</th><th>Dibuat</th>';
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'manager') {
      tableHTML += '<th>Aksi</th>';
    }
    tableHTML += '<tr></thead><tbody>';
    
    data.forEach(item => {
      tableHTML += `<tr>
        <td>${item.idkebun}</td>
        <td>${escapeHtml(item.nama_kebun)}</td>
        <td>${escapeHtml(item.lokasi)}</td>
        <td>${formatDate(item.created_at)}</td>`;
      
      if (userRole === 'manager') {
        tableHTML += `<td><button class="btn-delete" onclick="deleteData(${item.idkebun})">Hapus</button></td>`;
      }
      tableHTML += `</tr>`;
    });
  }
  else if (activeMasterType === 'pabrik') {
    tableHTML += '<th>ID</th><th>Nama Pabrik</th><th>Lokasi</th><th>Dibuat</th>';
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'manager') {
      tableHTML += '<th>Aksi</th>';
    }
    tableHTML += '<table></thead><tbody>';
    
    data.forEach(item => {
      tableHTML += `<tr>
        <td>${item.idpabrik}</td>
        <td>${escapeHtml(item.nama_pabrik)}</td>
        <td>${escapeHtml(item.lokasi)}</td>
        <td>${formatDate(item.created_at)}</td>`;
      
      if (userRole === 'manager') {
        tableHTML += `<td><button class="btn-delete" onclick="deleteData(${item.idpabrik})">Hapus</button></td>`;
      }
      tableHTML += `</tr>`;
    });
  }
  
  tableHTML += '</tbody><table>';
  container.innerHTML = tableHTML;
}

// Fungsi untuk menampilkan form tambah data
function showAddForm() {
  let formHTML = `
    <div id="addModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Tambah ${getMasterTitle()}</h3>
          <span class="close-modal" onclick="closeModal()">&times;</span>
        </div>
        <form id="addDataForm" onsubmit="submitAddData(event)">
  `;
  
  // Tampilkan form sesuai tipe master
  if (activeMasterType === 'supir') {
    formHTML += `
      <div class="form-group">
        <label>Nama Supir:</label>
        <input type="text" name="nama_supir" required class="form-control">
      </div>
      <div class="form-group">
        <label>No. HP:</label>
        <input type="text" name="no_hp" required class="form-control">
      </div>
    `;
  } 
  else if (activeMasterType === 'truk') {
    formHTML += `
      <div class="form-group">
        <label>No. Polisi:</label>
        <input type="text" name="no_polisi" required class="form-control">
      </div>
      <div class="form-group">
        <label>Merk:</label>
        <input type="text" name="merk" required class="form-control">
      </div>
      <div class="form-group">
        <label>Kapasitas (kg):</label>
        <input type="number" name="kapasitas" required class="form-control">
      </div>
    `;
  }
  else if (activeMasterType === 'kebun') {
    formHTML += `
      <div class="form-group">
        <label>Nama Kebun:</label>
        <input type="text" name="nama_kebun" required class="form-control">
      </div>
      <div class="form-group">
        <label>Lokasi:</label>
        <input type="text" name="lokasi" required class="form-control">
      </div>
    `;
  }
  else if (activeMasterType === 'pabrik') {
    formHTML += `
      <div class="form-group">
        <label>Nama Pabrik:</label>
        <input type="text" name="nama_pabrik" required class="form-control">
      </div>
      <div class="form-group">
        <label>Lokasi:</label>
        <input type="text" name="lokasi" required class="form-control">
      </div>
    `;
  }
  
  formHTML += `
        <div class="modal-footer">
          <button type="button" class="btn-cancel" onclick="closeModal()">Batal</button>
          <button type="submit" class="btn-save">Simpan</button>
        </div>
      </form>
    </div>
  </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', formHTML);
}

// Fungsi untuk submit data baru
async function submitAddData(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.status === 'Success') {
      alert(result.message);
      closeModal();
      await loadMasterData();
    } else {
      alert('Gagal menambah data');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat menambah data');
  }
}

// Fungsi untuk hapus data (soft delete)
async function deleteData(id) {
  const confirmed = confirm('Apakah Anda yakin ingin menghapus data ini?\n\nData akan diarsipkan (soft delete) dan tetap tersimpan dalam histori transaksi.');
  
  if (!confirmed) return;
  
  try {
    const response = await fetch(`http://localhost:3000/api/master/${activeMasterType}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    
    if (result.status === 'Success') {
      alert(result.message || 'Data berhasil dihapus');
      await loadMasterData();
    } else {
      alert('Gagal menghapus data');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat menghapus data');
  }
}

// Fungsi helper untuk menutup modal
function closeModal() {
  const modal = document.getElementById('addModal');
  if (modal) {
    modal.remove();
  }
}

// Fungsi helper untuk format tanggal
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID');
}

// Fungsi helper untuk mendapatkan judul master
function getMasterTitle() {
  const titles = {
    supir: 'Data Supir',
    truk: 'Data Truk',
    kebun: 'Data Kebun',
    pabrik: 'Data Pabrik'
  };
  return titles[activeMasterType];
}

// Fungsi helper untuk menghindari XSS
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Hapus fungsi initNavigation karena menu sudah ada di HTML
// ============ AKHIR KODE TUGAS DATA MASTER ============