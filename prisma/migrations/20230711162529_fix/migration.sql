/*
  Warnings:

  - The values [beef_bnurger] on the enum `Food_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `price` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `food` ADD COLUMN `price` INTEGER NOT NULL,
    MODIFY `type` ENUM('chi_burger', 'beef_burger', 'snack', 'dessert', 'cold_drink', 'hot_drink') NOT NULL;
