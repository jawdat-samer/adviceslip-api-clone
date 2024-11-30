-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(300) NOT NULL,
    `email` VARCHAR(300) NOT NULL,
    `photo` VARCHAR(300) NOT NULL DEFAULT 'default.png',
    `password` VARCHAR(300) NOT NULL,
    `passwordUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `passwordResetToken` VARCHAR(300) NULL,
    `passwordResetExpiresAt` DATETIME(3) NULL,
    `role` ENUM('author', 'admin') NOT NULL DEFAULT 'author',
    `isActive` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
