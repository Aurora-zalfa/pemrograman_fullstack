const CetakLaporan = () => {
  const handleCetak = () => {
    window.print(); // Fungsi cetak halaman
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        🖨️ Cetak Laporan
      </h3>
      
      <button
        onClick={handleCetak}
        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
      >
        📄 Cetak Laporan (Print)
      </button>
    </div>
  );
};

export default CetakLaporan;