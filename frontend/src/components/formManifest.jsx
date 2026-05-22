import React, { useState } from "react";
import axiosInstance from "../utils/axios"; // Mengarah ke file axios kelompokmu
import Container from "./Container"; // Menggunakan container penampung

const FormManifest = () => {
  const [formData, setFormData] = useState({
    no_polisi: "",
    nama_supir: "",
    tanggal: "",
    berat_tbs: "",
    status: "dalam_perjalanan",
  });

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
      // Menembak ke API backend kelompokmu menggunakan Axios interceptor
      const response = await axiosInstance.post("/api/distribusi", formData);
      
      setPesan({ type: "success", text: "✅ Data manifest berhasil disimpan!" });
      // Reset form setelah sukses input
      setFormData({
        no_polisi: "",
        nama_supir: "",
        tanggal: "",
        berat_tbs: "",
        status: "dalam_perjalanan",
      });
      
      // Reload halaman otomatis agar datanya langsung muncul di tabel bawah
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("Error input manifest:", error);
      setPesan({ 
        type: "error", 
        text: "❌ Gagal menyimpan data. Pastikan semua data terisi dan backend menyala." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md text-left">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Input Manifest Distribusi TBS</h2>
        
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
                name="tanggal"
                value={formData.tanggal}
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
              <option value="dalam_perjalanan">Dalam Perjalanan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Menyimpan..." : "Simpan Manifest"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default FormManifest;