import { useState, useEffect } from 'react';
import styles from '../Dashboard/Dashboard.module.css';

const MasterData = () => {
  const [activeMasterType, setActiveMasterType] = useState('supir');
  const [masterData, setMasterData] = useState([]);
  const [isMasterLoading, setIsMasterLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [inputData, setInputData] = useState({});
  
  const token = localStorage.getItem('token') || '';
  const userRole = localStorage.getItem('user_role') || 'manajer';

  // Ambil data master dari API
  const loadMasterData = async () => {
    setIsMasterLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/master/${activeMasterType}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === 'Success' || result.status === 'success') {
        setMasterData(result.data || []);
      } else {
        console.error('Gagal load data:', result);
        setMasterData([]);
      }
    } catch (error) {
      console.error('Error Master Data:', error);
      setMasterData([]);
    } finally {
      setIsMasterLoading(false);
    }
  };

  useEffect(() => {
  console.log('🔥 MasterData mounted - type:', activeMasterType);
  const loadData = async () => {
    try {
      await loadMasterData();
      console.log('✅ Master data fetched');
    } catch (error) {
      console.error('❌ Error loading master data:', error);
    }
  };
  loadData();
}, [activeMasterType]);

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData(prev => ({ ...prev, [name]: value }));
  };

  // Submit tambah data
  const submitAddData = async (e) => {
    e.preventDefault();
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk menambah data.');
      return;
    }
    
    try {
      let cleanData = {};
      if (activeMasterType === 'supir') {
        cleanData = { nama_supir: inputData.nama_supir, no_hp: inputData.no_hp };
      } else if (activeMasterType === 'truk') {
        cleanData = { no_polisi: inputData.no_polisi, kapasitas_ton: inputData.kapasitas_ton };
      } else if (activeMasterType === 'kebun') {
        cleanData = { nama_kebun: inputData.nama_kebun, lokasi: inputData.lokasi };
      } else if (activeMasterType === 'pabrik') {
        cleanData = { nama_pabrik: inputData.nama_pabrik, lokasi: inputData.lokasi };
      }

      const response = await fetch(`http://localhost:5000/api/master/${activeMasterType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanData)
      });

      const result = await response.json();
      if (result.status === 'Success' || result.status === 'success') {
        alert(result.message || 'Data berhasil disimpan!');
        setIsModalOpen(false);
        setInputData({});
        loadMasterData();
      } else {
        alert('Gagal: ' + (result.message || 'Data gagal disimpan'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  // Submit update data
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
        cleanData = { no_polisi: inputData.no_polisi, kapasitas_ton: inputData.kapasitas_ton };
      } else if (activeMasterType === 'kebun') {
        cleanData = { nama_kebun: inputData.nama_kebun, lokasi: inputData.lokasi };
      } else if (activeMasterType === 'pabrik') {
        cleanData = { nama_pabrik: inputData.nama_pabrik, lokasi: inputData.lokasi };
      }

      const response = await fetch(`http://localhost:5000/api/master/${activeMasterType}/${editId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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

  // Hapus data
  const handleDeleteData = async (id) => {
    if (userRole === 'manajer') {
      alert('Anda tidak memiliki izin untuk menghapus data.');
      return;
    }
    
    const confirmed = confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/master/${activeMasterType}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.status === 'Success' || result.status === 'success') {
        alert(result.message || 'Data berhasil dihapus');
        loadMasterData();
      } else {
        alert('Gagal menghapus: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      alert('Error: ' + error.message);
    }
  };

  // Buka modal edit
  const openEditModal = (item) => {
    const idKey = `id${activeMasterType}`;
    setEditId(item[idKey]);
    setInputData(item);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Buka modal tambah
  const openAddModal = () => {
    setIsEditMode(false);
    setEditId(null);
    setInputData({});
    setIsModalOpen(true);
  };

  // Get title for button
  const getMasterTitle = () => {
    const titles = {
      supir: 'Supir',
      truk: 'Truk',
      kebun: 'Kebun',
      pabrik: 'Pabrik'
    };
    return titles[activeMasterType] || 'Data';
  };

  // Render form fields berdasarkan tipe master
  const renderFormFields = () => {
    if (activeMasterType === 'supir') {
      return (
        <>
          <div className={styles['form-group']}>
            <label>Nama Supir *</label>
            <input
              type="text"
              name="nama_supir"
              value={inputData.nama_supir || ''}
              onChange={handleInputChange}
 className={styles['form-control']}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>No. HP</label>
            <input
              type="text"
              name="no_hp"
              value={inputData.no_hp || ''}
              onChange={handleInputChange}
              className={styles['form-control']}
            />
          </div>
        </>
      );
    } else if (activeMasterType === 'truk') {
      return (
        <>
          <div className={styles['form-group']}>
            <label>No. Polisi *</label>
            <input
              type="text"
              name="no_polisi"
              value={inputData.no_polisi || ''}
              onChange={handleInputChange}
              className={styles['form-control']}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Kapasitas (Ton) *</label>
            <input
              type="number"
              name="kapasitas_ton"
              value={inputData.kapasitas_ton || ''}
              onChange={handleInputChange}
              className={styles['form-control']}
              required
            />
          </div>
        </>
      );
    } else if (activeMasterType === 'kebun') {
      return (
        <>
          <div className={styles['form-group']}>
            <label>Nama Kebun *</label>
            <input
              type="text"
              name="nama_kebun"
              value={inputData.nama_kebun || ''}
              onChange={handleInputChange}
              className={styles['form-control']}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Lokasi</label>
            <input
              type="text"
              name="lokasi"
              value={inputData.lokasi || ''}
              onChange={handleInputChange}
              className={styles['form-control']}
            />
          </div>
        </>
      );
    } else if (activeMasterType === 'pabrik') {
      return (
        <>
          <div className={styles['form-group']}>
            <label>Nama Pabrik *</label>
            <input
              type="text"
              name="nama_pabrik"
              value={inputData.nama_pabrik || ''}
              onChange={handleInputChange}
              className={styles['form-control']}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label>Lokasi</label>
            <input
              type="text"
              name="lokasi"
              value={inputData.lokasi || ''}
              onChange={handleInputChange}
              className={styles['form-control']}
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className={styles['master-container']}>
      <h1 className={styles['page-title']}>Manajemen Data Master</h1>
      
      {/* Tabs */}
      <div className={styles['master-tabs']}>
        {['supir', 'truk', 'kebun', 'pabrik'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveMasterType(type)}
            className={`${styles['tab-btn']} ${activeMasterType === type ? styles.active : ''}`}
          >
            Data {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Action Bar */}
      {userRole !== 'manajer' && (
        <div className={styles['action-bar']}>
          <button onClick={openAddModal} className={styles['btn-add']}>
            <i className="fas fa-plus"></i> Tambah {getMasterTitle()}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isMasterLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Memuat data...</p>
        </div>
      ) : (
        /* Table */
        <div className={styles['table-responsive']}>
          <table className={styles['data-table']}>
            <thead>
              <tr>
                <th>ID</th>
                {activeMasterType === 'supir' && <th>Nama Supir</th>}
                {activeMasterType === 'supir' && <th>No. HP</th>}
                {activeMasterType === 'truk' && <th>No. Polisi</th>}
                {activeMasterType === 'truk' && <th>Kapasitas (Ton)</th>}
                {activeMasterType === 'kebun' && <th>Nama Kebun</th>}
                {activeMasterType === 'kebun' && <th>Lokasi</th>}
                {activeMasterType === 'pabrik' && <th>Nama Pabrik</th>}
                {activeMasterType === 'pabrik' && <th>Lokasi</th>}
                <th>Dibuat</th>
                {userRole !== 'manajer' && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {masterData.length === 0 ? (
                <tr>
                  <td colSpan={userRole !== 'manajer' ? 4 : 3} className="text-center">
                    Tidak ada data terdaftar
                  </td>
                </tr>
              ) : (
                masterData.map((item) => {
                  const idKey = `id${activeMasterType}`;
                  return (
                    <tr key={item[idKey]}>
                      <td>{item[idKey]}</td>
                      {activeMasterType === 'supir' && (
                        <>
                          <td><strong>{item.nama_supir}</strong></td>
                          <td>{item.no_hp || '-'}</td>
                        </>
                      )}
                      {activeMasterType === 'truk' && (
                        <>
                          <td><strong>{item.no_polisi}</strong></td>
                          <td>{item.kapasitas_ton} Ton</td>
                        </>
                      )}
                      {activeMasterType === 'kebun' && (
                        <>
                          <td><strong>{item.nama_kebun}</strong></td>
                          <td>{item.lokasi || '-'}</td>
                        </>
                      )}
                      {activeMasterType === 'pabrik' && (
                        <>
                          <td><strong>{item.nama_pabrik}</strong></td>
                          <td>{item.lokasi || '-'}</td>
                        </>
                      )}
                      <td>{formatDate(item.created_at)}</td>
                      {userRole !== 'manajer' && (
                        <td>
                          <button
                            onClick={() => openEditModal(item)}
                            style={{ background: '#ffc107', color: '#333', marginRight: '8px' }}
                            className={styles['btn-add']}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteData(item[idKey])}
                            style={{ background: '#dc3545' }}
                            className={styles['btn-add']}
                          >
                            Hapus
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className={styles['modal-overlay']} onClick={() => setIsModalOpen(false)}>
          <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
            <div className={styles['modal-header']}>
              <h3>{isEditMode ? `Edit ${getMasterTitle()}` : `Tambah ${getMasterTitle()}`}</h3>
              <span className={styles['close-modal']} onClick={() => setIsModalOpen(false)}>&times;</span>
            </div>
            <form onSubmit={isEditMode ? submitUpdateData : submitAddData}>
              <div className={styles['modal-body']}>
                {renderFormFields()}
              </div>
              <div className={styles['modal-footer']}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles['btn-cancel']}>
                  Batal
                </button>
                <button type="submit" className={styles['btn-save']}>
                  {isEditMode ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterData;
