-- CreateTable
CREATE TABLE `user_preferences` (
    `preference_id` VARCHAR(26) NOT NULL,
    `user_id` VARCHAR(50) NOT NULL,
    `language` VARCHAR(10) NOT NULL DEFAULT 'en',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `user_preferences_user_id_key`(`user_id`),
    PRIMARY KEY (`preference_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prompt_templates` (
    `template_id` VARCHAR(26) NOT NULL,
    `user_id` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `prompt` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `prompt_templates_user_id_type_idx`(`user_id`, `type`),
    UNIQUE INDEX `prompt_templates_user_id_name_type_key`(`user_id`, `name`, `type`),
    PRIMARY KEY (`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `check_list_sets` (
    `check_list_set_id` VARCHAR(26) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`check_list_set_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `check_lists` (
    `check_id` VARCHAR(26) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `parent_id` VARCHAR(26) NULL,
    `check_list_set_id` VARCHAR(26) NOT NULL,
    `document_id` VARCHAR(26) NULL,

    INDEX `idx_check_list_parent`(`parent_id`),
    INDEX `check_lists_check_list_set_id_fkey`(`check_list_set_id`),
    INDEX `idx_check_list_set_parent`(`check_list_set_id`, `parent_id`),
    PRIMARY KEY (`check_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `checklist_documents` (
    `document_id` VARCHAR(26) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `s3_path` VARCHAR(512) NOT NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `upload_date` TIMESTAMP(0) NOT NULL,
    `check_list_set_id` VARCHAR(26) NOT NULL,
    `user_id` VARCHAR(50) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `error_detail` TEXT NULL,

    INDEX `checklist_documents_check_list_set_id_fkey`(`check_list_set_id`),
    PRIMARY KEY (`document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_documents` (
    `review_document_id` VARCHAR(26) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `s3_path` VARCHAR(512) NOT NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `upload_date` TIMESTAMP(0) NOT NULL,
    `user_id` VARCHAR(50) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `review_job_id` VARCHAR(26) NOT NULL,

    INDEX `review_documents_review_job_id_fkey`(`review_job_id`),
    PRIMARY KEY (`review_document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_jobs` (
    `review_job_id` VARCHAR(26) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `error_detail` TEXT NULL,
    `check_list_set_id` VARCHAR(26) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL,
    `completed_at` TIMESTAMP(0) NULL,
    `user_id` VARCHAR(50) NULL,

    INDEX `review_jobs_check_list_set_id_fkey`(`check_list_set_id`),
    PRIMARY KEY (`review_job_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_results` (
    `review_result_id` VARCHAR(26) NOT NULL,
    `review_job_id` VARCHAR(26) NOT NULL,
    `check_id` VARCHAR(26) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `result` VARCHAR(20) NULL,
    `confidence_score` DOUBLE NULL,
    `explanation` TEXT NULL,
    `short_explanation` VARCHAR(80) NULL,
    `extracted_text` TEXT NULL,
    `user_override` BOOLEAN NOT NULL DEFAULT false,
    `user_comment` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL,
    `source_references` JSON NULL,

    INDEX `review_results_check_id_fkey`(`check_id`),
    INDEX `review_results_review_job_id_fkey`(`review_job_id`),
    INDEX `idx_review_results_job_status_result`(`review_job_id`, `status`, `result`),
    INDEX `idx_review_results_job_check`(`review_job_id`, `check_id`),
    PRIMARY KEY (`review_result_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `check_lists` ADD CONSTRAINT `check_lists_check_list_set_id_fkey` FOREIGN KEY (`check_list_set_id`) REFERENCES `check_list_sets`(`check_list_set_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `check_lists` ADD CONSTRAINT `check_lists_document_id_fkey` FOREIGN KEY (`document_id`) REFERENCES `checklist_documents`(`document_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `check_lists` ADD CONSTRAINT `check_lists_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `check_lists`(`check_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checklist_documents` ADD CONSTRAINT `checklist_documents_check_list_set_id_fkey` FOREIGN KEY (`check_list_set_id`) REFERENCES `check_list_sets`(`check_list_set_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_documents` ADD CONSTRAINT `review_documents_review_job_id_fkey` FOREIGN KEY (`review_job_id`) REFERENCES `review_jobs`(`review_job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_jobs` ADD CONSTRAINT `review_jobs_check_list_set_id_fkey` FOREIGN KEY (`check_list_set_id`) REFERENCES `check_list_sets`(`check_list_set_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_results` ADD CONSTRAINT `review_results_check_id_fkey` FOREIGN KEY (`check_id`) REFERENCES `check_lists`(`check_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_results` ADD CONSTRAINT `review_results_review_job_id_fkey` FOREIGN KEY (`review_job_id`) REFERENCES `review_jobs`(`review_job_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
