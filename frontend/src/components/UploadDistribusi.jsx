// src/components/UploadDistribusi.jsx
import { useState } from 'react';
import axiosInstance from '../config/axios';

function UploadDistribusi() {
  // State untuk form data
  const [formData, setFormData] = useState({
    tanggal_kirim: '',
    berat_tbs: '',
    users_idusers: 35,
    supir_idsupir: 1,
    truk_idtruk: 1,
    kebun_idkebun: 1,
    pabrik_idpabrik: 1,
    status: 'menunggu_memuat',
  });

  // State untuk file
  const [suratJalan, setSuratJalan] = useState(null);
  const [buktiTimbang, setBuktiTimbang] = useState(null);

  // State untuk UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setMessage({
          type: 'error',
          text: 'File harus berupa JPG, PNG, atau PDF',
        });
        return;
      }

      if (file.size > maxSize) {
        setMessage({
          type: 'error',
          text: 'Ukuran file maksimal 5MB',
        });
        return;
      }
    }

    if (fileType === 'surat_jalan') {
      setSuratJalan(file);
    } else if (fileType === 'bukti_timbang') {
      setBuktiTimbang(file);
    }
  };

  // Handle submit (UPLOAD)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Buat FormData untuk multipart/form-data
      const data = new FormData();
      
      // Append semua field text
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append file (jika ada)
      if (suratJalan) {
        data.append('surat_jalan', suratJalan);
      }
      if (buktiTimbang) {
        data.append('bukti_timbang', buktiTimbang);
      }

      console.log('📤 Mengupload data...');
      console.log('FormData:', data);

      // POST ke API
      const response = await axiosInstance.post('/distribusi', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload berhasil:', response.data);

      // Success
      setMessage({
        type: 'success',
        text: `✅ ${response.data.message} (ID: ${response.data.data.iddistribusi})`,
      });

      // Reset form
      setFormData({
        tanggal_kirim: '',
        berat_tbs: '',
        users_idusers: 35,
        supir_idsupir: 1,
        truk_idtruk: 1,
        kebun_idkebun: 1,
        pabrik_idpabrik: 1,
        status: 'menunggu_memuat',
      });
      setSuratJalan(null);
      setBuktiTimbang(null);

    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('❌ Error response:', error.response);
      
      // Error
      setMessage({
        type: 'error',
        text: `❌ ${error.response?.data?.message || 'Gagal upload dokumen'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>📤 Upload Dokumen Distribusi</h2>

      {/* Message Alert */}
      {message.text && (
        <div
          style={{
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Tanggal Kirim */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tanggal Kirim:</label>
          <input
            type="date"
            name="tanggal_kirim"
            value={formData.tanggal_kirim}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Berat TBS */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Berat TBS (Ton):</label>
          <input
            type="number"
            name="berat_tbs"
            value={formData.berat_tbs}
            onChange={handleInputChange}
            step="0.1"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Upload Surat Jalan */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Surat Jalan (JPG, PNG, PDF - Max 5MB):</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileChange(e, 'surat_jalan')}
            style={{ width: '100%' }}
          />
          {suratJalan && <small style={{ color: 'green' }}>✅ File terpilih: {suratJalan.name}</small>}
        </div>

        {/* Upload Bukti Timbang */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bukti Timbang (JPG, PNG, PDF - Max 5MB):</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileChange(e, 'bukti_timbang')}
            style={{ width: '100%' }}
          />
          {buktiTimbang && <small style={{ color: 'green' }}>✅ File terpilih: {buktiTimbang.name}</small>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? '⏳ Mengupload...' : '📤 Upload Dokumen'}
        </button>
      </form>
    </div>
  );
}

export default UploadDistribusi;