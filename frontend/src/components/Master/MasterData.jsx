import { useState, useEffect, useCallback } from 'react';  // ✅ Hapus 'React', tambah 'useCallback'

const MasterData = () => {
  const [activeMasterType, setActiveMasterType] = useState('supir');
  const [masterData, setMasterData] = useState([]);
  const [isMasterLoading, setIsMasterLoading] = useState(false);
  
  // State untuk Modal & Edit (akan dipakai nanti)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  // const [editId, setEditId] = useState(null);
  
  const userRole = localStorage.getItem('user_role') || 'manajer';
  const token = localStorage.getItem('token') || '';

  // ✅ PINDAHKAN loadMasterData SEBELUM useEffect & PAKAI useCallback
  const loadMasterData = useCallback(async () => {
    setIsMasterLoading(true);
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
  }, [activeMasterType, token]);  // ✅ Tambah dependencies

  // ✅ useEffect sekarang aman
  useEffect(() => {
    loadMasterData();
  }, [loadMasterData]);  // ✅ Tambah dependency

  const getMasterTitle = () => {
    const titles = { supir: 'Supir', truk: 'Truk', kebun: 'Kebun', pabrik: 'Pabrik' };
    return titles[activeMasterType];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  // Fungsi CRUD (placeholder - akan diimplementasi nanti)
  const handleAdd = () => {
    setIsEditMode(false);
    setInputData({});
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    // setEditId(item[`id${activeMasterType}`]);
    setInputData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      // TODO: Implement delete API call
      console.log('Delete ID:', id);
      await loadMasterData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement add/update API call
    console.log('Submit data:', inputData);
    setIsModalOpen(false);
    await loadMasterData();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Master</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 my-4 bg-gray-100 p-1.5 rounded-xl w-max">
        {['supir', 'truk', 'kebun', 'pabrik'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveMasterType(type)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize ${
              activeMasterType === type 
                ? 'bg-white text-green-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Data {type}
          </button>
        ))}
      </div>

      {/* Tombol Tambah - Hanya untuk petugas */}
      {userRole !== 'manajer' && (
        <button
          onClick={handleAdd}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2 mb-4"
        >
          <i className="fas fa-plus text-xs"></i> Tambah {getMasterTitle()}
        </button>
      )}

      {/* Tabel Data */}
      {isMasterLoading ? (
        <div className="p-12 text-center text-gray-500">
          <i className="fas fa-spinner animate-spin text-green-700 text-2xl mb-2 block"></i>
          <p>Memuat data master...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">ID</th>
                {activeMasterType === 'supir' && (
                  <>
                    <th className="py-4 px-6">Nama Supir</th>
                    <th className="py-4 px-6">No. HP</th>
                  </>
                )}
                {activeMasterType === 'truk' && (
                  <>
                    <th className="py-4 px-6">No. Polisi</th>
                    <th className="py-4 px-6">Kapasitas</th>
                  </>
                )}
                {activeMasterType === 'kebun' && (
                  <>
                    <th className="py-4 px-6">Nama Kebun</th>
                    <th className="py-4 px-6">Lokasi</th>
                  </>
                )}
                {activeMasterType === 'pabrik' && (
                  <>
                    <th className="py-4 px-6">Nama Pabrik</th>
                    <th className="py-4 px-6">Lokasi</th>
                  </>
                )}
                <th className="py-4 px-6">Dibuat</th>
                {userRole !== 'manajer' && <th className="py-4 px-6">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {masterData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={userRole !== 'manajer' ? 7 : 6} 
                    className="py-8 text-center text-gray-400"
                  >
                    Tidak ada data terdaftar dalam sistem.
                  </td>
                </tr>
              ) : (
                masterData.map((item, idx) => {
                  const idKey = `id${activeMasterType}`;
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{item[idKey]}</td>
                      
                      {activeMasterType === 'supir' && (
                        <>
                          <td className="py-4 px-6 font-semibold">{item.nama_supir}</td>
                          <td className="py-4 px-6 text-gray-500">{item.no_hp}</td>
                        </>
                      )}
                      
                      {activeMasterType === 'truk' && (
                        <>
                          <td className="py-4 px-6 font-semibold">{item.no_polisi}</td>
                          <td className="py-4 px-6 text-gray-500">{item.kapasitas_ton} ton</td>
                        </>
                      )}
                      
                      {activeMasterType === 'kebun' && (
                        <>
                          <td className="py-4 px-6 font-semibold">{item.nama_kebun}</td>
                          <td className="py-4 px-6 text-gray-500">{item.lokasi}</td>
                        </>
                      )}
                      
                      {activeMasterType === 'pabrik' && (
                        <>
                          <td className="py-4 px-6 font-semibold">{item.nama_pabrik}</td>
                          <td className="py-4 px-6 text-gray-500">{item.lokasi}</td>
                        </>
                      )}
                      
                      <td className="py-4 px-6 text-gray-400">{formatDate(item.created_at)}</td>
                      
                      {userRole !== 'manajer' && (
                        <td className="py-4 px-6 whitespace-nowrap">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 mr-3"
                          >
                            <i className="fas fa-edit text-xs"></i> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item[idKey])}
                            className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                          >
                            <i className="fas fa-trash text-xs"></i> Hapus
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

      {/* Modal Form - Akan diimplementasi lengkap nanti */}
      {isModalOpen && userRole !== 'manajer' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-green-800 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold">{isEditMode ? 'Edit' : 'Tambah'} Data {getMasterTitle()}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-xl hover:opacity-75">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Form fields akan diimplementasi sesuai type */}
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800"
                >
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

export default MasterData;