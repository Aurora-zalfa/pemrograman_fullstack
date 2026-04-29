SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

-- Menggunakan db_sawit agar sesuai dengan .env
CREATE SCHEMA IF NOT EXISTS `db_sawit` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `db_sawit` ;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `idusers` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('petugas','manajer') NOT NULL,
  `status` ENUM('active','inactive') DEFAULT 'active', -- Menyesuaikan kode master.js
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idusers`) 
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `kebun`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `kebun` (
  `idkebun` INT NOT NULL AUTO_INCREMENT,
  `nama_kebun` VARCHAR(100) NOT NULL,
  `lokasi` VARCHAR(255) NULL,
  `luas_hektar` DECIMAL(10,2) NULL,
  `is_deleted` TINYINT(1) DEFAULT 0, -- TAMBAHAN UNTUK SOFT DELETE
  PRIMARY KEY (`idkebun`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `supir`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `supir` (
  `idsupir` INT NOT NULL AUTO_INCREMENT,
  `nama_supir` VARCHAR(100) NOT NULL,
  `no_hp` VARCHAR(45) NULL,
  `is_deleted` TINYINT(1) DEFAULT 0, -- TAMBAHAN UNTUK SOFT DELETE
  PRIMARY KEY (`idsupir`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `truk`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `truk` (
  `idtruk` INT NOT NULL AUTO_INCREMENT,
  `no_polisi` VARCHAR(20) NOT NULL,
  `kapasitas_ton` DECIMAL(10,2) NULL,
  `is_deleted` TINYINT(1) DEFAULT 0, -- TAMBAHAN UNTUK SOFT DELETE
  PRIMARY KEY (`idtruk`),
  UNIQUE INDEX `no_polisi_UNIQUE` (`no_polisi` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `pabrik`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pabrik` (
  `idpabrik` INT NOT NULL AUTO_INCREMENT,
  `nama_pabrik` VARCHAR(100) NOT NULL,
  `lokasi` VARCHAR(255) NULL,
  `is_deleted` TINYINT(1) DEFAULT 0, -- TAMBAHAN UNTUK SOFT DELETE
  PRIMARY KEY (`idpabrik`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `distribusi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `distribusi` (
  `iddistribusi` INT NOT NULL AUTO_INCREMENT,
  `tanggal_kirim` DATE NOT NULL,
  `berat_tbs` DECIMAL(10,2) NOT NULL,
  `surat_jalan` VARCHAR(255) NULL,
  `bukti_timbang` VARCHAR(255) NULL,
  `status` ENUM('menunggu_memuat', 'dalam_perjalanan', 'tiba_di_pabrik','selesai', 'ditolak') NOT NULL,
  `is_deleted` TINYINT(1) DEFAULT 0, -- TAMBAHAN UNTUK SOFT DELETE TRANSAKSI
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `users_idusers` INT NOT NULL,
  `supir_idsupir` INT NOT NULL,
  `truk_idtruk` INT NOT NULL,
  `kebun_idkebun` INT NOT NULL,
  `pabrik_idpabrik` INT NOT NULL,
  PRIMARY KEY (`iddistribusi`),
  CONSTRAINT `fk_distribusi_users` FOREIGN KEY (`users_idusers`) REFERENCES `users` (`idusers`),
  CONSTRAINT `fk_distribusi_supir1` FOREIGN KEY (`supir_idsupir`) REFERENCES `supir` (`idsupir`),
  CONSTRAINT `fk_distribusi_truk1` FOREIGN KEY (`truk_idtruk`) REFERENCES `truk` (`idtruk`),
  CONSTRAINT `fk_distribusi_kebun1` FOREIGN KEY (`kebun_idkebun`) REFERENCES `kebun` (`idkebun`),
  CONSTRAINT `fk_distribusi_pabrik1` FOREIGN KEY (`pabrik_idpabrik`) REFERENCES `pabrik` (`idpabrik`)
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;