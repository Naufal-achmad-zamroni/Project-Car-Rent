/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdminId` on the `admin` table. All the data in the column will be lost.
  - The primary key for the `car` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carId` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `harga_perhari` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `merkMobil` on the `car` table. All the data in the column will be lost.
  - The primary key for the `rent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `carId` on the `rent` table. All the data in the column will be lost.
  - You are about to drop the column `rentId` on the `rent` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalSewa` on the `rent` table. All the data in the column will be lost.
  - You are about to drop the column `totalBayar` on the `rent` table. All the data in the column will be lost.
  - The `lamaSewa` column on the `rent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminID` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carID` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carID` to the `Rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentID` to the `Rent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `rent` DROP FOREIGN KEY `Rent_carId_fkey`;

-- AlterTable
ALTER TABLE `admin` DROP PRIMARY KEY,
    DROP COLUMN `AdminId`,
    ADD COLUMN `adminID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`adminID`);

-- AlterTable
ALTER TABLE `car` DROP PRIMARY KEY,
    DROP COLUMN `carId`,
    DROP COLUMN `harga_perhari`,
    DROP COLUMN `merkMobil`,
    ADD COLUMN `carID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `hargaperhari` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `merkmobil` VARCHAR(191) NOT NULL DEFAULT '',
    ADD PRIMARY KEY (`carID`);

-- AlterTable
ALTER TABLE `rent` DROP PRIMARY KEY,
    DROP COLUMN `carId`,
    DROP COLUMN `rentId`,
    DROP COLUMN `tanggalSewa`,
    DROP COLUMN `totalBayar`,
    ADD COLUMN `carID` INTEGER NOT NULL,
    ADD COLUMN `rentID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `totalbayar` INTEGER NOT NULL DEFAULT 0,
    DROP COLUMN `lamaSewa`,
    ADD COLUMN `lamaSewa` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`rentID`);

-- CreateIndex
CREATE UNIQUE INDEX `Admin_email_key` ON `Admin`(`email`);

-- AddForeignKey
ALTER TABLE `Rent` ADD CONSTRAINT `Rent_carID_fkey` FOREIGN KEY (`carID`) REFERENCES `Car`(`carID`) ON DELETE RESTRICT ON UPDATE CASCADE;
