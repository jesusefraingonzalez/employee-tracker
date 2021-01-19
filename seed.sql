USE employees_db;

INSERT INTO departments(name) VALUES ("Accounting");
INSERT INTO departments(name) VALUES ("Sales");

INSERT INTO roles(title, salary, department_id) VALUES ("Manager", 60000, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Dwigt", "Shrute", 1, 1);