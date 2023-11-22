-- AlterTable
ALTER TABLE `subscription` MODIFY `currency` ENUM('PLN', 'EUR', 'USD') NOT NULL DEFAULT 'PLN',
    MODIFY `start_date` DATE NOT NULL,
    MODIFY `end_date` DATE NULL,
    MODIFY `billing_period` ENUM('MONTHLY', 'QUERTERLY', 'YEARLY') NOT NULL DEFAULT 'MONTHLY',
    MODIFY `next_payment_date` DATE NOT NULL,
    MODIFY `status` ENUM('ACTIVE', 'NOT_ACTIVE') NOT NULL DEFAULT 'ACTIVE';
