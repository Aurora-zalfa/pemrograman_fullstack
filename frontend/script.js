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
    document.getElementById("totalBerat").innerText =
      totalBerat + " Kg";

    document.getElementById("totalPengiriman").innerText =
      totalPengiriman;

  } catch (error) {
    console.log(error);
  }
}

getDashboardData();