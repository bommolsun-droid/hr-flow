-- HR Flow AI 테이블 스키마 (MariaDB)
-- 사용 전 DB를 먼저 생성하세요. 예: CREATE DATABASE hr_flow CHARACTER SET utf8mb4;

CREATE TABLE departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL
);

CREATE TABLE employees (
  employee_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  department_id INT NOT NULL,
  position VARCHAR(30) NOT NULL,
  hire_date DATE NOT NULL,
  birth_year INT,
  employment_status VARCHAR(10) NOT NULL,
  resignation_date DATE NULL,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  overtime_hours DECIMAL(4,1) DEFAULT 0,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE evaluations (
  evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  evaluation_date DATE NOT NULL,
  score DECIMAL(5,1) NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE training (
  training_id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  training_name VARCHAR(100) NOT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  completed_date DATE NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
