USE employees_db;

INSERT INTO departments(name) VALUES ("Management");
INSERT INTO departments(name) VALUES ("Sales");
INSERT INTO departments(name) VALUES ("Accounting");

INSERT INTO roles(title, salary, department_id) VALUES ("Regional Manager", 60000, 1);
INSERT INTO roles(title, salary, department_id) VALUES ("Assistant to the Regional Manager", 50000, 1);
INSERT INTO roles(title, salary, department_id) VALUES ("Salesman", 45000, 2);
INSERT INTO roles(title, salary, department_id) VALUES ("Accountant", 45000, 2);

INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Dwigt", "Schrute", 2, 1);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Michael", "Scott", 1, null);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES ("Angela", "Martin", 4, 1);