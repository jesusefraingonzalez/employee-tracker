const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
// const {mysqlLogin, userPrompt} = require('./inquirer-questions.js')

let loginQuestions = [
    {
        type: "input",
        name: "username",
        message: "Enter your mysql username: "
    },
    {
        type: "password",
        name: "password",
        message: "Enter your mysql password: "
    }
];
let questions = [
    {
        type: "list",
        name: "tableOption",
        message: "Select a table: ",
        choices: ["Departments", "Roles", "Employees"]
    },
    {
        type: "list",
        name: "roleOperation",
        message: "Select operation: ",
        choices: ["Create", "Read", "Update"],
        when: (answers) => {
            return answers.tableOption === "Roles";
        }
    },
    {
        type: "list",
        name: "operation",
        message: "Select operation: ",
        choices: ["Create", "Read"],
        when: (answers) => {
            return (answers.tableOption === "Departments" || answers.tableOption === "Employees");
        }
    },
    {
        type: "input",
        name: "employeeFirstName",
        message: "Enter employee first name: ",
        when: (answers) => { return answers.roleOperations === "Create" }
    },
    {
        type: "input",
        name: "employeeLastName",
        message: "Enter employee last name: ",
        when: (answers) => { return answers.roleOperations === "Create" }
    },
    {
        type: "input",
        name: "employeeRole",
        message: "Enter employee role: ",
        when: (answers) => { return answers.roleOperations === "Create" }
    },
];

let departmentQuestions = [
    {
        type: "input",
        name: "department",
        message: "Enter department name: "
    },
];



let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employees_db"
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Now connected to mysql');
    viewEmployees();
    viewRoles();
    viewDepartments();
    // addDepartment();
    addRole();
})


function askQuestions() {
    inquirer.prompt(questions).then((res) => {
        console.log(res);
    });
}


function viewDepartments() {
    connection.query('SELECT * FROM departments;', (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}

function viewEmployees() {
    connection.query("SELECT * from employees", (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}

function viewRoles() {
    connection.query("SELECT * from roles", (err, res) => {
        if (err) throw err;
        console.table(res);
    });
}


function addDepartment() {
    inquirer
        .prompt({
            name: "departmentName",
            type: "input",
            message: "Enter department name: "
        })
        .then((res) => {
            connection.query("INSERT INTO departments (name) VALUES (?);", res.departmentName, (err, result) => {
                if (err) throw err;
                console.log(result);
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "Enter employee first name: "
            },
            {
                name: "last_name",
                type: "input",
                message: "Enter employee last name: "
            },
            {
                type: "input",
                name: "role_id",
                message: "Enter role id: "
            }
        ])
        .then((res) => {
            console.log(res);
            connection.query("INSERT INTO employees SET ?;", res, (err, result) => {
                if (err) throw err;
                console.log(result);
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "Enter the role name: "
            }, 
            {
                name: "salary",
                type: "input",
                message: "Enter the role salary: "
            },
            {
                name: "department_id",
                type: "input",
                message: "Enter department id: "
            }
        ])
        .then((res) => {
            connection.query("INSERT INTO roles SET ?;", res, (err, result) => {
                if (err) throw err;
                console.log(result);
            });
        });
}