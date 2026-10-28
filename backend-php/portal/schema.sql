-- Ejecuta este script una vez en phpMyAdmin sobre la base de datos del portal.

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(190) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','patient','company') NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  cedula VARCHAR(50) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS company_patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_user_id INT NOT NULL,
  cedula VARCHAR(50) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
