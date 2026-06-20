import { useState, useEffect } from "react"; 
import axiosInstance from "../../utils/axios";
import styles from "../Dashboard/Dashboard.module.css";
import Container from "../Container"; 

const FormManifest = () => {
  // 🔒 SECURITY GATE: Ambil role akun dari localStorage (CASE-INSENSITIVE)
  const userRoleRaw = localStorage.getItem('user_role') || '';
  const userRole = userRoleRaw.toLowerCase().trim(); // NORMALIZE: lowercase & trim
  
  console.log('🔐 FormManifest - Raw Role:', userRoleRaw);
  console.log('🔐 FormManifest - Normalized Role:', userRole);

  // State untuk form data (MATCH dengan backend distribusi.js)
  const [formData, setFormData] = useState({
    tanggal_kirim: "",
    berat_tbs: "",
    users_idusers: localStorage.getItem('userId') || "",
    supir_idsupir: "",
    truk_idtruk: "",
    kebun_idkebun: "",
    pabrik_idpabrik: "",
    status: "menunggu_memuat",
  });

  // State untuk file upload
  const [suratJalan, setSuratJalan] = useState(null);
  const [buktiTimbang, setBuktiTimbang] = useState(null);
  const [previewSuratJalan, setPreviewSuratJalan] = useState(null);
  const [previewBuktiTimbang, setPreviewBuktiTimbang] = useState(null);

  // State untuk UI
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pesan, setPesan] = useState({ type: "", text: "" });

  // State untuk master data (dropdown) - GRACEFUL FALLBACK
  const [masterData, setMasterData] = useState({
    supir: [],
    truk: [],
    kebun: [],
    pabrik: [],
  });
  const [masterLoading, setMasterLoading] = useState(true);

  // Fetch master data dari API Zen (hanya dijalankan jika user BUKAN manajer untuk menghemat bandwidth)
  useEffect(() => {
    if (userRole === 'manajer' || userRole.includes('manajer')) return;

    const fetchMasterData = async () => {
      try {
        const [supirRes, trukRes, kebunRes, pabrikRes] = await Promise.all([
          axiosInstance.get("/api/master/supir").catch(() => ({ data: { data: [] } })),
          axiosInstance.get("/api/master/truk").catch(() => ({ data: { data: [] } })),
          axiosInstance.get("/api/master/kebun").catch(() => ({ data: { data: [] } })),
          axiosInstance.get("/api/master/pabrik").catch(() => ({ data: { data: [] } })),
        ]);

        setMasterData({
          supir: supirRes.data.data || [],
          truk: trukRes.data.data || [],
          kebun: kebunRes.data.data || [],
          pabrik: pabrikRes.data.data || [],
        });
      } catch (error) {
        console.warn("Master data fallback ke input manual:", error);
      } finally {
        setMasterLoading(false);
      }
    };

    fetchMasterData();
  }, [userRole]);

  // Handle change untuk input text & select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file change + preview + validation
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setPesan({ type: "error", text: "File harus JPG, PNG, atau PDF" });
        e.target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setPesan({ type: "error", text: "Ukuran file maksimal 5MB" });
        e.target.value = "";
        return;
      }

      if (fileType === "surat_jalan") {
        setSuratJalan(file);
        setPreviewSuratJalan(URL.createObjectURL(file));
      } else if (fileType === "bukti_timbang") {
        setBuktiTimbang(file);
        setPreviewBuktiTimbang(URL.createObjectURL(file));
      }
    }
  };

  // 🛠️ PERBAIKAN UTAMA: Handle submit dengan konversi tipe data payload ke angka murni
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!suratJalan || !buktiTimbang) {
      setPesan({ type: "error", text: "Surat Jalan dan Bukti Timbang wajib diupload!" });
      return;
    }

    if (!formData.tanggal_kirim || !formData.berat_tbs || !formData.supir_idsupir || !formData.truk_idtruk) {
      setPesan({ type: "error", text: "Tanggal, Berat, Supir, dan Truk wajib diisi!" });
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setPesan({ type: "", text: "" });

    try {
      const data = new FormData();
      const userIdToSubmit = formData.users_idusers || localStorage.getItem('userId') || '1';
      
      // Proses pembersihan data agar disukai oleh database MySQL backend
      Object.keys(formData).forEach((key) => {
        if (key === 'users_idusers') {
          data.append(key, String(userIdToSubmit));
        } else if (key === 'berat_tbs') {
          data.append(key, Number(formData.berat_tbs)); // Konversi berat ke Number murni
        } else if (
          key === 'supir_idsupir' || 
          key === 'truk_idtruk' || 
          key === 'kebun_idkebun' || 
          key === 'pabrik_idpabrik'
        ) {
          // Konversi String ID dari Dropdown menjadi Integer Angka untuk Foreign Key DB
          if (formData[key]) {
            data.append(key, parseInt(formData[key], 10));
          }
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      data.append("surat_jalan", suratJalan);
      data.append("bukti_timbang", buktiTimbang);

      await axiosInstance.post("/api/distribusi", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      setPesan({ type: "success", text: "Data distribusi berhasil dibuat!" });
      
      // Reset State Form
      setFormData({
        tanggal_kirim: "",
        berat_tbs: "",
        users_idusers: localStorage.getItem('userId') || "",
        supir_idsupir: "",
        truk_idtruk: "",
        kebun_idkebun: "",
        pabrik_idpabrik: "",
        status: "menunggu_memuat",
      });
      setSuratJalan(null);
      setBuktiTimbang(null);
      setPreviewSuratJalan(null);
      setPreviewBuktiTimbang(null);
      setUploadProgress(0);

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Error submit:", error);
      const pesanErrorBackend = error.response?.data?.message || error.response?.data?.error || error.message;
      setPesan({ 
        type: "error", 
        text: "Gagal Simpan: " + pesanErrorBackend 
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMasterField = (label, name, options, placeholder, displayKey, idKey) => {
    const hasData = options && options.length > 0;
    const actualIdKey = idKey || `id${name.replace("_id", "")}`;
    
    return (
      <div className={`${styles['form-group-manifest']} ${styles['w-full']}`}>
        <label className={`${styles['block']} ${styles['text-sm']} ${styles['font-semibold']} ${styles['mb-2']}`}>
          {label} <span className={styles['required']}>*</span>
        </label>
        {masterLoading ? (
          <input 
            type="text" 
            placeholder="Memuat data..." 
            className={`${styles['form-control-manifest']} ${styles['bg-gray-100']}`} 
            disabled 
          />
        ) : hasData ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={styles['form-control-manifest']}
            required
          >
            <option value="">-- Pilih {label} --</option>
            {options.map((item) => (
              <option 
                key={item[actualIdKey]} 
                value={item[actualIdKey]}
              >
                {item[displayKey] || item.nama_supir || item.no_polisi || item.nama_kebun || item.nama_pabrik}
                {item.lokasi && ` - ${item.lokasi}`}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={styles['form-control-manifest']}
            required
          />
        )}
      </div>
    );
  };

  // 🔒 TUNING KONTRAST: Banner Manajer (WARNA HITAM) - CASE INSENSITIVE
  if (userRole === 'manajer' || userRole.includes('manajer')) {
    return (
      <Container>
        <div className={`${styles['alert']} ${styles['alert-info']} ${styles['p-4']} ${styles['rounded-lg']} ${styles['mb-6']}`}>
          <p className={`${styles['text-sm']} ${styles['font-bold']} ${styles['flex']} ${styles['items-center']} ${styles['gap-2']}`} style={{ color: '#000000' }}>
            🚫 Hak Akses Terbatas (Manajer Pemantau)
          </p>
          <p className={`${styles['text-xs']} ${styles['mt-2']} ${styles['font-semibold']}`} style={{ color: '#000000' }}>
            Formulir pendaftaran manifes distribusi baru disembunyikan secara otomatis. Otoritas akun Anda diset khusus untuk peninjauan log data (*Read-Only*) dan pengarsipan berkas demi keamanan data lapangan.
          </p>
        </div>
      </Container>
    );
  }

  // JIKA BUKAN MANAJER (PETUGAS), TAMPILKAN FORM SEPERTI BIASA
  return (
    <Container>
      <div className={`${styles['form-manifest-container']} ${styles['w-full']} ${styles['p-6']}`}>
        <h2 className={`${styles['form-manifest-title']} ${styles['mb-6']}`}>
          📝 Input Manifes Distribusi Baru
        </h2>
        
        {/* Pesan Alert */}
        {pesan.text && (
          <div className={`${styles['alert']} ${pesan.type === "success" ? styles['alert-success'] : styles['alert-error']} ${styles['mb-4']} ${styles['p-4']} ${styles['rounded-lg']} ${styles['text-sm']} ${styles['font-medium']}`}>
            {pesan.text}
          </div>
        )}

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && (
          <div className={`${styles['mb-4']}`}>
            <div className={`${styles['w-full']} ${styles['bg-gray-200']} ${styles['rounded-full']} ${styles['h-2.5']}`}>
              <div 
                className={`${styles['bg-green-600']} ${styles['h-2.5']} ${styles['rounded-full']} ${styles['transition-all']}`} 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className={`${styles['text-xs']} ${styles['text-gray-600']} ${styles['mt-2']}`}>Mengupload: {uploadProgress}%</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Informasi Pengiriman */}
          <div className={`${styles['form-section-manifest']} ${styles['mb-6']}`}>
            <h3 className={`${styles['form-section-manifest-title']} ${styles['mb-4']}`}>📦 Informasi Pengiriman</h3>
            <div className={`${styles['grid']} ${styles['grid-cols-1']} ${styles['md:grid-cols-2']} ${styles['gap-4']}`}>
              <div className={styles['form-group-manifest']}>
                <label className={`${styles['block']} ${styles['text-sm']} ${styles['font-semibold']} ${styles['mb-2']}`}>
                  Tanggal Pengiriman <span className={styles['required']}>*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_kirim"
                  value={formData.tanggal_kirim}
                  onChange={handleChange}
                  className={styles['form-control-manifest']}
                  required
                />
              </div>

              <div className={styles['form-group-manifest']}>
                <label className={`${styles['block']} ${styles['text-sm']} ${styles['font-semibold']} ${styles['mb-2']}`}>
                  Berat TBS (kg) <span className={styles['required']}>*</span>
                </label>
                <input
                  type="number"
                  name="berat_tbs"
                  value={formData.berat_tbs}
                  onChange={handleChange}
                  placeholder="Contoh: 5000"
                  className={styles['form-control-manifest']}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pihak Terkait */}
          <div className={`${styles['form-section-manifest']} ${styles['mb-6']}`}>
            <h3 className={`${styles['form-section-manifest-title']} ${styles['mb-4']}`}>👥 Pihak Terkait</h3>
            <div className={`${styles['grid']} ${styles['grid-cols-1']} ${styles['md:grid-cols-2']} ${styles['gap-4']}`}>
              {renderMasterField("Nama Supir", "supir_idsupir", masterData.supir, "Nama supir", "nama_supir", "idsupir")}
              {renderMasterField("No. Polisi", "truk_idtruk", masterData.truk, "Contoh: BM 1234 AA", "no_polisi", "idtruk")}
              {renderMasterField("Kebun Asal", "kebun_idkebun", masterData.kebun, "Nama kebun", "nama_kebun", "idkebun")}
              {renderMasterField("Pabrik Tujuan", "pabrik_idpabrik", masterData.pabrik, "Nama pabrik", "nama_pabrik", "idpabrik")}
            </div>
          </div>

          {/* Section 3: Status & Dokumen */}
          <div className={`${styles['form-section-manifest']} ${styles['mb-6']}`}>
            <h3 className={`${styles['form-section-manifest-title']} ${styles['mb-4']}`}>📋 Status & Dokumen</h3>
            
            <div className={`${styles['form-group-manifest']} ${styles['mb-6']}`}>
              <label className={`${styles['block']} ${styles['text-sm']} ${styles['font-semibold']} ${styles['mb-2']}`}>Status Awal Pengiriman</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles['form-control-manifest']}
              >
                <option value="menunggu_memuat">Menunggu Memuat</option>
                <option value="dalam_perjalanan">Dalam Perjalanan</option>
                <option value="tiba_di_pabrik">Tiba di Pabrik</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

            {/* File Upload Section */}
            <div className={`${styles['grid']} ${styles['grid-cols-1']} ${styles['md:grid-cols-2']} ${styles['gap-4']}`}>
              <div className={styles['file-upload-section']}> 
                <label className={`${styles['file-upload-label']} ${styles['block']} ${styles['text-sm']} ${styles['font-semibold']} ${styles['mb-2']}`}>
                  📄 Surat Jalan (Wajib)
                </label>
                <p className={styles['file-upload-hint']} style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  Format: JPG, PNG, PDF | Max: 5MB
                </p>
                <label className={styles['file-upload-wrapper-manifest']}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, "surat_jalan")}
                    required
                  />
                  <div className={styles['file-upload-text']}>
                    <span>{suratJalan ? suratJalan.name : 'Klik untuk upload surat jalan'}</span>
                    <span className={styles['file-upload-button']}>Choose File</span>
                  </div>
                </label>
                {previewSuratJalan && (
                  <div className={`${styles['mt-4']} ${styles['p-4']} ${styles['bg-gray-50']} ${styles['rounded-lg']} ${styles['border']}`}>
                    <p className={`${styles['text-xs']} ${styles['text-gray-600']} ${styles['mb-2']} ${styles['font-medium']}`}>Preview:</p>
                    {suratJalan?.type.includes("pdf") ? (
                      <iframe src={previewSuratJalan} className={`${styles['w-full']} ${styles['h-40']} ${styles['border']} ${styles['rounded']}`} title="Preview Surat Jalan" />
                    ) : (
                      <img src={previewSuratJalan} alt="Preview" className={`${styles['max-h-40']} ${styles['rounded']} ${styles['border']} ${styles['object-contain']}`} />
                    )}
                  </div>
                )}
              </div>

              <div className={styles['file-upload-section']}>
                <label className={`${styles['file-upload-label']} ${styles['block']} ${styles['text-sm']} ${styles['font-semibold']} ${styles['mb-2']}`}>
                  ⚖️ Bukti Timbang (Wajib)
                </label>
                <p className={styles['file-upload-hint']} style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                  Format: JPG, PNG, PDF | Max: 5MB
                </p>
                <label className={styles['file-upload-wrapper-manifest']}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, "bukti_timbang")}
                    required
                  />
                  <div className={styles['file-upload-text']}>
                    <span>{buktiTimbang ? buktiTimbang.name : 'Klik untuk upload bukti timbang'}</span>
                    <span className={styles['file-upload-button']}>Choose File</span>
                  </div>
                </label>
                {previewBuktiTimbang && (
                  <div className={`${styles['mt-4']} ${styles['p-4']} ${styles['bg-gray-50']} ${styles['rounded-lg']} ${styles['border']}`}>
                    <p className={`${styles['text-xs']} ${styles['text-gray-600']} ${styles['mb-2']} ${styles['font-medium']}`}>Preview:</p>
                    {buktiTimbang?.type.includes("pdf") ? (
                      <iframe src={previewBuktiTimbang} className={`${styles['w-full']} ${styles['h-40']} ${styles['border']} ${styles['rounded']}`} title="Preview Bukti Timbang" />
                    ) : (
                      <img src={previewBuktiTimbang} alt="Preview" className={`${styles['max-h-40']} ${styles['rounded']} ${styles['border']} ${styles['object-contain']}`} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`${styles['form-actions-manifest']} ${styles['flex']} ${styles['justify-end']} ${styles['gap-4']} ${styles['mt-6']} ${styles['pt-6']} ${styles['border-t']}`}>
            <button
              type="button"
              onClick={() => window.history.back()}
              className={styles['btn-cancel-manifest']}
            >
              ❌ Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles['btn-submit-manifest']}
            >
              {loading 
                ? (uploadProgress > 0 ? `Mengupload ${uploadProgress}%...` : "Menyimpan...") 
                : "✅ Simpan Manifes Distribusi"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default FormManifest;