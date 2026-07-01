-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2026 at 09:09 AM
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
-- Database: `nyawit_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `distribusi`
--

CREATE TABLE `distribusi` (
  `iddistribusi` int(11) NOT NULL,
  `tanggal_kirim` date NOT NULL,
  `nama_supir` varchar(100) DEFAULT NULL,
  `no_polisi` varchar(20) DEFAULT NULL,
  `berat_tbs` decimal(10,2) NOT NULL,
  `surat_jalan` varchar(255) DEFAULT NULL,
  `bukti_timbang` varchar(255) DEFAULT NULL,
  `status` enum('menunggu_memuat','dalam_perjalanan','tiba_di_pabrik','selesai','ditolak') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `users_idusers` int(11) NOT NULL,
  `supir_idsupir` int(11) NOT NULL,
  `truk_idtruk` int(11) NOT NULL,
  `kebun_idkebun` int(11) NOT NULL,
  `pabrik_idpabrik` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `distribusi`
--

INSERT INTO `distribusi` (`iddistribusi`, `tanggal_kirim`, `nama_supir`, `no_polisi`, `berat_tbs`, `surat_jalan`, `bukti_timbang`, `status`, `created_at`, `users_idusers`, `supir_idsupir`, `truk_idtruk`, `kebun_idkebun`, `pabrik_idpabrik`, `is_deleted`, `updated_at`) VALUES
(12, '2026-04-29', NULL, NULL, 7500.00, NULL, NULL, 'menunggu_memuat', '2026-04-29 12:00:04', 7, 1, 1, 1, 1, 0, NULL),
(13, '2026-05-01', 'Budi', 'B1234CD', 7500.00, NULL, NULL, 'tiba_di_pabrik', '2026-05-01 06:26:40', 7, 1, 1, 1, 1, 0, '2026-07-01 03:26:39'),
(14, '2026-04-29', 'Budi', 'B1234CD', 7500.00, NULL, NULL, 'tiba_di_pabrik', '2026-05-01 12:37:00', 7, 1, 1, 1, 1, 1, '2026-07-01 03:21:15'),
(15, '2026-04-29', 'Budi', 'B1234CD', 7500.00, NULL, NULL, 'selesai', '2026-05-01 12:45:34', 7, 1, 1, 1, 1, 1, '2026-07-01 03:20:43'),
(16, '2026-06-11', 'yanti', 'B1234CD', 6000.00, 'uploads/surat_jalan/surat_jalan-1781167255348-450170552.pdf', 'uploads/bukti_timbang/bukti_timbang-1781167255386-563870112.pdf', 'dalam_perjalanan', '2026-06-11 08:40:55', 6, 2, 1, 1, 1, 1, '2026-07-01 03:21:06'),
(33, '2026-07-01', NULL, NULL, 800.00, 'uploads/surat_jalan/surat_jalan-1782877145184-609882902.png', 'uploads/bukti_timbang/bukti_timbang-1782877145194-825672052.png', 'menunggu_memuat', '2026-07-01 03:39:05', 5, 1, 1, 1, 1, 0, '2026-07-01 03:39:05'),
(34, '2026-07-03', NULL, NULL, 89.00, 'uploads/surat_jalan/surat_jalan-1782877220495-834497405.png', 'uploads/bukti_timbang/bukti_timbang-1782877220503-337241449.png', 'selesai', '2026-07-01 03:40:20', 5, 2, 1, 1, 1, 0, '2026-07-01 03:40:20'),
(35, '2026-07-31', NULL, NULL, 88.00, 'uploads/surat_jalan/surat_jalan-1782877276455-212036337.png', 'uploads/bukti_timbang/bukti_timbang-1782877276464-345600750.png', 'tiba_di_pabrik', '2026-07-01 03:41:16', 5, 2, 1, 1, 1, 0, '2026-07-01 03:41:16'),
(36, '2026-07-14', 'anjasmara', 'B1234CD', 1000000.00, 'uploads/surat_jalan/surat_jalan-1782878379788-208815975.pdf', 'uploads/bukti_timbang/bukti_timbang-1782878379805-89058099.pdf', 'tiba_di_pabrik', '2026-07-01 03:59:39', 5, 3, 1, 1, 1, 0, '2026-07-01 04:01:11'),
(37, '2026-07-09', NULL, NULL, 766.00, 'uploads/surat_jalan/surat_jalan-1782878419100-865121126.pdf', 'uploads/bukti_timbang/bukti_timbang-1782878419132-17622091.pdf', 'tiba_di_pabrik', '2026-07-01 04:00:19', 5, 2, 1, 1, 1, 1, '2026-07-01 04:00:56'),
(38, '2026-07-09', NULL, NULL, 5555.00, 'uploads/surat_jalan/surat_jalan-1782878507829-975014106.pdf', 'uploads/bukti_timbang/bukti_timbang-1782878507845-393354368.pdf', 'tiba_di_pabrik', '2026-07-01 04:01:47', 5, 1, 1, 1, 1, 0, '2026-07-01 04:01:47'),
(39, '2026-07-14', NULL, NULL, 45670.00, 'uploads/surat_jalan/surat_jalan-1782878755174-29097391.pdf', 'uploads/bukti_timbang/bukti_timbang-1782878755184-808488569.pdf', 'tiba_di_pabrik', '2026-07-01 04:05:55', 5, 3, 1, 1, 1, 0, '2026-07-01 04:05:55'),
(40, '2026-07-17', NULL, NULL, 99999999.99, 'uploads/surat_jalan/surat_jalan-1782878841466-767372778.pdf', 'uploads/bukti_timbang/bukti_timbang-1782878841482-724714516.pdf', 'dalam_perjalanan', '2026-07-01 04:07:21', 5, 2, 1, 1, 1, 0, '2026-07-01 04:07:21'),
(41, '2026-07-01', NULL, NULL, 99999999.99, 'uploads/surat_jalan/surat_jalan-1782879036071-596528883.pdf', 'uploads/bukti_timbang/bukti_timbang-1782879036090-992560671.pdf', 'tiba_di_pabrik', '2026-07-01 04:10:36', 18, 2, 1, 1, 1, 1, '2026-07-01 04:11:53'),
(42, '2026-07-31', NULL, NULL, 9110.00, 'uploads/surat_jalan/surat_jalan-1782879310846-631929149.pdf', 'uploads/bukti_timbang/bukti_timbang-1782879310862-428436550.pdf', 'dalam_perjalanan', '2026-07-01 04:15:10', 18, 2, 1, 1, 1, 0, '2026-07-01 04:15:10'),
(43, '2026-06-11', 'yanti', 'B123411111', 99999999.99, 'uploads/surat_jalan/surat_jalan-1782879817536-498027646.pdf', 'uploads/bukti_timbang/bukti_timbang-1782879817554-930765866.pdf', 'tiba_di_pabrik', '2026-07-01 04:23:37', 18, 2, 1, 1, 1, 0, '2026-07-01 04:23:59'),
(44, '2026-07-22', 'sule', '22DDDIIO', 99999999.99, 'uploads/surat_jalan/surat_jalan-1782879987927-622094757.pdf', 'uploads/bukti_timbang/bukti_timbang-1782879987943-886145899.pdf', 'tiba_di_pabrik', '2026-07-01 04:26:27', 18, 4, 2, 2, 2, 1, '2026-07-01 04:34:31'),
(45, '2026-07-15', 'anjasmara', '22DDDIIO', 8777777.00, 'uploads/surat_jalan/surat_jalan-1782880506381-168763439.pdf', 'uploads/bukti_timbang/bukti_timbang-1782880506382-372247885.pdf', 'dalam_perjalanan', '2026-07-01 04:35:06', 18, 4, 2, 2, 2, 0, '2026-07-01 04:35:29'),
(46, '2026-07-16', 'sule', 'QWX55', 457.00, 'uploads/surat_jalan/surat_jalan-1782882998935-294296212.pdf', 'uploads/bukti_timbang/bukti_timbang-1782882999122-87587090.pdf', 'selesai', '2026-07-01 05:16:39', 18, 6, 3, 3, 3, 0, '2026-07-01 05:17:02'),
(47, '2026-01-05', 'yanti', 'B1234CD', 2.50, 'SJ-001-01', 'BT-001-01', 'selesai', '2026-01-05 01:30:00', 6, 2, 1, 1, 1, 0, NULL),
(48, '2026-01-12', 'anjasmara', '22DDDIIO', 3.20, 'SJ-002-01', 'BT-002-01', 'selesai', '2026-01-12 02:15:00', 7, 3, 2, 2, 2, 0, NULL),
(49, '2026-01-19', 'sule', 'QWX55', 1.80, 'SJ-003-01', 'BT-003-01', 'selesai', '2026-01-19 03:00:00', 8, 4, 3, 3, 3, 0, NULL),
(50, '2026-01-24', 'rasya', 'B1234CD', 2.10, 'SJ-004-01', 'BT-004-01', 'selesai', '2026-01-24 04:45:00', 9, 5, 1, 1, 1, 0, NULL),
(51, '2026-01-30', 'tono', '22DDDIIO', 4.00, 'SJ-005-01', 'BT-005-01', 'tiba_di_pabrik', '2026-01-30 07:20:00', 10, 6, 2, 2, 2, 0, NULL),
(52, '2026-02-03', 'yanti', 'QWX55', 2.80, 'SJ-006-02', 'BT-006-02', 'selesai', '2026-02-03 00:30:00', 6, 2, 3, 3, 3, 0, NULL),
(53, '2026-02-10', 'anjasmara', 'B1234CD', 3.50, 'SJ-007-02', 'BT-007-02', 'selesai', '2026-02-10 01:45:00', 7, 3, 1, 1, 1, 0, NULL),
(54, '2026-02-15', 'sule', '22DDDIIO', 1.50, 'SJ-008-02', 'BT-008-02', 'ditolak', '2026-02-15 06:00:00', 8, 4, 2, 2, 2, 0, NULL),
(55, '2026-02-20', 'rasya', 'QWX55', 2.30, 'SJ-009-02', 'BT-009-02', 'selesai', '2026-02-20 03:30:00', 9, 5, 3, 3, 3, 0, NULL),
(56, '2026-02-27', 'tono', 'B1234CD', 4.20, 'SJ-010-02', 'BT-010-02', 'selesai', '2026-02-27 08:10:00', 10, 6, 1, 1, 1, 0, NULL),
(57, '2026-03-05', 'yanti', '22DDDIIO', 3.00, 'SJ-011-03', 'BT-011-03', 'selesai', '2026-03-05 02:00:00', 6, 2, 2, 2, 2, 0, NULL),
(58, '2026-03-12', 'anjasmara', 'QWX55', 2.70, 'SJ-012-03', 'BT-012-03', 'selesai', '2026-03-12 01:15:00', 7, 3, 3, 3, 3, 0, NULL),
(59, '2026-03-18', 'sule', 'B1234CD', 1.90, 'SJ-013-03', 'BT-013-03', 'dalam_perjalanan', '2026-03-18 04:30:00', 8, 4, 1, 1, 1, 0, NULL),
(60, '2026-03-22', 'rasya', '22DDDIIO', 3.80, 'SJ-014-03', 'BT-014-03', 'selesai', '2026-03-22 07:00:00', 9, 5, 2, 2, 2, 0, NULL),
(61, '2026-03-29', 'tono', 'QWX55', 2.50, 'SJ-015-03', 'BT-015-03', 'selesai', '2026-03-29 09:45:00', 10, 6, 3, 3, 3, 0, NULL),
(62, '2026-04-04', 'yanti', 'B1234CD', 3.10, 'SJ-016-04', 'BT-016-04', 'selesai', '2026-04-04 00:00:00', 6, 2, 1, 1, 1, 0, NULL),
(63, '2026-04-10', 'anjasmara', '22DDDIIO', 2.20, 'SJ-017-04', 'BT-017-04', 'selesai', '2026-04-10 03:30:00', 7, 3, 2, 2, 2, 0, NULL),
(64, '2026-04-16', 'sule', 'QWX55', 4.50, 'SJ-018-04', 'BT-018-04', 'selesai', '2026-04-16 05:15:00', 8, 4, 3, 3, 3, 0, NULL),
(65, '2026-04-22', 'rasya', 'B1234CD', 1.70, 'SJ-019-04', 'BT-019-04', 'tiba_di_pabrik', '2026-04-22 01:45:00', 9, 5, 1, 1, 1, 0, NULL),
(66, '2026-04-28', 'tono', '22DDDIIO', 3.60, 'SJ-020-04', 'BT-020-04', 'selesai', '2026-04-28 07:30:00', 10, 6, 2, 2, 2, 0, NULL),
(67, '2026-05-03', 'yanti', 'QWX55', 2.90, 'SJ-021-05', 'BT-021-05', 'selesai', '2026-05-03 02:20:00', 6, 2, 3, 3, 3, 0, NULL),
(68, '2026-05-11', 'anjasmara', 'B1234CD', 3.30, 'SJ-022-05', 'BT-022-05', 'selesai', '2026-05-11 04:00:00', 7, 3, 1, 1, 1, 0, NULL),
(69, '2026-05-17', 'sule', '22DDDIIO', 1.40, 'SJ-023-05', 'BT-023-05', 'ditolak', '2026-05-17 08:30:00', 8, 4, 2, 2, 2, 0, NULL),
(70, '2026-05-22', 'rasya', 'QWX55', 4.80, 'SJ-024-05', 'BT-024-05', 'selesai', '2026-05-22 06:45:00', 9, 5, 3, 3, 3, 0, NULL),
(71, '2026-05-29', 'tono', 'B1234CD', 2.00, 'SJ-025-05', 'BT-025-05', 'selesai', '2026-05-29 03:10:00', 10, 6, 1, 1, 1, 0, NULL),
(72, '2026-06-05', 'yanti', '22DDDIIO', 3.70, 'SJ-026-06', 'BT-026-06', 'selesai', '2026-06-05 01:00:00', 6, 2, 2, 2, 2, 0, NULL),
(73, '2026-06-12', 'anjasmara', 'QWX55', 2.40, 'SJ-027-06', 'BT-027-06', 'selesai', '2026-06-12 02:30:00', 7, 3, 3, 3, 3, 0, NULL),
(74, '2026-06-18', 'sule', 'B1234CD', 5.00, 'SJ-028-06', 'BT-028-06', 'dalam_perjalanan', '2026-06-18 07:00:00', 8, 4, 1, 1, 1, 0, NULL),
(75, '2026-06-24', 'rasya', '22DDDIIO', 1.20, 'SJ-029-06', 'BT-029-06', 'menunggu_memuat', '2026-06-24 00:15:00', 9, 5, 2, 2, 2, 0, NULL),
(76, '2026-06-30', 'tono', 'QWX55', 3.90, 'SJ-030-06', 'BT-030-06', 'selesai', '2026-06-30 09:00:00', 10, 6, 3, 3, 3, 0, NULL),
(77, '2026-07-03', 'yanti', 'B1234CD', 2.80, 'SJ-031-07', 'BT-031-07', 'selesai', '2026-07-03 00:30:00', 6, 2, 1, 1, 1, 0, NULL),
(78, '2026-07-10', 'anjasmara', '22DDDIIO', 3.50, 'SJ-032-07', 'BT-032-07', 'selesai', '2026-07-10 02:00:00', 7, 3, 2, 2, 2, 0, NULL),
(79, '2026-07-17', 'sule', 'QWX55', 1.90, 'SJ-033-07', 'BT-033-07', 'tiba_di_pabrik', '2026-07-17 04:15:00', 8, 4, 3, 3, 3, 0, NULL),
(80, '2026-07-23', 'rasya', 'B1234CD', 4.20, 'SJ-034-07', 'BT-034-07', 'selesai', '2026-07-23 07:00:00', 9, 5, 1, 1, 1, 0, NULL),
(81, '2026-07-30', 'tono', '22DDDIIO', 2.60, 'SJ-035-07', 'BT-035-07', 'selesai', '2026-07-30 09:30:00', 10, 6, 2, 2, 2, 0, NULL),
(82, '2026-08-05', 'yanti', 'QWX55', 3.10, 'SJ-036-08', 'BT-036-08', 'selesai', '2026-08-05 01:00:00', 6, 2, 3, 3, 3, 0, NULL),
(83, '2026-08-12', 'anjasmara', 'B1234CD', 2.30, 'SJ-037-08', 'BT-037-08', 'selesai', '2026-08-12 03:30:00', 7, 3, 1, 1, 1, 0, NULL),
(84, '2026-08-18', 'sule', '22DDDIIO', 4.70, 'SJ-038-08', 'BT-038-08', 'dalam_perjalanan', '2026-08-18 06:45:00', 8, 4, 2, 2, 2, 0, NULL),
(85, '2026-08-24', 'rasya', 'QWX55', 1.80, 'SJ-039-08', 'BT-039-08', 'selesai', '2026-08-24 02:20:00', 9, 5, 3, 3, 3, 0, NULL),
(86, '2026-08-31', 'tono', 'B1234CD', 5.00, 'SJ-040-08', 'BT-040-08', 'selesai', '2026-08-31 08:00:00', 10, 6, 1, 1, 1, 0, NULL),
(87, '2026-09-04', 'yanti', '22DDDIIO', 2.90, 'SJ-041-09', 'BT-041-09', 'selesai', '2026-09-04 00:45:00', 6, 2, 2, 2, 2, 0, NULL),
(88, '2026-09-11', 'anjasmara', 'QWX55', 3.60, 'SJ-042-09', 'BT-042-09', 'selesai', '2026-09-11 04:00:00', 7, 3, 3, 3, 3, 0, NULL),
(89, '2026-09-16', 'sule', 'B1234CD', 1.50, 'SJ-043-09', 'BT-043-09', 'ditolak', '2026-09-16 07:30:00', 8, 4, 1, 1, 1, 0, NULL),
(90, '2026-09-22', 'rasya', '22DDDIIO', 4.00, 'SJ-044-09', 'BT-044-09', 'selesai', '2026-09-22 03:15:00', 9, 5, 2, 2, 2, 0, NULL),
(91, '2026-09-29', 'tono', 'QWX55', 2.20, 'SJ-045-09', 'BT-045-09', 'selesai', '2026-09-29 09:00:00', 10, 6, 3, 3, 3, 0, NULL),
(92, '2026-10-06', 'yanti', 'B1234CD', 3.30, 'SJ-046-10', 'BT-046-10', 'selesai', '2026-10-06 01:30:00', 6, 2, 1, 1, 1, 0, NULL),
(93, '2026-10-13', 'anjasmara', '22DDDIIO', 2.70, 'SJ-047-10', 'BT-047-10', 'selesai', '2026-10-13 02:45:00', 7, 3, 2, 2, 2, 0, NULL),
(94, '2026-10-19', 'sule', 'QWX55', 4.50, 'SJ-048-10', 'BT-048-10', 'tiba_di_pabrik', '2026-10-19 05:00:00', 8, 4, 3, 3, 3, 0, NULL),
(95, '2026-10-25', 'rasya', 'B1234CD', 1.60, 'SJ-049-10', 'BT-049-10', 'selesai', '2026-10-25 08:30:00', 9, 5, 1, 1, 1, 0, NULL),
(96, '2026-10-30', 'tono', '22DDDIIO', 3.80, 'SJ-050-10', 'BT-050-10', 'selesai', '2026-10-30 04:00:00', 10, 6, 2, 2, 2, 0, NULL),
(97, '2026-11-03', 'yanti', 'QWX55', 2.40, 'SJ-051-11', 'BT-051-11', 'selesai', '2026-11-03 00:00:00', 6, 2, 3, 3, 3, 0, NULL),
(98, '2026-11-10', 'anjasmara', 'B1234CD', 4.10, 'SJ-052-11', 'BT-052-11', 'selesai', '2026-11-10 03:00:00', 7, 3, 1, 1, 1, 0, NULL),
(99, '2026-11-17', 'sule', '22DDDIIO', 1.30, 'SJ-053-11', 'BT-053-11', 'dalam_perjalanan', '2026-11-17 07:00:00', 8, 4, 2, 2, 2, 0, NULL),
(100, '2026-11-23', 'rasya', 'QWX55', 5.20, 'SJ-054-11', 'BT-054-11', 'selesai', '2026-11-23 02:30:00', 9, 5, 3, 3, 3, 0, NULL),
(101, '2026-11-28', 'tono', 'B1234CD', 2.00, 'SJ-055-11', 'BT-055-11', 'selesai', '2026-11-28 09:00:00', 10, 6, 1, 1, 1, 0, NULL),
(102, '2026-12-04', 'yanti', '22DDDIIO', 3.00, 'SJ-056-12', 'BT-056-12', 'selesai', '2026-12-04 01:30:00', 6, 2, 2, 2, 2, 0, NULL),
(103, '2026-12-11', 'anjasmara', 'QWX55', 2.50, 'SJ-057-12', 'BT-057-12', 'selesai', '2026-12-11 04:00:00', 7, 3, 3, 3, 3, 0, NULL),
(104, '2026-12-16', 'sule', 'B1234CD', 4.30, 'SJ-058-12', 'BT-058-12', 'selesai', '2026-12-16 06:30:00', 8, 4, 1, 1, 1, 0, NULL),
(105, '2026-12-22', 'rasya', '22DDDIIO', 1.90, 'SJ-059-12', 'BT-059-12', 'ditolak', '2026-12-22 03:00:00', 9, 5, 2, 2, 2, 0, NULL),
(106, '2026-12-29', 'tono', 'QWX55', 3.50, 'SJ-060-12', 'BT-060-12', 'selesai', '2026-12-29 08:00:00', 10, 6, 3, 3, 3, 0, NULL),
(107, '2027-01-05', 'yanti', 'B1234CD', 2.70, 'SJ-061-01', 'BT-061-01', 'selesai', '2027-01-05 00:30:00', 6, 2, 1, 1, 1, 0, NULL),
(108, '2027-01-12', 'anjasmara', '22DDDIIO', 3.90, 'SJ-062-01', 'BT-062-01', 'selesai', '2027-01-12 02:45:00', 7, 3, 2, 2, 2, 0, NULL),
(109, '2027-01-18', 'sule', 'QWX55', 1.70, 'SJ-063-01', 'BT-063-01', 'tiba_di_pabrik', '2027-01-18 05:00:00', 8, 4, 3, 3, 3, 0, NULL),
(110, '2027-01-24', 'rasya', 'B1234CD', 4.60, 'SJ-064-01', 'BT-064-01', 'selesai', '2027-01-24 07:30:00', 9, 5, 1, 1, 1, 0, NULL),
(111, '2027-01-31', 'tono', '22DDDIIO', 2.10, 'SJ-065-01', 'BT-065-01', 'selesai', '2027-01-31 09:00:00', 10, 6, 2, 2, 2, 0, NULL),
(112, '2027-02-03', 'yanti', 'QWX55', 3.40, 'SJ-066-02', 'BT-066-02', 'selesai', '2027-02-03 01:00:00', 6, 2, 3, 3, 3, 0, NULL),
(113, '2027-02-10', 'anjasmara', 'B1234CD', 2.80, 'SJ-067-02', 'BT-067-02', 'tiba_di_pabrik', '2027-02-10 03:30:00', 7, 3, 1, 1, 1, 0, '2026-07-01 06:58:45'),
(114, '2027-02-15', 'sule', '22DDDIIO', 5.10, 'SJ-068-02', 'BT-068-02', 'selesai', '2027-02-15 06:00:00', 8, 4, 2, 2, 2, 1, '2026-07-01 06:56:45'),
(115, '2027-02-20', 'rasya', 'QWX55', 1.40, 'SJ-069-02', 'BT-069-02', 'dalam_perjalanan', '2027-02-20 02:15:00', 9, 5, 3, 3, 3, 1, '2026-07-01 06:55:58'),
(116, '2027-02-26', 'tono', 'B1234CD', 3.20, 'SJ-070-02', 'BT-070-02', 'selesai', '2027-02-26 08:30:00', 10, 6, 1, 1, 1, 1, '2026-07-01 06:55:34'),
(117, '2027-03-04', 'yanti', '22DDDIIO', 2.60, 'SJ-071-03', 'BT-071-03', 'selesai', '2027-03-04 00:45:00', 6, 2, 2, 2, 2, 1, '2026-07-01 06:53:19'),
(118, '2027-03-11', 'anjasmara', 'QWX55', 4.00, 'SJ-072-03', 'BT-072-03', 'selesai', '2027-03-11 04:15:00', 7, 3, 3, 3, 3, 1, '2026-07-01 06:48:08'),
(119, '2027-03-17', 'sule', 'B1234CD', 1.80, 'SJ-073-03', 'BT-073-03', 'ditolak', '2027-03-17 07:00:00', 8, 4, 1, 1, 1, 1, '2026-07-01 06:46:43'),
(120, '2027-03-23', 'rasya', '22DDDIIO', 3.70, 'SJ-074-03', 'BT-074-03', 'selesai', '2027-03-23 03:00:00', 9, 5, 2, 2, 2, 1, '2026-07-01 06:47:13'),
(121, '2027-03-30', 'tono', 'QWX55', 2.30, 'SJ-075-03', 'BT-075-03', 'tiba_di_pabrik', '2027-03-30 09:30:00', 10, 6, 3, 3, 3, 1, '2026-07-01 06:40:19'),
(122, '2026-07-25', 'Jamaludin', 'B 7981 UFH', 7997.00, 'uploads/surat_jalan/surat_jalan-1782886994794-265740512.pdf', 'uploads/bukti_timbang/bukti_timbang-1782886994894-416241354.pdf', 'tiba_di_pabrik', '2026-07-01 06:23:14', 21, 7, 5, 4, 4, 1, '2026-07-01 06:41:48');

-- --------------------------------------------------------

--
-- Table structure for table `kebun`
--

CREATE TABLE `kebun` (
  `idkebun` int(11) NOT NULL,
  `nama_kebun` varchar(100) NOT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `luas_hektar` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `kebun`
--

INSERT INTO `kebun` (`idkebun`, `nama_kebun`, `lokasi`, `luas_hektar`, `created_at`, `updated_at`, `is_deleted`) VALUES
(1, 'Kebun A', NULL, NULL, '2026-07-01 12:13:19', '2026-07-01 06:21:30', 1),
(2, 'Kebun Orang', 'Bandung', NULL, '2026-07-01 12:13:19', '2026-07-01 06:21:36', 1),
(3, 'Kebun C', 'Kalimantan', NULL, '2026-07-01 12:13:19', '2026-07-01 05:13:19', 0),
(4, 'Kebun Sawit Indonesia', 'Sulawesi Utara', NULL, '2026-07-01 13:21:14', '2026-07-01 06:21:23', 0),
(5, 'Kebun Oy', 'Bandung', NULL, '2026-07-01 13:59:25', '2026-07-01 06:59:25', 0);

-- --------------------------------------------------------

--
-- Table structure for table `pabrik`
--

CREATE TABLE `pabrik` (
  `idpabrik` int(11) NOT NULL,
  `nama_pabrik` varchar(100) NOT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `pabrik`
--

INSERT INTO `pabrik` (`idpabrik`, `nama_pabrik`, `lokasi`, `created_at`, `updated_at`, `is_deleted`) VALUES
(1, 'Pabrik X', NULL, '2026-07-01 12:13:19', '2026-07-01 06:22:18', 1),
(2, 'Palma Group', 'Jakarta', '2026-07-01 12:13:19', '2026-07-01 05:13:19', 0),
(3, 'Tropicana', 'Jakarta Timur', '2026-07-01 12:13:19', '2026-07-01 06:22:13', 0),
(4, 'PT. Sunco TBK', 'MM2100 Cikarang Barat', '2026-07-01 13:22:03', '2026-07-01 06:22:03', 0);

-- --------------------------------------------------------

--
-- Table structure for table `supir`
--

CREATE TABLE `supir` (
  `idsupir` int(11) NOT NULL,
  `nama_supir` varchar(100) NOT NULL,
  `no_hp` varchar(45) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `status` enum('aktif','nonaktif') NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `supir`
--

INSERT INTO `supir` (`idsupir`, `nama_supir`, `no_hp`, `created_at`, `status`, `is_deleted`, `updated_at`) VALUES
(1, 'Budi', NULL, '2026-07-01 12:13:19', 'aktif', 1, '2026-07-01 05:14:32'),
(2, 'yanti', '083867252482', '2026-07-01 12:13:19', 'aktif', 1, '2026-07-01 06:20:00'),
(3, 'anjasmara', '083867252484', '2026-07-01 12:13:19', 'aktif', 1, '2026-07-01 06:58:52'),
(4, 'sule', '0877771246', '2026-07-01 12:13:19', 'aktif', 0, '2026-07-01 06:58:59'),
(5, 'rasya', '08128889000', '2026-07-01 12:13:19', 'aktif', 0, '2026-07-01 05:07:31'),
(6, 'tono', '086555510', '2026-07-01 12:15:23', 'aktif', 0, '2026-07-01 05:15:23'),
(7, 'Jamaludin', '08123456754', '2026-07-01 13:19:37', 'aktif', 0, '2026-07-01 06:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `truk`
--

CREATE TABLE `truk` (
  `idtruk` int(11) NOT NULL,
  `no_polisi` varchar(20) NOT NULL,
  `kapasitas_ton` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('tersedia','dipakai','maintenance') NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `truk`
--

INSERT INTO `truk` (`idtruk`, `no_polisi`, `kapasitas_ton`, `created_at`, `updated_at`, `status`, `is_deleted`) VALUES
(1, 'B1234CD', 3000.00, '2026-07-01 12:13:19', '2026-07-01 06:59:06', 'tersedia', 1),
(2, '22DDDIIO', 90000.00, '2026-07-01 12:13:19', '2026-07-01 05:13:19', 'tersedia', 0),
(3, 'QWX55', 300.00, '2026-07-01 12:13:19', '2026-07-01 05:13:19', 'tersedia', 0),
(4, 'B 7433 BMG', 356.00, '2026-07-01 13:17:51', '2026-07-01 06:17:51', 'tersedia', 0),
(5, 'B 7981 UFH', 980.00, '2026-07-01 13:20:19', '2026-07-01 06:20:33', 'tersedia', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idusers` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('petugas','manajer') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`idusers`, `username`, `password`, `role`, `created_at`) VALUES
(5, 'admin', '$2b$10$JMOM4BHW3U.RFHZclwqbFO02vW/aPiP4o8RHEjkEfEgItZfJLrvU.', '', NULL),
(6, 'zahro', '$2b$10$d7dOV0bSV8SgwVCnC52TRORLVKa.yQIoe.pJi9zp4/DtquHq/hdAW', 'petugas', NULL),
(7, 'tester', '$2b$10$7jXSB9U7cwIqzMLmI8r5wOr7MupDiiQBN6GozgYV24f8pWhiVG5b.', 'petugas', NULL),
(8, 'iviw', '$2b$10$Br4D858VXXujk6fdRWNq9eX8KVxHkf0tJwCh7sNWmyyeHdyhWKHx.', 'petugas', NULL),
(9, 'viacantikihiw', '$2b$10$KlkWVrWrqsVvzpkzmpOSPes8qepwvKmps3wXqXFpbAD5ERaO8kxyu', 'petugas', NULL),
(10, 'Silvia Zahrodiniah', '$2b$10$YB0LftD5Q.Q/lqArVdBsi.Zg8DvENbIJc6sG/y6bch/TOXuEU5Qz6', 'petugas', '2026-06-01 14:18:14'),
(11, 'Silvia Zahrodiniah', '$2b$10$jGuGSO.tKmqJZF4E0ZB2z.scJfSeEuB8.NyfVgscIgw4sI0iepiaG', 'petugas', '2026-06-04 07:10:12'),
(12, 'Silvia Zahrodiniah', '$2b$10$VRdLEScYZ6jvLY6pwdp0EO9S.PlfLIsEPcow80oF9sWpw.ykrMdlm', 'petugas', '2026-06-04 07:10:31'),
(13, 'zahro', '$2b$10$rceim9zH5l.kCKCisetsrubNssdNKv3B476L0UGrLq9dhUSPycUQ6', 'petugas', '2026-06-04 07:10:59'),
(14, 'zahro', '$2b$10$.C8jxz17eUwHXJd8kUHiBOnRy.UOjCsIUTiSKAJsctpgN6biMXCT6', 'petugas', '2026-06-04 07:11:34'),
(15, 'silvia', '$2b$10$n4UDTraGRV.ER2JvttENC.2.W2RLKUy4h0jTLGykA0HjoNcvoJSt.', 'petugas', '2026-06-06 01:43:34'),
(16, '123', '$2b$10$M3XhCiuydeT3BzBr9eXp5eTyI.I0eAXX5fiDgLrVmn5aOiBEeipiO', 'manajer', '2026-06-06 01:45:48'),
(17, 'admin', '$2b$10$ZZN55aMdCKS6Bm7NQ62aGu6.TTR2FWW.xbk9wg5YfGQzXh9MW.Bby', 'petugas', '2026-07-01 03:58:15'),
(18, 'user', '$2b$10$Mx1MlrqSEd31PyJK13Wio.4jw28WS46p6nnNdVeljRXvmjCJjEGbO', 'petugas', '2026-07-01 03:58:46'),
(19, 'admin', '$2b$10$UQPNvqGBXZ9fS.HO6jbJeOVBS9JuUtFQnk73NFksEbOIgUvFkASMe', 'petugas', '2026-07-01 06:18:22'),
(20, 'admin', '$2b$10$Wr8020mgznjvRAY9C7qqa.rjzF4.qETOxwXZgEaH0hIp0cdlbN7fi', 'petugas', '2026-07-01 06:18:44'),
(21, 'admin_1', '$2b$10$heeR0zb2sBb219yZOhtar.AUB/0Ai6KkhP2ULtvZ0fIFElA2PZdFS', 'petugas', '2026-07-01 06:19:06'),
(22, 'manajer_1', '$2b$10$0a2zjdtwT9vGhtPh/mPZtuDk2WT9gAfkcqddmPGTI/Kv0H1MYkHvy', 'manajer', '2026-07-01 06:41:20');

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
  MODIFY `iddistribusi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `kebun`
--
ALTER TABLE `kebun`
  MODIFY `idkebun` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `pabrik`
--
ALTER TABLE `pabrik`
  MODIFY `idpabrik` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `supir`
--
ALTER TABLE `supir`
  MODIFY `idsupir` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `truk`
--
ALTER TABLE `truk`
  MODIFY `idtruk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `idusers` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `distribusi`
--
ALTER TABLE `distribusi`
  ADD CONSTRAINT `fk_distribusi_kebun1` FOREIGN KEY (`kebun_idkebun`) REFERENCES `kebun` (`idkebun`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_distribusi_pabrik1` FOREIGN KEY (`pabrik_idpabrik`) REFERENCES `pabrik` (`idpabrik`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_distribusi_supir1` FOREIGN KEY (`supir_idsupir`) REFERENCES `supir` (`idsupir`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_distribusi_truk1` FOREIGN KEY (`truk_idtruk`) REFERENCES `truk` (`idtruk`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_distribusi_users` FOREIGN KEY (`users_idusers`) REFERENCES `users` (`idusers`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
