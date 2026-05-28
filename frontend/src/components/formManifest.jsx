import React, { useState } from "react";
import Container from "./Container"; // Menggunakan container penampung
import UploadDistribusi from "./UploadDistribusi"; // Mengimpor komponen upload buatanmu

const FormManifest = () => {
  const [formData, setFormData] = useState({
    no_polisi: "",
    nama_supir: "",
    tanggal_kirim: "", 
    berat_tbs: "",
    status: "menunggu_memuat",
    users_idusers: 52,     // Default ID sesuai isi database kamu
    supir_idsupir: 1,      // Default ID supir awal
    truk_idtruk: 1,        // Default ID truk awal
    kebun_idkebun: 1,      // Default ID kebun awal
    pabrik_idpabrik: 1,    // Default ID pabrik awal
  });

  // Nama state disamakan agar tidak memicu ReferenceError atau data kosong
  const [suratJalan, setSuratJalan] = useState(null);
  const [buktiTimbang, setBuktiTimbang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan({ type: "", text: "" });

    try {
      console.log("Mengirim Multipart Form-Data melalui Fetch vanilla...");
      const dataToSend = new FormData();
      
      // 1. Tambahkan no_polisi dan nama_supir
      dataToSend.append("no_polisi", formData.no_polisi);
      dataToSend.append("nama_supir", formData.nama_supir);

      // 2. Append data teks lainnya dari state formData
      dataToSend.append("tanggal_kirim", formData.tanggal_kirim);
      dataToSend.append("berat_tbs", formData.berat_tbs);
      dataToSend.append("status", formData.status);
      dataToSend.append("users_idusers", formData.users_idusers);
      dataToSend.append("supir_idsupir", formData.supir_idsupir);
      dataToSend.append("truk_idtruk", formData.truk_idtruk);
      dataToSend.append("kebun_idkebun", formData.kebun_idkebun);
      dataToSend.append("pabrik_idpabrik", formData.pabrik_idpabrik);
      
      // 3. Ambil file fisik langsung dari state
      if (suratJalan) {
        dataToSend.append("surat_jalan", suratJalan);
      }
      if (buktiTimbang) {
        dataToSend.append("bukti_timbang", buktiTimbang);
      }
      
      // 4. Eksekusi POST menggunakan FETCH murni (Bypass Axios Interceptor Kelompok)
      const response = await fetch("http://localhost:3000/api/distribusi", {
        method: "POST",
        body: dataToSend,
        // CATATAN: Jangan memberikan header "Content-Type" manual di sini.
        // Browser akan otomatis menyusun boundary multipart/form-data yang benar.
      });

      // Ambil respons data JSON dari backend
      const resData = await response.json();
      
      if (response.ok || resData.success) {
        setPesan({ 
          type: "success", 
          text: `✅ ${resData.message || "Data & file berhasil disimpan ke database!"}` 
        });
        
        // Reset Form ke default setelah sukses
        setFormData({
          no_polisi: "",
          nama_supir: "",
          tanggal_kirim: "",
          berat_tbs: "",
          status: "menunggu_memuat",
          users_idusers: 52,
          supir_idsupir: 1,
          truk_idtruk: 1,
          kebun_idkebun: 1,
          pabrik_idpabrik: 1,
        });

        setSuratJalan(null);
        setBuktiTimbang(null);

        // Reload halaman setelah 1.5 detik agar tabel otomatis ter-update data baru
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // Jika fetch merespons gagal dari backend (misal error 400 atau 500)
        throw new Error(resData.message || "Gagal memproses request di server.");
      }

    } catch (error) {
      console.error("Error submit manifest:", error);
      setPesan({ 
        type: "error", 
        text: `❌ Gagal menyimpan data. Alasan: ${error.message || "Terjadi kesalahan autentikasi atau validasi pada data server."}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md text-left">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Input Transaksi Distribusi TBS & Upload Dokumen</h2>
        
        {pesan.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            pesan.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {pesan.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">No. Polisi Kendaraan</label>
              <input
                type="text"
                name="no_polisi"
                value={formData.no_polisi}
                onChange={handleChange}
                placeholder="Contoh: BM 1234 AA"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Supir</label>
              <input
                type="text"
                name="nama_supir"
                value={formData.nama_supir}
                onChange={handleChange}
                placeholder="Nama lengkap supir"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Pengiriman</label>
              <input
                type="date"
                name="tanggal_kirim"
                value={formData.tanggal_kirim}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Berat TBS (kg)</label>
              <input
                type="number"
                name="berat_tbs"
                value={formData.berat_tbs}
                onChange={handleChange}
                placeholder="Contoh: 5000"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status Distribusi</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800"
            >
              <option value="menunggu_memuat">Menunggu Memuat</option>
              <option value="dalam_perjalanan">Dalam Perjalanan</option>
              <option value="tiba_di_pabrik">Tiba Di Pabrik</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <UploadDistribusi 
              label="Surat Jalan (JPG/PNG/PDF)" 
              onFileSelect={(file) => setSuratJalan(file)} 
            />
            <UploadDistribusi 
              label="Bukti Timbang (JPG/PNG/PDF)" 
              onFileSelect={(file) => setBuktiTimbang(file)} 
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Transaksi Distribusi"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default FormManifest;