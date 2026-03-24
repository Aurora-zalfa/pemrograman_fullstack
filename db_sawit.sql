SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;

SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';



CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;

USE `mydb` ;



-- -----------------------------------------------------

-- Table `mydb`.`users`

-- -----------------------------------------------------

CREATE  TABLE IF NOT EXISTS `mydb`.`users` (

  `idusers` INT NOT NULL AUTO_INCREMENT ,

  `username` VARCHAR(50) NOT NULL ,

  `password` VARCHAR(255) NOT NULL ,

  `role` ENUM('petugas','manajer') NOT NULL ,

  `created_at` TIMESTAMP NULL ,

  PRIMARY KEY (`idusers`) )

ENGINE = InnoDB;





-- -----------------------------------------------------

-- Table `mydb`.`kebun`

-- -----------------------------------------------------

CREATE  TABLE IF NOT EXISTS `mydb`.`kebun` (

  `idkebun` INT NOT NULL AUTO_INCREMENT ,

  `nama_kebun` VARCHAR(100) NOT NULL ,

  `lokasi` VARCHAR(255) NULL ,

  `luas_hektar` DECIMAL(10,2) NULL ,

  PRIMARY KEY (`idkebun`) )

ENGINE = InnoDB;





-- -----------------------------------------------------

-- Table `mydb`.`supir`

-- -----------------------------------------------------

CREATE  TABLE IF NOT EXISTS `mydb`.`supir` (

  `idsupir` INT NOT NULL AUTO_INCREMENT ,

  `nama_supir` VARCHAR(100) NOT NULL ,

  `no_hp` VARCHAR(45) NULL ,

  `status` ENUM('aktif','nonaktif') NOT NULL ,

  PRIMARY KEY (`idsupir`) )

ENGINE = InnoDB;





-- -----------------------------------------------------

-- Table `mydb`.`truk`

-- -----------------------------------------------------

CREATE  TABLE IF NOT EXISTS `mydb`.`truk` (

  `idtruk` INT NOT NULL AUTO_INCREMENT ,

  `no_polisi` VARCHAR(20) NOT NULL ,

  `kapasitas_ton` DECIMAL(10,2) NULL ,

  `status` ENUM('tersedia','dipakai','maintenance') NOT NULL ,

  PRIMARY KEY (`idtruk`) ,

  UNIQUE INDEX `no_polisi_UNIQUE` (`no_polisi` ASC) )

ENGINE = InnoDB;





-- -----------------------------------------------------

-- Table `mydb`.`pabrik`

-- -----------------------------------------------------

CREATE  TABLE IF NOT EXISTS `mydb`.`pabrik` (

  `idpabrik` INT NOT NULL AUTO_INCREMENT ,

  `nama_pabrik` VARCHAR(100) NOT NULL ,

  `lokasi` VARCHAR(255) NULL ,

  PRIMARY KEY (`idpabrik`) )

ENGINE = InnoDB;





-- -----------------------------------------------------

-- Table `mydb`.`distribusi`

-- -----------------------------------------------------

CREATE  TABLE IF NOT EXISTS `mydb`.`distribusi` (

  `iddistribusi` INT NOT NULL AUTO_INCREMENT ,

  `tanggal_kirim` DATE NOT NULL ,

  `berat_tbs` DECIMAL(10,2) NOT NULL ,

  `surat_jalan` VARCHAR(255) NULL ,

  `bukti_timbang` VARCHAR(255) NULL ,

  `status` ENUM('menunggu_memuat', 'dalam_perjalanan', 'tiba_di_pabrik','selesai', 'ditolak') NOT NULL ,

  `created_at` TIMESTAMP NULL ,

  `users_idusers` INT NOT NULL ,

  `supir_idsupir` INT NOT NULL ,

  `truk_idtruk` INT NOT NULL ,

  `kebun_idkebun` INT NOT NULL ,

  `pabrik_idpabrik` INT NOT NULL ,

  PRIMARY KEY (`iddistribusi`) ,

  INDEX `fk_distribusi_users` (`users_idusers` ASC) ,

  INDEX `fk_distribusi_supir1` (`supir_idsupir` ASC) ,

  INDEX `fk_distribusi_truk1` (`truk_idtruk` ASC) ,

  INDEX `fk_distribusi_kebun1` (`kebun_idkebun` ASC) ,

  INDEX `fk_distribusi_pabrik1` (`pabrik_idpabrik` ASC) ,

  CONSTRAINT `fk_distribusi_users`

    FOREIGN KEY (`users_idusers` )

    REFERENCES `mydb`.`users` (`idusers` )

    ON DELETE NO ACTION

    ON UPDATE NO ACTION,

  CONSTRAINT `fk_distribusi_supir1`

    FOREIGN KEY (`supir_idsupir` )

    REFERENCES `mydb`.`supir` (`idsupir` )

    ON DELETE NO ACTION

    ON UPDATE NO ACTION,

  CONSTRAINT `fk_distribusi_truk1`

    FOREIGN KEY (`truk_idtruk` )

    REFERENCES `mydb`.`truk` (`idtruk` )

    ON DELETE NO ACTION

    ON UPDATE NO ACTION,

  CONSTRAINT `fk_distribusi_kebun1`

    FOREIGN KEY (`kebun_idkebun` )

    REFERENCES `mydb`.`kebun` (`idkebun` )

    ON DELETE NO ACTION

    ON UPDATE NO ACTION,

  CONSTRAINT `fk_distribusi_pabrik1`

    FOREIGN KEY (`pabrik_idpabrik` )

    REFERENCES `mydb`.`pabrik` (`idpabrik` )

    ON DELETE NO ACTION

    ON UPDATE NO ACTION)

ENGINE = InnoDB;







SET SQL_MODE=@OLD_SQL_MODE;

SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

