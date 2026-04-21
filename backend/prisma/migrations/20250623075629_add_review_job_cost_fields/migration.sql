-- AlterTable
ALTER TABLE `review_jobs` ADD COLUMN `total_cost` DECIMAL(10, 4) NULL,
    ADD COLUMN `total_input_tokens` INTEGER NULL,
    ADD COLUMN `total_output_tokens` INTEGER NULL;
