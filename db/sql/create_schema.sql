CREATE SCHEMA `log_cu` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cu_db_user'@'%' IDENTIFIED BY 'log_cu_2018';

GRANT ALL privileges ON log_cu.* TO 'cu_db_user'@'%'IDENTIFIED BY 'log_cu_2018';
