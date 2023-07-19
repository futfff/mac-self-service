-- AlterTable
ALTER TABLE `order` ADD COLUMN `status` ENUM('geting', 'ready') NOT NULL DEFAULT 'geting';
