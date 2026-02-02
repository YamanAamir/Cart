-- CreateIndex
CREATE UNIQUE INDEX `Product_name_brandId_modelId_typeId_color_key` ON `Product`(`name`, `brandId`, `modelId`, `typeId`, `color`);

