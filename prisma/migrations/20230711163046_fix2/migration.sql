/*
  Warnings:

  - The values [me] on the enum `Order_placement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `placement` ENUM('hall', 'go') NOT NULL;
