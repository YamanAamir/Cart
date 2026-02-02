-- AlterTable
ALTER TABLE `DealerRegistration` MODIFY `interestedBrands` JSON NOT NULL,
    MODIFY `sellBrands` JSON NOT NULL,
    MODIFY `authorizedDealer` JSON NOT NULL;

-- CreateTable
CREATE TABLE `savedBuilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `productIds` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `savedBuilds` ADD CONSTRAINT `savedBuilds_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

