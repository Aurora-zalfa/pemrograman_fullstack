import React from "react";
import styles from "../Dashboard/Dashboard.module.css";
import { FaPrint } from "react-icons/fa";
import html2pdf from "html2pdf.js";

const CetakLaporan = ({ laporanData, tanggalMulai, tanggalSelesai }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // ✅ FUNGSI GENERATE NAMA FILE OTOMATIS
  const generateFileName = () => {
    let bulan = '';
    let tahun = '';
    
    if (tanggalMulai) {
      const startDate = new Date(tanggalMulai);
      bulan = startDate.toLocaleDateString('id-ID', { month: 'long' });
      tahun = startDate.getFullYear();
    } else {
      const now = new Date();
      bulan = now.toLocaleDateString('id-ID', { month: 'long' });
      tahun = now.getFullYear();
    }

    return `Laporan_Pengiriman_${bulan}_${tahun}.pdf`;
  };

  // ✅ FUNGSI DOWNLOAD PDF OTOMATIS DENGAN html2pdf
  const handleDownloadPDF = () => {
    // Buat elemen sementara untuk di-convert ke PDF
    const element = document.createElement('div');
    
    let totalBerat = 0;
    laporanData.forEach(item => {
      totalBerat += parseFloat(item.berat_tbs || 0);
    });

    let tableRows = '';
    if (laporanData.length === 0) {
      tableRows = `<tr><td colspan="4" style="text-align:center;padding:40px;color:#999;font-size:14px;">📭 Tidak ada data laporan pada periode ini.</td></tr>`;
    } else {
      laporanData.forEach((item, idx) => {
        const isSelesai = item.status === 'selesai' || item.status === 'Selesai';
        const statusText = isSelesai ? 'Selesai' : 'Dalam Proses';
        const statusBg = isSelesai ? '#dcfce7' : '#fef3c7';
        const statusColor = isSelesai ? '#012A0D' : '#92400e';
        const statusBorder = isSelesai ? '1px solid #86efac' : '1px solid #fcd34d';
        
        tableRows += `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;"><strong>#LAP-${1000 + idx}</strong></td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${formatDate(item.tanggal)}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:bold;color:#F1AD00;">${parseFloat(item.berat_tbs).toLocaleString()} Kg</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">
              <span style="display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;background:${statusBg};color:${statusColor};border:${statusBorder};">
                ${statusText}
              </span>
            </td>
          </tr>
        `;
      });
    }

    // Bangun HTML untuk PDF
    element.innerHTML = `
      <div style="font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;padding:40px;background:white;max-width:1000px;margin:0 auto;">
        <!-- HEADER -->
        <div style="text-align:center;border-bottom:3px solid #012A0D;padding-bottom:20px;margin-bottom:30px;">
          <h1 style="color:#012A0D;margin:0;font-size:28px;font-weight:700;">
            📋 <span style="color:#F1AD00;">LAPORAN</span> PENGIRIMAN
          </h1>
          <p style="color:#555;margin:8px 0 0;font-size:16px;font-weight:500;">
            Periode: ${formatDate(tanggalMulai)} - ${formatDate(tanggalSelesai)}
          </p>
          <p style="font-size:13px;color:#999;margin-top:4px;">
            Dicetak: ${new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <!-- TABLE -->
        <table style="width:100%;border-collapse:collapse;margin-top:20px;">
          <thead>
            <tr>
              <th style="background:#012A0D;color:white;padding:12px 14px;text-align:left;font-size:14px;font-weight:600;width:20%;">No Laporan</th>
              <th style="background:#012A0D;color:white;padding:12px 14px;text-align:left;font-size:14px;font-weight:600;width:30%;">Tanggal Pengiriman</th>
              <th style="background:#012A0D;color:white;padding:12px 14px;text-align:left;font-size:14px;font-weight:600;width:25%;">Berat Muatan</th>
              <th style="background:#012A0D;color:white;padding:12px 14px;text-align:left;font-size:14px;font-weight:600;width:25%;">Keterangan Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <!-- FOOTER TOTAL -->
        <div style="margin-top:30px;padding:20px 30px;background:#f0fdf4;border-radius:10px;display:flex;justify-content:space-around;border:2px solid #012A0D;">
          <div style="text-align:center;">
            <div style="font-size:13px;color:#666;font-weight:500;">📦 Total Pengiriman</div>
            <div style="font-size:24px;font-weight:700;color:#012A0D;margin-top:4px;">${laporanData.length}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:13px;color:#666;font-weight:500;">⚖️ Total Berat</div>
            <div style="font-size:24px;font-weight:700;color:#012A0D;margin-top:4px;">
              <span style="color:#F1AD00;">${totalBerat.toLocaleString()}</span> Kg
            </div>
          </div>
        </div>

        <!-- FOOTER NOTE -->
        <div style="margin-top:30px;text-align:center;font-size:12px;color:#999;border-top:1px solid #e5e7eb;padding-top:15px;">
          Dokumen ini dibuat secara otomatis oleh Sistem Distribusi TBS
        </div>
      </div>
    `;

    // Konfigurasi PDF
    const opt = {
      margin: [10, 10, 10, 10],
      filename: generateFileName(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Download PDF
    html2pdf().set(opt).from(element).save();
  };

  return (
    <button
      onClick={handleDownloadPDF}
      style={{
        background: '#012A0D',
        color: '#F1AD00',
        border: '2px solid #F1AD00',
        padding: '10px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.background = '#F1AD00';
        e.target.style.color = '#012A0D';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#012A0D';
        e.target.style.color = '#F1AD00';
      }}
    >
      <FaPrint /> Cetak Laporan
    </button>
  );
};

export default CetakLaporan;