DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    salary DECIMAL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employees(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);
