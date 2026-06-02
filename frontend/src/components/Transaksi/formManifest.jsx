import React, { useState, useEffect } from "react"; 
import axiosInstance from "../../utils/axios";
import styles from "../Dashboard/Dashboard.module.css";
import Container from "../Container"; 

const FormManifest = () => {
  // State untuk form data (MATCH dengan backend distribusi.js)
  const [formData, setFormData] = useState({
    tanggal_kirim: "",
    berat_tbs: "",
    users_idusers: localStorage.getItem('userId') || "", // Ambil dari login
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

  // Fetch master data dari API Zen (dengan fallback jika error)
  useEffect(() => {
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
  }, []);

  // Handle change untuk input text & select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file change + preview + validation
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validasi tipe file
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setPesan({ type: "error", text: "File harus JPG, PNG, atau PDF" });
        e.target.value = "";
        return;
      }

      // Validasi ukuran (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setPesan({ type: "error", text: "Ukuran file maksimal 5MB" });
        e.target.value = "";
        return;
      }

      // Set file & generate preview
      if (fileType === "surat_jalan") {
        setSuratJalan(file);
        setPreviewSuratJalan(URL.createObjectURL(file));
      } else if (fileType === "bukti_timbang") {
        setBuktiTimbang(file);
        setPreviewBuktiTimbang(URL.createObjectURL(file));
      }
    }
  };

  // Handle submit dengan upload file (FormData + multipart)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("userId dari localStorage:", localStorage.getItem('userId'));
    console.log("Token dari localStorage:", localStorage.getItem('token'));
    
    // Validasi file wajib
    if (!suratJalan || !buktiTimbang) {
      setPesan({ type: "error", text: "Surat Jalan dan Bukti Timbang wajib diupload!" });
      return;
    }

    // Validasi field wajib
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
      
      Object.keys(formData).forEach((key) => {
        if (key === 'users_idusers') {
          data.append(key, userIdToSubmit);
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
      
      // Reset form
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
      setPesan({ 
        type: "error", 
        text: "Gagal: " + (error.response?.data?.message || error.message) 
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper render dropdown dengan explicit idKey parameter
  const renderMasterField = (label, name, options, placeholder, displayKey, idKey) => {
    const hasData = options && options.length > 0;
    const actualIdKey = idKey || `id${name.replace("_id", "")}`;
    
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        {masterLoading ? (
          <input type="text" placeholder="Memuat data..." className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100" disabled />
        ) : hasData ? (
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-800"
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
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
            required
          />
        )}
      </div>
    );
  };

  return (
    <Container>
      <div className="p-6 w-full bg-white rounded-lg shadow-md text-left">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Input Manifes Distribusi Baru</h2>
        
        {/* Pesan Alert */}
        {pesan.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            pesan.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {pesan.text}
          </div>
        )}

        {/* Progress Bar Upload */}
        {loading && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">Mengupload: {uploadProgress}%</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tanggal Kirim */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Pengiriman</label>
              <input
                type="date"
                name="tanggal_kirim"
                value={formData.tanggal_kirim}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
                required
              />
            </div>

            {/* Berat TBS */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Berat TBS (kg)</label>
              <input
                type="number"
                name="berat_tbs"
                value={formData.berat_tbs}
                onChange={handleChange}
                placeholder="Contoh: 5000"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
                required
              />
            </div>

            {/* Dropdown Master Tanpa Emoji */}
            {renderMasterField("Nama Supir", "supir_idsupir", masterData.supir, "Nama supir", "nama_supir", "idsupir")}
            {renderMasterField("No. Polisi", "truk_idtruk", masterData.truk, "Contoh: BM 1234 AA", "no_polisi", "idtruk")}
            {renderMasterField("Kebun Asal", "kebun_idkebun", masterData.kebun, "Nama kebun", "nama_kebun", "idkebun")}
            {renderMasterField("Pabrik Tujuan", "pabrik_idpabrik", masterData.pabrik, "Nama pabrik", "nama_pabrik", "idpabrik")}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status Awal Pengiriman</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-gray-800"
            >
              <option value="menunggu_memuat">Menunggu Memuat</option>
              <option value="dalam_perjalanan">Dalam Perjalanan</option>
              <option value="tiba_di_pabrik">Tiba di Pabrik</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          {/* Upload Surat Jalan */}
          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Surat Jalan (Wajib)</label>
            <p className="text-xs text-gray-500 mb-2">Format: JPG, PNG, PDF | Max: 5MB</p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, "surat_jalan")}
              className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
            {previewSuratJalan && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-600 mb-2 font-medium">Preview:</p>
                {suratJalan?.type.includes("pdf") ? (
                  <iframe src={previewSuratJalan} className="w-full h-40 border rounded" title="Preview Surat Jalan" />
                ) : (
                  <img src={previewSuratJalan} alt="Preview" className="max-h-40 rounded border object-contain" />
                )}
              </div>
            )}
          </div>

          {/* Upload Bukti Timbang */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bukti Timbang (Wajib)</label>
            <p className="text-xs text-gray-500 mb-2">Format: JPG, PNG, PDF | Max: 5MB</p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, "bukti_timbang")}
              className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              required
            />
            {previewBuktiTimbang && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-600 mb-2 font-medium">Preview:</p>
                {buktiTimbang?.type.includes("pdf") ? (
                  <iframe src={previewBuktiTimbang} className="w-full h-40 border rounded" title="Preview Bukti Timbang" />
                ) : (
                  <img src={previewBuktiTimbang} alt="Preview" className="max-h-40 rounded border object-contain" />
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-bold rounded-lg shadow-md transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
              }`}
            >
              {loading 
                ? (uploadProgress > 0 ? `Mengupload ${uploadProgress}%...` : "Menyimpan...") 
                : "Simpan Manifes Distribusi"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default FormManifest;