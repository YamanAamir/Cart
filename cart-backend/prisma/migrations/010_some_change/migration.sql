-- AlterTable
ALTER TABLE `Product` DROP COLUMN `heightCm`,
    DROP COLUMN `lengthCm`,
    DROP COLUMN `weightKg`,
    DROP COLUMN `widthCm`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `heightIn` DECIMAL(8, 2) NOT NULL,
    ADD COLUMN `lengthIn` DECIMAL(8, 2) NOT NULL,
    ADD COLUMN `weightLb` DECIMAL(8, 2) NOT NULL,
    ADD COLUMN `widthIn` DECIMAL(8, 2) NOT NULL;

