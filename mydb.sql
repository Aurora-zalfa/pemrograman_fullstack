-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 22, 2026 at 07:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `distribusi`
--

CREATE TABLE `distribusi` (
  `iddistribusi` int(11) NOT NULL,
  `tanggal_kirim` date NOT NULL,
  `berat_tbs` decimal(10,2) NOT NULL,
  `surat_jalan` varchar(255) DEFAULT NULL,
  `bukti_timbang` varchar(255) DEFAULT NULL,
  `status` enum('menunggu_memuat','dalam_perjalanan','tiba_di_pabrik','selesai','ditolak') NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `users_idusers` int(11) NOT NULL,
  `supir_idsupir` int(11) NOT NULL,
  `truk_idtruk` int(11) NOT NULL,
  `kebun_idkebun` int(11) NOT NULL,
  `pabrik_idpabrik` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kebun`
--

CREATE TABLE `kebun` (
  `idkebun` int(11) NOT NULL,
  `nama_kebun` varchar(100) NOT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `luas_hektar` decimal(10,2) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `kebun`
--

INSERT INTO `kebun` (`idkebun`, `nama_kebun`, `lokasi`, `luas_hektar`, `is_deleted`, `updated_at`) VALUES
(1, 'Bogor Barat', 'Jawa', NULL, 0, '2026-05-22 16:45:24'),
(2, 'Sawit X', 'Malang', NULL, 0, '2026-05-22 15:47:30'),
(3, 'RRR', 'TTT', NULL, 0, '2026-05-22 16:30:50'),
(4, 'yuyuyu', 'iiii', NULL, 0, '2026-05-22 16:32:08');

-- --------------------------------------------------------

--
-- Table structure for table `pabrik`
--

CREATE TABLE `pabrik` (
  `idpabrik` int(11) NOT NULL,
  `nama_pabrik` varchar(100) NOT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `pabrik`
--

INSERT INTO `pabrik` (`idpabrik`, `nama_pabrik`, `lokasi`, `is_deleted`, `updated_at`) VALUES
(1, 'Jokowi', 'Bogor', 0, '2026-05-22 16:12:13'),
(2, 'Palmia', 'Jogja', 0, '2026-05-22 15:47:50'),
(3, 'ABV', 'ui', 0, '2026-05-22 16:12:22');

-- --------------------------------------------------------

--
-- Table structure for table `supir`
--

CREATE TABLE `supir` (
  `idsupir` int(11) NOT NULL,
  `nama_supir` varchar(100) NOT NULL,
  `no_hp` varchar(45) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `supir`
--

INSERT INTO `supir` (`idsupir`, `nama_supir`, `no_hp`, `is_deleted`, `updated_at`) VALUES
(1, 'Supir Baru Zainab', '08129999000', 1, '2026-05-22 14:58:39'),
(2, 'Supir Budi', '0812345', 1, '2026-05-01 09:50:21'),
(3, 'Bambang', '081222333444', 1, '2026-05-01 12:41:41'),
(4, 'Bambang', '081222333444', 1, '2026-05-02 15:10:04'),
(5, 'iuiuiui', '9009090', 1, '2026-05-22 15:48:09'),
(6, 'AAAAAAAhhhhhhh', '0909090', 1, '2026-05-22 16:44:33'),
(7, 'Ekor', '08100022289', 0, '2026-05-22 16:44:43'),
(8, 'Endang', '0988989', 0, '2026-05-22 15:47:00'),
(9, 'pppppppp', '09909090', 0, '2026-05-22 15:50:33'),
(10, 'Ekos', '123', 0, '2026-05-22 15:50:53'),
(11, 'AAAAAAAAA', '0909090', 0, '2026-05-22 16:03:27'),
(12, 'Wowok subi', '9899', 0, '2026-05-22 16:10:53');

-- --------------------------------------------------------

--
-- Table structure for table `truk`
--

CREATE TABLE `truk` (
  `idtruk` int(11) NOT NULL,
  `no_polisi` varchar(20) NOT NULL,
  `kapasitas_ton` decimal(10,2) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `truk`
--

INSERT INTO `truk` (`idtruk`, `no_polisi`, `kapasitas_ton`, `is_deleted`, `updated_at`) VALUES
(1, 'yyyu', NULL, 1, '2026-05-22 15:25:59'),
(2, 'ioioio', 80000.00, 1, '2026-05-22 16:11:37'),
(3, 'UUYUYU', 999.00, 1, '2026-05-22 16:44:49'),
(4, 'YTYYK', 88.00, 0, '2026-05-22 16:45:10'),
(5, 'QSS23', 80.00, 0, '2026-05-22 16:44:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idusers` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('petugas','manajer') NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`idusers`, `username`, `password`, `role`, `status`, `created_at`, `is_deleted`) VALUES
(1, 'zainab_aznur', '$2b$10$xYKdruUNYAD5jBoeNQpbg.QRngBg8GhxXEwtj8GZIDVRPAbHk6UvS', 'petugas', 'active', '2026-05-01 09:15:40', 0),
(2, 'zainab_aznur', '$2b$10$j3MW9W6zI7Ln.YciSD0ZreG9EXh9aZKzTyN4TBRLGyMxLEYkjVg8y', 'manajer', 'active', '2026-05-01 09:15:50', 0),
(3, 'budi_manajer', '$2b$10$s2nPWxYw9jJesXiDE1khg.chf0sGKJR0csgaS9SgbdvdsbfmLCobq', 'manajer', 'active', '2026-05-01 09:35:54', 0),
(4, 'budi_petugas', '$2b$10$FN4AF/lY9p8dDUEuKuLEjeeiRo9/XKaHAFC081juLQ3irMfZbpM0y', 'petugas', 'active', '2026-05-01 09:36:43', 0),
(5, 'bunga', '$2b$10$Dr6PjX7FUoeUzVUPPlCIneEP4I5zrEnhRmeOI1BiEZONTlRTKX8wS', 'manajer', 'active', '2026-05-01 12:37:21', 0),
(6, 'raihan', '$2b$10$dYxKDqmghXx2xbgrfAlnR.Ti2He8pUlbZFKOQSE.OwU10ToCA9/aa', 'petugas', 'active', '2026-05-01 12:37:40', 0),
(7, 'admin_aurora', '$2b$10$s2nPWxYw9jJesXiDE1khg.chf0sGKJR0csgaS9Sgbdv8tFBw7q2a', 'manajer', 'active', '2026-05-22 13:54:31', 0),
(8, 'zainab_test', 'HASIL_HASH_DARI_SCRIPT_DIATAS', 'manajer', 'active', '2026-05-22 13:56:13', 0),
(9, 'zainab_fix', '$2b$10$oUpyPExL4Ma0XpymCKeoaegDl6Z3WCPnTHreT/amHwFhfWHdq1o06', 'manajer', 'active', '2026-05-22 14:00:24', 0),
(10, 'zainab_baru', '$2b$10$hG60j0a/O3fS9dA5GMefuu8Uqd85uQWto65Afzia82fUsQ4iQefK6', 'manajer', 'active', '2026-05-22 14:32:23', 0),
(11, 'zainab1779460864721', '$2b$10$dhIyJANUWTpQp9Bq9Cxlv.ZVccRm6HFcl7KHzrNHcpkHp/xxrFugq', 'manajer', 'active', '2026-05-22 14:41:04', 0),
(12, 'zainab_final', '$2b$10$mAUKImNUlF25e6JiLEeBj.KUITBzlk/v9.lQmE3hkHLFaT0d.VpKG', 'manajer', 'active', '2026-05-22 14:47:28', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `distribusi`
--
ALTER TABLE `distribusi`
  ADD PRIMARY KEY (`iddistribusi`),
  ADD KEY `fk_distribusi_users` (`users_idusers`),
  ADD KEY `fk_distribusi_supir1` (`supir_idsupir`),
  ADD KEY `fk_distribusi_truk1` (`truk_idtruk`),
  ADD KEY `fk_distribusi_kebun1` (`kebun_idkebun`),
  ADD KEY `fk_distribusi_pabrik1` (`pabrik_idpabrik`);

--
-- Indexes for table `kebun`
--
ALTER TABLE `kebun`
  ADD PRIMARY KEY (`idkebun`);

--
-- Indexes for table `pabrik`
--
ALTER TABLE `pabrik`
  ADD PRIMARY KEY (`idpabrik`);

--
-- Indexes for table `supir`
--
ALTER TABLE `supir`
  ADD PRIMARY KEY (`idsupir`);

--
-- Indexes for table `truk`
--
ALTER TABLE `truk`
  ADD PRIMARY KEY (`idtruk`),
  ADD UNIQUE KEY `no_polisi_UNIQUE` (`no_polisi`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idusers`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `distribusi`
--
ALTER TABLE `distribusi`
  MODIFY `iddistribusi` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kebun`
--
ALTER TABLE `kebun`
  MODIFY `idkebun` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pabrik`
--
ALTER TABLE `pabrik`
  MODIFY `idpabrik` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `supir`
--
ALTER TABLE `supir`
  MODIFY `idsupir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `truk`
--
ALTER TABLE `truk`
  MODIFY `idtruk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `idusers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `distribusi`
--
ALTER TABLE `distribusi`
  ADD CONSTRAINT `fk_distribusi_kebun1` FOREIGN KEY (`kebun_idkebun`) REFERENCES `kebun` (`idkebun`),
  ADD CONSTRAINT `fk_distribusi_pabrik1` FOREIGN KEY (`pabrik_idpabrik`) REFERENCES `pabrik` (`idpabrik`),
  ADD CONSTRAINT `fk_distribusi_supir1` FOREIGN KEY (`supir_idsupir`) REFERENCES `supir` (`idsupir`),
  ADD CONSTRAINT `fk_distribusi_truk1` FOREIGN KEY (`truk_idtruk`) REFERENCES `truk` (`idtruk`),
  ADD CONSTRAINT `fk_distribusi_users` FOREIGN KEY (`users_idusers`) REFERENCES `users` (`idusers`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
