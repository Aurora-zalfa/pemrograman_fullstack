# 🌿 Nyawit Hunter — Sistem Manajemen Distribusi TBS

Nyawit Hunter adalah platform digital (Agri-Tech) berbasis web yang dirancang khusus untuk memonitor produksi, distribusi, dan pengiriman Tandan Buah Segar (TBS) kelapa sawit secara *real-time*. Platform ini menjamin transparansi dan akurasi data mulai dari titik penimbangan di kebun hingga proses penerimaan di pabrik kelapa sawit.

---

## 1. Tech Stack

### Frontend
- **React.js (v18+)** — Library utama untuk membangun antarmuka pengguna.
- **React Router DOM** — Manajemen navigasi dan routing halaman.
- **Tailwind CSS** — Framework CSS untuk desain *cinematic, editorial, & responsive*.
- **Axios** — HTTP client untuk komunikasi dengan backend API.
- **Recharts** — Library untuk visualisasi data (grafik garis, batang, dan pie).

### Backend & Database
- **Node.js & Express.js** — Runtime dan framework untuk server API.
- **MySQL** — Database relasional untuk menyimpan data transaksi, master, dan user.
- **JWT (JSON Web Token)** — Otentikasi dan otorisasi berbasis token.
- **dotenv, cors, bcryptjs** — Utilitas pendukung backend.

---

## 2. Project Structure

```text
nyawit-hunter/
├── backend/
│   ├── config/
│   │   └── database.js          # Koneksi ke MySQL
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── laporanController.js
│   │   ├── masterController.js
│   │   └── transaksiController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaksi.js
│   │   ├── Supir.js
│   │   ├── Truk.js
│   │   ├── Kebun.js
│   │   └── Pabrik.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── laporanRoutes.js
│   │   ├── masterRoutes.js
│   │   └── transaksiRoutes.js
│   ├── middleware/
│   │   └── auth.js              # Verifikasi JWT
│   ├── .env.example             # Contoh variabel lingkungan backend
│   ├── package.json
│   └── server.js                # Entry point backend
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── assets/
    │   │   └── hero.png         # Gambar ilustrasi login
    │   ├── components/
    │   │   ├── Master/
    │   │   │   └── MasterData.jsx
    │   │   ├── Laporan/
    │   │   │   └── FilterLaporan.jsx
    │   │   ├── Transaksi/
    │   │   │   ├── formManifest.jsx
    │   │   │   ├── TabelDistribusi.jsx
    │   │   │   └── KotakArsip.jsx
    │   │   └── ui/              # (opsional) komponen kecil
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global state autentikasi
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   └── Dashboard.jsx
    │   ├── utils/
    │   │   └── axios.js         # Instance Axios dengan interceptor
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example             # Contoh variabel lingkungan frontend
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js           # (jika menggunakan Vite)

```
## 3. Local Setup
Prerequisites
Node.js 18+ (LTS direkomendasikan)

npm 10+

MySQL Server (misal XAMPP, MySQL Workbench, atau standalone)

Langkah Instalasi
bash
### 1. Clone atau ekstrak proyek, lalu masuk ke direktori
cd nyawit-hunter

### 2. Install dependensi backend
cd backend
npm install

### 3. Install dependensi frontend
cd ../frontend
npm install

### 4. (Opsional) Salin file .env.example menjadi .env di masing-masing folder
###    dan isi sesuai kebutuhan — lihat bagian Environment Variables di bawah.

### 5. Jalankan server backend (development)
cd ../backend
npm run dev   # atau node server.js

### 6. Jalankan aplikasi frontend (development)
cd ../frontend
npm run dev

### 7. Buka browser di alamat yang muncul (biasanya http://localhost:5173)
Build untuk produksi (jika diperlukan)
bash
### Build frontend
cd frontend
npm run build

### Jalankan server backend dalam mode produksi (sesuaikan)
cd ../backend
NODE_ENV=production node server.js
4. Environment Variables
Aplikasi ini membutuhkan beberapa variabel lingkungan untuk berjalan. Buat file .env di masing-masing folder (backend/ dan frontend/) berdasarkan template .env.example.

Backend (backend/.env)
Variable	Wajib	Deskripsi
PORT	Ya	Port tempat server backend berjalan (contoh: 5000)
DB_HOST	Ya	Host database (biasanya localhost)
DB_USER	Ya	Username MySQL (contoh: root)
DB_PASSWORD	Ya	Password MySQL
DB_NAME	Ya	Nama database (contoh: nyawit_hunter_db)
JWT_SECRET	Ya	Kunci rahasia untuk menandatangani JWT
Contoh isi backend/.env:

env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nyawit_hunter_db
JWT_SECRET=rahasia_jwt_anda
Frontend (frontend/.env)
Variable	Wajib	Deskripsi
VITE_API_BASE_URL	Ya	URL base untuk API backend, misal http://localhost:5000/api
Contoh isi frontend/.env:

env
VITE_API_BASE_URL=http://localhost:5000/api
Catatan: Proyek ini menggunakan Vite sebagai bundler, sehingga variabel lingkungan harus diawali dengan VITE_ agar tersedia di sisi klien.

## 5. Setting Up Database
Pastikan MySQL server berjalan.

Buka MySQL client (misal mysql -u root -p) atau gunakan phpMyAdmin.

Buat database baru:

sql
CREATE DATABASE nyawit_hunter_db;
Import struktur tabel dan data awal (jika tersedia) dari file nyawit_hunter.sql yang disertakan dalam proyek.

bash
mysql -u root -p nyawit_hunter_db < path/to/nyawit_hunter.sql
Periksa konfigurasi koneksi di backend/config/database.js sudah sesuai dengan .env yang dibuat.

Jalankan backend, maka koneksi akan otomatis terbentuk.

## 6. Deployment Note
⚠️ Proyek ini dikembangkan untuk keperluan lokal dan presentasi kelompok.
Aplikasi tidak dideploy ke penyedia cloud publik (Vercel, Netlify, AWS, dll.).
Seluruh fitur berfungsi optimal dengan server lokal sesuai panduan Local Setup di atas.
Jika ingin mendeploy ke produksi, sesuaikan variabel lingkungan dan konfigurasi database dengan layanan hosting pilihan Anda.

## 7. Application Features
Autentikasi — Login/register dengan JWT, role-based access (petugas/manajer).

Dashboard — Ringkasan statistik (total berat, pengiriman, supir, armada, kebun, pabrik) disertai grafik:

Tren berat pengiriman (line chart)

Volume pengiriman harian (bar chart)

Kontribusi per kebun (pie chart)

Status pengiriman (pie chart)

Manajemen Master Data — CRUD untuk Supir, Truk, Kebun, Pabrik.

Transaksi — Input manifes baru (berat, supir, plat, status) dan daftar transaksi terkini. Hanya petugas yang dapat menambah.

Laporan — Filter berdasarkan rentang tanggal, tampilan tabel, dan cetak laporan.

Kotak Arsip — Khusus manajer untuk melihat riwayat transaksi yang sudah selesai.

Sidebar Navigasi — Menu dinamis sesuai role pengguna.

Logout — Hapus token dan redirect ke halaman login.

## 8. Notes on Data Layer
Backend menggunakan MySQL sebagai database utama dengan model-model yang didefinisikan di folder models/. Seluruh operasi CRUD dilakukan melalui query SQL langsung atau dengan bantuan ORM (jika digunakan).
Pada sisi frontend, data diambil melalui API dan disimpan sementara di state komponen (tidak ada global store seperti Redux/Zustand; manajemen state dilakukan secara lokal di tiap halaman).

