import React from "react";
import styles from "../Dashboard/Dashboard.module.css";
import { FaPrint } from "react-icons/fa";

const CetakLaporan = ({ laporanData, tanggalMulai, tanggalSelesai }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    
    if (!printWindow) {
      alert('Mohon izinkan popup untuk mencetak laporan.');
      return;
    }

    let totalBerat = 0;
    laporanData.forEach(item => {
      totalBerat += parseFloat(item.berat_tbs || 0);
    });

    const stylesHTML = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          margin: 0;
          background: white;
        }
        .print-header {
          text-align: center;
          border-bottom: 3px solid #012A0D;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .print-header h1 {
          color: #012A0D;
          margin: 0;
          font-size: 24px;
        }
        .print-header h1 span { color: #F1AD00; }
        .print-header p {
          color: #666;
          margin: 5px 0 0;
          font-size: 14px;
        }
        .print-header .sub {
          font-size: 12px;
          color: #999;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        table th {
          background: #012A0D;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 13px;
        }
        table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        table tr:nth-child(even) {
          background: #f9fafb;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-selesai {
          background: #dcfce7;
          color: #012A0D;
          border: 1px solid #86efac;
        }
        .status-proses {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }
        .total-section {
          margin-top: 30px;
          padding: 20px;
          background: #f0fdf4;
          border-radius: 8px;
          display: flex;
          justify-content: space-around;
          border: 2px solid #012A0D;
        }
        .total-section div {
          text-align: center;
        }
        .total-section .label {
          font-size: 12px;
          color: #666;
        }
        .total-section .value {
          font-size: 20px;
          font-weight: bold;
          color: #012A0D;
        }
        .total-section .value span {
          color: #F1AD00;
        }
        .print-footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        .no-data {
          text-align: center;
          padding: 40px;
          color: #999;
        }
        .berat-cell {
          font-weight: bold;
          color: #F1AD00;
        }
      </style>
    `;

    let tableRows = '';
    if (laporanData.length === 0) {
      tableRows = `<tr><td colspan="4" class="no-data">📭 Tidak ada data laporan pada periode ini.</td></tr>`;
    } else {
      laporanData.forEach((item, idx) => {
        const isSelesai = item.status === 'selesai' || item.status === 'Selesai';
        // TANPA ICON, hanya teks polosan
        const statusText = isSelesai ? 'Selesai' : 'Dalam Proses';
        const statusClass = isSelesai ? 'status-selesai' : 'status-proses';
        
        tableRows += `
          <tr>
            <td><strong>#LAP-${1000 + idx}</strong></td>
            <td>${formatDate(item.tanggal)}</td>
            <td class="berat-cell">${parseFloat(item.berat_tbs).toLocaleString()} Kg</td>
            <td>
              <span class="status-badge ${statusClass}">
                ${statusText}
              </span>
            </td>
          </tr>
        `;
      });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Pengiriman</title>
          ${stylesHTML}
        </head>
        <body>
          <div class="print-header">
            <h1>📋 <span>LAPORAN</span> PENGIRIMAN</h1>
            <p>Periode: ${formatDate(tanggalMulai)} - ${formatDate(tanggalSelesai)}</p>
            <p class="sub">Dicetak: ${new Date().toLocaleString('id-ID')}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 20%;">No Laporan</th>
                <th style="width: 30%;">Tanggal Pengiriman</th>
                <th style="width: 25%;">Berat Muatan</th>
                <th style="width: 25%;">Keterangan Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="total-section">
            <div>
              <div class="label">📦 Total Pengiriman</div>
              <div class="value">${laporanData.length}</div>
            </div>
            <div>
              <div class="label">⚖️ Total Berat</div>
              <div class="value"><span>${totalBerat.toLocaleString()}</span> Kg</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

  return (
    <button
      onClick={handlePrint}
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