-- AlterTable
ALTER TABLE `review_results` ADD COLUMN `review_meta` JSON NULL,
    ADD COLUMN `input_tokens` INTEGER NULL,
    ADD COLUMN `output_tokens` INTEGER NULL,
    ADD COLUMN `total_cost` DECIMAL(10, 4) NULL;
